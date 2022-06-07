const { StatusCodes } = require("http-status-codes");
const FollowUp = require("../../followUp/model/followUp.model");
const User = require("../../users/model/user.model");
const Document = require("../model/document.model");

const editDocument = async(req, res) => {
    try {
        const { documentId } = req.params
        let { expiryDate, valid, status, comment, phone, contactEmail, commercialRNumber, idNumber } = req.body
        expiryDate = new Date(expiryDate).toISOString()
        const validDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 0, 0, 0).toISOString()
        const now = new Date().toISOString()
        const document = await Document.findOne({ _id: documentId })
        if (document) {
            const { employeeId } = req.user._doc
            const activity = [{ employeeId, comment, date: now }, ...document.activity]
            if (expiryDate > validDate) {
                if (valid == 'valid' && status == "closed") {
                    const update = await Document.findOneAndUpdate({ _id: documentId }, { expiryDate, valid, status, seen: false, activity, action: false, actionBy: null, phone, contactEmail, commercialRNumber, idNumber }, { new: true })
                    const user = await User.findOneAndUpdate({ _id: document.createdBy }, { documentId: update._id, documentExpiryDate: update.expiryDate, documentValidity: true, phone, contactEmail, commercialRNumber, idNumber })
                    res.status(StatusCodes.OK).json({ message: "Document edited successfully" });
                } else {
                    const update = await Document.findOneAndUpdate({ _id: documentId }, { valid, status, seen: false, comment, activity, action: false, actionBy: null, expiryDate: "" }, { new: true })
                    if (document.status == 'closed' && document.valid == 'valid') {
                        const oldValidDoc = await Document.findOne({ createdBy: document.createdBy, expiryDate: { $gt: validDate }, valid: 'valid', status: "closed" })
                        if (oldValidDoc) {
                            const user = await User.findOneAndUpdate({ _id: document.createdBy }, { documentId: oldValidDoc._id, documentExpiryDate: oldValidDoc.expiryDate, documentValidity: true, phone: oldValidDoc.phone, contactEmail: oldValidDoc.contactEmail, commercialRNumber: oldValidDoc.commercialRNumber, idNumber: oldValidDoc.idNumber })
                        } else {
                            const user = await User.findOneAndUpdate({ _id: document.createdBy }, { documentId: null, documentExpiryDate: '', documentValidity: false, phone: '', contactEmail: '', commercialRNumber: '', idNumber: '' })
                        }
                    }
                    if (status == "pending" && document.status != 'pending') {
                        const followUp = new FollowUp({ userId: document.createdBy, requestId: documentId })
                        const saved = await followUp.save()
                    }
                    res.status(StatusCodes.OK).json({ message: "Document edited successfully" });
                }
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid expiry date" });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid document" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to edit document" });
    }
}



module.exports = { editDocument }