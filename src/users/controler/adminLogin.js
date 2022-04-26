const User = require("../model/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require("http-status-codes");

const adminLogIn = async(req, res) => {
    try {
        let { email, password } = req.body
        email = email.toLowerCase()
        const emailExist = await User.findOne({ email, deactivated: false });
        if (emailExist) {
            bcrypt.compare(password, emailExist.password, async function(err, result) {
                if (err) throw Error(err)
                if (result) {
                    const data = await User.findByIdAndUpdate({ _id: emailExist.id }, { logedIn: true }, { new: true });
                    const { password, verificationKey, verified, deactivated, blocked, forgetPassword, ...rest } = emailExist._doc
                    const token = jwt.sign({...rest }, process.env.SECRET_KEY)
                    res.status(StatusCodes.OK).json({ message: "Login successfully", token });
                } else {
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid email or password" });
                }
            });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to signIn" });
    }
}


module.exports = { adminLogIn }