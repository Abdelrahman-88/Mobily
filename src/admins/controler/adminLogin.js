const { StatusCodes } = require("http-status-codes");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require("../model/admin.model");

const adminLogIn = async(req, res) => {
    try {
        let { employeeId, password } = req.body
        const found = await Admin.findOne({ employeeId, deactivated: false, blocked: false });
        if (found) {
            bcrypt.compare(password, found.password, async function(err, result) {
                if (err) throw Error(err)
                if (result) {
                    const data = await Admin.findByIdAndUpdate({ _id: found._id }, { logedIn: true }, { new: true });
                    const { password, verificationKey, verified, deactivated, blocked, forgetPassword, ...rest } = found._doc
                    const token = jwt.sign({...rest }, process.env.SECRET_KEY)
                    res.status(StatusCodes.OK).json({ message: "Login successfully", token });
                } else {
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid employeeId or password" });
                }
            });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid employeeId or password" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to signIn" });
    }
}

const adminLogOut = async(req, res) => {
    try {
        const { id } = req.params
        if (id == req.user._id) {
            const data = await Admin.findOneAndUpdate({ _id: id, logedIn: true }, { logedIn: false }, { new: true });
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
    adminLogIn,
    adminLogOut
}