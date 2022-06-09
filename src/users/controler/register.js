const { StatusCodes } = require("http-status-codes");
const { nanoid } = require('nanoid');
const sendEmail = require("../../../common/service/sendEmail");
const { verificationTemplate } = require("../../../common/service/template");
const User = require("../model/user.model");
const jwt = require('jsonwebtoken');
const Admin = require("../../admins/model/admin.model");


const register = async(req, res) => {
    try {
        let { email, companyName, password, cPassword, salesId, city, mapLocation } = req.body
        email = email.toLowerCase()
        const subject = `Email confirmation`
        const emailExist = await User.findOne({ email, deactivated: false });
        if (emailExist) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already exist" });
        } else {
            if (password == cPassword) {
                const verificationKey = nanoid()
                let newUser;
                if (salesId) {
                    const sales = await Admin.findOne({ employeeId: salesId, role: "sales" })
                    if (sales) {
                        newUser = new User({ email, companyName, password, verificationKey, salesId, city, mapLocation });
                        contain();
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid sales id" });
                    }
                } else {
                    newUser = new User({ email, companyName, password, verificationKey, city, mapLocation });
                    contain();
                }

                async function contain() {
                    const user = await newUser.save();
                    try {
                        const info = await sendEmail([email], verificationTemplate(verificationKey), subject)
                        if (info.messageId) {
                            const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY)
                            res.status(StatusCodes.CREATED).json({ message: "Registered successfully", token });
                        } else {
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Send verification email error" });
                        }
                    } catch (error) {
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Send verification email error" });
                    }
                }
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Password doesnot match cPassword" });
            }
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to register" });
    }
}

const verifyEmail = async(req, res) => {
    try {
        const { id } = req.params;
        const { verificationKey } = req.body;
        const user = await User.findOne({ _id: id, verificationKey }).select("-password");
        if (user) {
            const verifiedUser = await User.findOneAndUpdate({ _id: id, verified: false }, { verified: true })
            if (verifiedUser) {
                res.status(StatusCodes.OK).json({ message: "Email verified successfully" });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already verified" });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid user or verification key" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to verify" });
    }
}

const resendVerificationKey = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id }).select("-password");
        const subject = `Email confirmation`
        if (user) {
            if (user.verified) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already verified" });
            } else {
                const newKey = await User.findOneAndUpdate({ _id: id }, { verificationKey: nanoid() }, { new: true })
                const info = await sendEmail([newKey.email], verificationTemplate(newKey.verificationKey), subject)
                if (info.messageId) {
                    res.status(StatusCodes.CREATED).json({ message: "Verification key sent successfully" });
                } else {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Send verification email error" });
                }
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid user" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to resend" });
    }
}

module.exports = {
    register,
    verifyEmail,
    resendVerificationKey
}