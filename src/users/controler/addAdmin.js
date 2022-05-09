const { StatusCodes } = require("http-status-codes");
const User = require("../model/user.model");
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const addAdmin = async(req, res) => {
    try {
        let { email, password, cPassword } = req.body
        email = email.toLowerCase()
        const emailExist = await User.findOne({ email, deactivated: false });
        if (emailExist) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already exist" });
        } else {
            if (password == cPassword) {
                const verificationKey = nanoid()
                let counter = await User.findOne({ "role": { "$ne": 'user' } }).count()
                const newUser = new User({ employeeId: counter + 1, email, password, name: "admin", companyName: "admin", role: "admin", position: "admin", verificationKey, verified: true });
                const user = await newUser.save();
                res.status(StatusCodes.CREATED).json({ message: "Add admin successfully", employeeId: user.employeeId });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Password doesnot match cPassword" });
            }
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to add admin" });
    }
}


const adminLogIn = async(req, res) => {
    try {
        let { employeeId, password } = req.body
        const found = await User.findOne({ employeeId, deactivated: false, blocked: false });
        if (found) {
            bcrypt.compare(password, found.password, async function(err, result) {
                if (err) throw Error(err)
                if (result) {
                    const data = await User.findByIdAndUpdate({ _id: found._id }, { logedIn: true }, { new: true });
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


module.exports = { addAdmin, adminLogIn }