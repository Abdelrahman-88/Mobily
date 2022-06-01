const { StatusCodes } = require("http-status-codes");
const FollowUp = require("../../followUp/model/followUp.model");
const User = require("../../users/model/user.model");
const Document = require("../model/document.model");

const updateDocument = async(req, res) => {
    try {
        if (req.fileValidationError) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: req.fileValidationError });
        } else {
            const { id, documentId } = req.params
            const document = await Document.findOne({ _id: documentId, status: "pending" })
            if (!document) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid document" });
            } else {
                if (id == req.user._id) {
                    const user = await User.findOne({ _id: id });
                    if (user) {
                        if (req.files) {
                            if (req.files.authorization || req.files.commercialR || req.files.valueC || req.files.iD || req.files.insuranceC) {
                                let filesUrl = [];
                                for (let key of Object.keys(req.files)) {
                                    filesUrl.push({
                                        field: req.files[key][0].fieldname,
                                        name: req.files[key][0].filename,
                                        url: process.env.URL + 'displayDocument/' + req.files[key][0].filename
                                    })
                                }
                                let newFiles = [];
                                const oldFiles = document.documents
                                filesUrl.forEach((file, i) => {
                                    oldFiles.forEach((old, i) => {
                                        if (file.field == old.field) {
                                            newFiles.push(file)
                                        } else {
                                            newFiles.push(old)
                                            newFiles.push(file)
                                            oldFiles.splice(i, 1)
                                        }
                                    })
                                    newFiles.splice(i, 1)
                                })
                                const updatedDocument = await Document.findOneAndUpdate({ _id: documentId }, { documents: newFiles, status: "open" }, { new: true })
                                const followUp = await FollowUp.findOneAndUpdate({ requestId: documentId }, { status: "closed" })
                                res.status(StatusCodes.CREATED).json({ message: "Documents updated successfully", data: updatedDocument });
                            } else {
                                res.status(StatusCodes.BAD_REQUEST).json({ message: "Documents is required" });
                            }
                        } else {
                            res.status(StatusCodes.BAD_REQUEST).json({ message: "Documents is required" });
                        }
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "invalid user" });
                    }
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
                }
            }
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to update document" });
    }
}



module.exports = { updateDocument }