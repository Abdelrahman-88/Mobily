const User = require("../model/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require("http-status-codes");

const logIn = async(req, res) => {
    try {
        let { email, password } = req.body
        email = email.toLowerCase()
        const emailExist = await User.findOne({ email, deactivated: false, blocked: false });
        if (emailExist) {
            if (emailExist.verified) {
                bcrypt.compare(password, emailExist.password, async function(err, result) {
                    if (err) throw Error(err)
                    if (result) {
                        const data = await User.findByIdAndUpdate({ _id: emailExist._id }, { logedIn: true }, { new: true });
                        const { password, verificationKey, verified, deactivated, blocked, forgetPassword, ...rest } = emailExist._doc
                        const token = jwt.sign({...rest }, process.env.SECRET_KEY)
                        res.status(StatusCodes.OK).json({ message: "Login successfully", token });
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid email or password" });
                    }
                });
            } else {
                const token = jwt.sign({ _id: emailExist._id }, process.env.SECRET_KEY)
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Unverified email", token });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to signIn" });
    }
}


const logOut = async(req, res) => {
    try {
        const { id } = req.params
        if (id == req.user._id) {
            const data = await User.findOneAndUpdate({ _id: id, logedIn: true }, { logedIn: false }, { new: true });
            if (data) {
                res.status(StatusCodes.OK).json({ message: "Logout successfully" });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid user" });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to logout" });
    }
}


module.exports = {
    logIn,
    logOut
}