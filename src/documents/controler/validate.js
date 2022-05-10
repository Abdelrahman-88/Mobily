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
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized to close valid doucment" });
            } else if (valid == 'valid') {
                const document = await Document.findOneAndUpdate({ _id: documentId }, { expiryDate, valid, status: "pending", stage: "stage2" })
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


const activateService = async(req, res) => {
    try {
        const { documentId } = req.params
        let { valid, status } = req.body
        const validDoc = await Document.findOne({ _id: documentId, status: "closed" })
        if (validDoc) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Document already closed" });
        } else {
            if (valid == 'invalid') {
                const document = await Document.findOneAndUpdate({ _id: documentId, stage: "stage2" }, { valid, status })
                if (document) {
                    res.status(StatusCodes.OK).json({ message: "validated successfully" });
                } else {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Invalid document" });
                }
            } else {
                const document = await Document.findOneAndUpdate({ _id: documentId, stage: "stage2" }, { valid, status })
                if (document) {
                    const user = await User.findOneAndUpdate({ _id: document.createdBy }, { documentId: document._id, documentExpiryDate: document.expiryDate, documentValidity: true })
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




module.exports = { validateDocument, activateService }