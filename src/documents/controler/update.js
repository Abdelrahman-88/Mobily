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
                                filesUrl.forEach((file) => {
                                    oldFiles.forEach((old) => {
                                        if (file.field == old.field) {
                                            const index = newFiles.findIndex(object => object.field === file.field);
                                            if (index === -1) {
                                                newFiles.push(file)
                                            }
                                        } else {
                                            const index = newFiles.findIndex(object => object.field === file.field);
                                            if (index === -1) {
                                                newFiles.push(file)
                                            }
                                            const index1 = newFiles.findIndex(object => object.field === old.field);
                                            if (index1 === -1) {
                                                newFiles.push(old)
                                            }
                                        }
                                    })
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