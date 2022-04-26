const { StatusCodes } = require("http-status-codes");
const User = require("../model/user.model");
const { nanoid } = require('nanoid');

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
                const newUser = new User({ email, password, name: "admin", companyName: "admin", role: "admin", position: "admin", verificationKey, verified: true });
                const user = await newUser.save();
                res.status(StatusCodes.CREATED).json({ message: "Add admin successfully" });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Password doesnot match cPassword" });
            }
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to add admin" });
    }
}


module.exports = { addAdmin }