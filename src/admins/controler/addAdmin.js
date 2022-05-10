const { StatusCodes } = require("http-status-codes");
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require("../model/admin.model");

const addAdmin = async(req, res) => {
    try {
        let { name, position, email, password, cPassword, role } = req.body
        email = email.toLowerCase()
        const emailExist = await Admin.findOne({ email, deactivated: false });
        if (emailExist) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already exist" });
        } else {
            if (password == cPassword) {
                const verificationKey = nanoid()
                let counter = await Admin.find({}).count()
                const newAdmin = new Admin({ employeeId: counter + 1, email, password, name, role, position, verificationKey });
                const admin = await newAdmin.save();
                res.status(StatusCodes.CREATED).json({ message: "Add admin successfully", employeeId: admin.employeeId });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Password doesnot match cPassword" });
            }
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to add admin" });
    }
}




module.exports = { addAdmin }