const { StatusCodes } = require("http-status-codes");
const User = require("../../users/model/user.model");
const Document = require("../model/document.model");

const validateDocument = async(req, res) => {
    try {
        const { documentId } = req.params
        let { expiryDate, valid, status } = req.body
        expiryDate = new Date(expiryDate).toISOString()
        const validDoc = await Document.findOne({ _id: documentId, status: "closed" })
        if (validDoc) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Document already closed" });
        } else {
            if (valid == 'valid' && status == 'closed') {
                const document = await Document.findOneAndUpdate({ _id: documentId }, { expiryDate, valid, status })
                const user = await User.findOneAndUpdate({ _id: document.createdBy }, { documentId: document._id, documentExpiryDate: expiryDate, documentValidity: true })
                if (document) {
                    res.status(StatusCodes.OK).json({ message: "validated successfully" });
                } else {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Invalid document" });
                }
            } else {
                const document = await Document.findOneAndUpdate({ _id: documentId }, { valid, status })
                if (document) {
                    res.status(StatusCodes.OK).json({ message: "validated successfully" });
                } else {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Invalid document" });
                }
            }
        }

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to validate document" });

    }

}



module.exports = { validateDocument }