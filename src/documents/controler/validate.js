const { StatusCodes } = require("http-status-codes");
const User = require("../../users/model/user.model");
const Document = require("../model/document.model");

const validateDocument = async(req, res) => {
    try {
        const { documentId } = req.params
        let { expiryDate, valid, status, comment } = req.body
        expiryDate = new Date(expiryDate).toISOString()
        const now = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 0, 0, 0).toISOString()
        const validDoc = await Document.findOne({ _id: documentId, status: "closed" })
        if (validDoc) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Document already closed" });
        } else {
            if (expiryDate > now) {
                if (valid == 'valid' && status == "closed") {
                    const document = await Document.findOneAndUpdate({ _id: documentId }, { expiryDate, valid, status, seen: false })
                    const user = await User.findOneAndUpdate({ _id: document.createdBy }, { documentId: document._id, documentExpiryDate: document.expiryDate, documentValidity: true })
                    if (document) {
                        res.status(StatusCodes.OK).json({ message: "Document validated successfully" });
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid document" });
                    }
                } else {
                    const document = await Document.findOneAndUpdate({ _id: documentId }, { valid, status, seen: false, comment })
                    if (document) {
                        res.status(StatusCodes.OK).json({ message: "Document validated successfully" });
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid document" });
                    }
                }
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid expiry date" });
            }
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to validate document" });
    }
}



const removeOrderAction = async(req, res) => {
    try {
        const { documentId } = req.params;
        const document = await Document.findOne({ _id: documentId })
        if (document) {
            if (document.action) {
                if (req.user._id.equals(document.action)) {
                    const remove = await Document.findOneAndUpdate({ _id: documentId }, { action: "" })
                    res.status(StatusCodes.OK).json({ message: "Action removed successfully" });
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
                }
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "No action found" });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid document" });
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to remove action" });
    }
}



module.exports = {
    validateDocument,
    removeOrderAction
}