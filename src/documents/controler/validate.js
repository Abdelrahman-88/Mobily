const { StatusCodes } = require("http-status-codes");
const FollowUp = require("../../followUp/model/followUp.model");
const User = require("../../users/model/user.model");
const Document = require("../model/document.model");

const validateDocument = async(req, res) => {
    try {
        const { documentId } = req.params
        let { expiryDate, valid, status, comment, phone, contactEmail, commercialRNumber, idNumber } = req.body
        expiryDate = new Date(expiryDate).toISOString()
        const validDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 0, 0, 0).toISOString()
        const now = new Date().toISOString()
        const validDoc = await Document.findOne({ _id: documentId, status: "closed" })
        if (validDoc) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Document already closed" });
        } else {
            const document = await Document.findOne({ _id: documentId })
            if (document) {
                if (req.user._id.equals(document.actionBy)) {
                    const { employeeId } = req.user._doc
                    const activity = [{ employeeId, comment, date: now }, ...document.activity]
                    if (expiryDate > validDate) {
                        if (valid == 'valid' && status == "closed") {
                            const update = await Document.findOneAndUpdate({ _id: documentId }, { expiryDate, valid, status, seen: false, activity, action: false, actionBy: "", phone, contactEmail, commercialRNumber, idNumber })
                            const user = await User.findOneAndUpdate({ _id: document.createdBy }, { documentId: document._id, documentExpiryDate: document.expiryDate, documentValidity: true, phone, contactEmail, commercialRNumber, idNumber })
                            res.status(StatusCodes.OK).json({ message: "Document validated successfully" });
                        } else {
                            const update = await Document.findOneAndUpdate({ _id: documentId }, { valid, status, seen: false, comment, activity, action: false, actionBy: "" })
                            if (status == "pending") {
                                const followUp = new FollowUp({ userId: document.createdBy, requestId: documentId })
                                const saved = await followUp.save()
                            }
                            res.status(StatusCodes.OK).json({ message: "Document validated successfully" });
                        }
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid expiry date" });
                    }
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
                }
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid document" });
            }
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to validate document" });
    }
}



const removeDocumentAction = async(req, res) => {
    try {
        const { documentId } = req.params;
        const document = await Document.findOne({ _id: documentId })
        if (document) {
            if (document.action) {
                if (req.user._id.equals(document.actionBy) || req.user.role == "superAdmin") {
                    const remove = await Document.findOneAndUpdate({ _id: documentId }, { action: false, actionBy: "" })
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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to remove action" });
    }
}



module.exports = {
    validateDocument,
    removeDocumentAction
}