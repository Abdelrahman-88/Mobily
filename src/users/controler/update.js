const { StatusCodes } = require("http-status-codes");
const { nanoid } = require('nanoid');
const sendEmail = require("../../../common/service/sendEmail");
const { updateTemplate, forgetTemplate } = require("../../../common/service/template");
const User = require("../model/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const updateProfile = async(req, res) => {
    try {
        let { email, companyName, city, mapLocation } = req.body;
        email = email.toLowerCase()
        const { id } = req.params;
        if (req.fileValidationError) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: req.fileValidationError });
        } else {
            if (id == req.user._id) {
                if (email == req.user.email) {
                    let data;
                    if (req.file) {
                        let profilePic = {
                            name: req.file.filename,
                            url: process.env.URL + 'displayForms/' + req.file.filename
                        }
                        data = await User.findByIdAndUpdate({ _id: id }, { companyName, city, mapLocation, profilePic }, { new: true });
                    } else {
                        data = await User.findByIdAndUpdate({ _id: id }, { companyName, city, mapLocation }, { new: true });
                    }
                    const { password, verificationKey, verified, deactivated, blocked, forgetPassword, ...rest } = data._doc
                    const token = jwt.sign({...rest }, process.env.SECRET_KEY)
                    res.status(StatusCodes.OK).json({ message: "Updated successfully", token });
                } else {
                    const emailExist = await User.findOne({ email, deactivated: false });
                    if (emailExist) {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already exist" });
                    } else {
                        const subject = `Email confirmation`
                        const verificationKey = nanoid()
                        let data;
                        if (req.file) {
                            let profilePic = {
                                name: req.file.filename,
                                url: process.env.URL + 'displayProfilePic/' + req.file.filename
                            }
                            data = await User.findByIdAndUpdate({ _id: id }, { email, companyName, city, mapLocation, verified: false, logedIn: false, verificationKey, profilePic }, { new: true });
                        } else {
                            data = await User.findByIdAndUpdate({ _id: id }, { email, companyName, city, mapLocation, verified: false, logedIn: false, verificationKey }, { new: true });
                        }
                        const info = await sendEmail([email], updateTemplate(verificationKey), subject)
                        if (info.messageId) {
                            const token = jwt.sign({ _id: data._id }, process.env.SECRET_KEY)
                            res.status(StatusCodes.OK).json({ message: "Updated successfully verify email", token });
                        } else {
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Send verification email error" });
                        }
                    }
                }
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
            }
        }

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to update profile" });
    }
}


const updatePassword = async(req, res) => {
    try {
        const { oldPassword, newPassword, cNewPassword } = req.body
        const { id } = req.params
        if (id == req.user._id) {
            const user = await User.findOne({ _id: id });
            if (user) {
                bcrypt.compare(oldPassword, user.password, async function(err, result) {
                    if (err) throw Error(err)
                    if (result) {
                        if (newPassword === cNewPassword) {
                            const hashPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALTROUNDS))
                            const data = await User.findByIdAndUpdate({ _id: id }, { password: hashPassword });
                            res.status(StatusCodes.OK).json({ message: "Updated successfully" });
                        } else {
                            res.status(StatusCodes.BAD_REQUEST).json({ message: "Password doesnot match cPassword" });
                        }
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid old password" });
                    }
                });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid id" });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to update password" });
    }
}


const sendResetKey = async(req, res) => {
    try {
        const subject = "Reset password"
        const { email } = req.body
        const data = await User.findOne({ email, verified: true, deactivated: false, blocked: false })
        if (data) {
            const token = jwt.sign({ _id: data._id }, process.env.SECRET_KEY, {
                expiresIn: process.env.TOKEN_RESET_EXPIRATION,
            });
            const verificationKey = nanoid()
            const update = await User.findOneAndUpdate({ email }, { verificationKey })
            const info = await sendEmail([email], forgetTemplate(verificationKey), subject)
            if (info.messageId) {
                res.status(StatusCodes.OK).json({ message: "key sent successfully", token });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "error" });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid email" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to send key" });
    }
}


const resetPassword = async(req, res) => {
    try {
        const { verificationKey } = req.body
        if (verificationKey == req.user.verificationKey) {
            const reset = await User.findByIdAndUpdate({ _id: req.user._id }, { forgetPassword: true })
            res.status(StatusCodes.OK).json({ message: "Reset successfully" });

        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to reset password" });
    }
}

const changePassword = async(req, res) => {
    try {
        const { newPassword, cNewPassword } = req.body
        const { id } = req.params
        if (id == req.user._id) {
            if (newPassword === cNewPassword) {
                const hashPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALTROUNDS))
                const data = await User.findOneAndUpdate({ _id: id, forgetPassword: true }, { password: hashPassword, forgetPassword: false });
                if (data) {
                    res.status(StatusCodes.OK).json({ message: "Changed successfully" });
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
                }
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Password doesnot match cPassword" });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to change password" });
    }
}






module.exports = {
    updateProfile,
    updatePassword,
    sendResetKey,
    resetPassword,
    changePassword
}