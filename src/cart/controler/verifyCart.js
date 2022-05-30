const { StatusCodes } = require("http-status-codes");
const { nanoid } = require('nanoid');
const sendEmail = require("../../../common/service/sendEmail");
const { verificationCartTemplate } = require("../../../common/service/template");
const User = require("../../users/model/user.model");



const sendVerificationKey = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id, documentValidity: true }).select("-password");
        const subject = `Email confirmation`
        if (user) {
            const newKey = await User.findOneAndUpdate({ _id: id }, { verificationKey: nanoid() }, { new: true })
            const info = await sendEmail([newKey.contactEmail], verificationCartTemplate(newKey.verificationKey), subject)
            if (info.messageId) {
                res.status(StatusCodes.CREATED).json({ message: "Verification key sent successfully" });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to send verification key" });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid user" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to send verification key" });
    }
}

const verifyCart = async(req, res) => {
    try {
        const { id } = req.params;
        const { verificationKey } = req.body;
        const user = await User.findOne({ _id: id, documentValidity: true, verificationKey }).select("-password");
        if (user) {
            res.status(StatusCodes.OK).json({ message: "Email verified successfully" });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid user or verification key" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to verify" });
    }
}




module.exports = {
    sendVerificationKey,
    verifyCart
}