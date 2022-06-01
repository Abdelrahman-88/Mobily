const { StatusCodes } = require("http-status-codes");
const User = require("../../users/model/user.model");
const Document = require("../model/document.model");
const { conn } = require("../../../common/connection/confg");
const mongoose = require('mongoose');
const pageService = require("../../../common/service/page");
const searchServies = require("../../../common/service/search")
const jwt = require('jsonwebtoken');

let gfs
conn.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
});

const addDocument = async(req, res) => {
    try {
        if (req.fileValidationError) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: req.fileValidationError });
        } else {
            const { createdBy } = req.params
            const document = await Document.findOne({ createdBy, status: { $ne: "closed" } })
            if (document) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Already has open document", document });
            } else {
                if (createdBy == req.user._id) {
                    const user = await User.findOne({ _id: createdBy });
                    if (user) {
                        if (req.files) {
                            if (req.files.authorization && req.files.commercialR && req.files.valueC && req.files.iD) {
                                let filesUrl = [];
                                for (let key of Object.keys(req.files)) {
                                    filesUrl.push({
                                        field: req.files[key][0].fieldname,
                                        name: req.files[key][0].filename,
                                        url: process.env.URL + 'displayDocument/' + req.files[key][0].filename
                                    })
                                }
                                const newDocument = new Document({ createdBy, documents: filesUrl })
                                const data = await newDocument.save()
                                res.status(StatusCodes.CREATED).json({ message: "Documents added successfully", data });
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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to add document" });
    }
}


const getDocument = async(req, res) => {
    try {
        const { documentId } = req.params
        let document = await Document.findOne({ _id: documentId }).populate('createdBy', '-password -verificationKey')
        if (document) {
            let { _id } = document.createdBy
            if (req.user._id.equals(_id)) {
                const seen = await Document.findOneAndUpdate({ _id: documentId }, { seen: true }, { new: true }).populate('createdBy', '-password -verificationKey')
                res.status(StatusCodes.OK).json({ message: "done", document: seen });
            } else if (req.user.role == "admin" || req.user.role == "operator") {
                if (document.action) {
                    document = await Document.findOne({ _id: documentId }).populate('createdBy', '-password -verificationKey').populate("actionBy", "employeeId")
                    if (req.user._id.equals(document.actionBy._id)) {
                        res.status(StatusCodes.OK).json({ message: "done", document });
                    } else {
                        res.status(StatusCodes.UNAUTHORIZED).json({ message: `Request opend by employee Id ${document.actionBy.employeeId}` });
                    }
                } else {
                    const action = await Document.findOneAndUpdate({ _id: documentId, status: { $ne: "closed" } }, { actionBy: req.user._id, action: true }, { new: true }).populate('createdBy', '-password -verificationKey').populate("actionBy", "employeeId")
                    if (action) {
                        res.status(StatusCodes.OK).json({ message: "done", document: action });
                    } else {
                        res.status(StatusCodes.OK).json({ message: "done", document });
                    }
                }
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "invalid document" });
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get document" });
    }
}


const displayDocument = async(req, res) => {
    try {
        const { filename } = req.params
        const file = await Document.findOne({
            documents: {
                $elemMatch: {
                    name: filename
                }
            }
        })

        if (file) {
            let downloadStream = gfs.openDownloadStreamByName(filename);
            downloadStream = downloadStream.pipe(res)
            downloadStream.on("data", function(data) {
                res.status(StatusCodes.OK).json({ data });
            });
        } else {
            let notFoundStream = gfs.openDownloadStreamByName(process.env.NOTFOUND);
            notFoundStream = notFoundStream.pipe(res)
            notFoundStream.on("data", function(data) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(data);
            });

        }

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to display document" });
    }
}


const getAllDocuments = async(req, res) => {
    try {

        let { page, size, from, to, status, valid, action, actionBy } = req.query
        if (!from) {
            from = new Date('2022')
        }
        if (!to) {
            to = new Date()
        }

        from = new Date(from).toISOString()
        to = new Date(to).toISOString()
        const { skip, limit, currentPage } = pageService(page, size)
        const documents = await searchServies("", { status, valid, action, actionBy }, limit, skip, Document, [], "createdBy", "-password -verificationKey")
        if (documents.data.length) {
            res.status(StatusCodes.OK).json({ message: "done", currentPage, limit, totalPages: documents.totalPages, total: documents.total, data: documents.data });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "No documents found" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to get documents" });
    }
}


const getUserDocuments = async(req, res) => {
    try {
        const { createdBy } = req.params
        if (req.user._id == createdBy) {
            let { page, size, status, valid } = req.query
            const { skip, limit, currentPage } = pageService(page, size)
            const documents = await searchServies("", { createdBy, status, valid }, limit, skip, Document, [], "", "")
            if (documents.data.length) {
                res.status(StatusCodes.OK).json({ message: "done", currentPage, limit, totalPages: documents.totalPages, total: documents.total, data: documents.data });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "No documents found" });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get documents" });
    }
}

const checkDocument = async(req, res) => {
    try {
        const { createdBy } = req.params
        if (req.user._id == createdBy) {
            const document = await Document.findOne({ createdBy, status: { $ne: "closed" } })
            const newData = await User.findOne({ _id: createdBy }).populate("documentId");
            const { password, verificationKey, verified, deactivated, blocked, forgetPassword, ...rest } = newData._doc
            const token = jwt.sign({...rest }, process.env.SECRET_KEY)
            if (document) {
                res.status(StatusCodes.OK).json({ message: "Done", document, documentValidity: req.user.documentValidity, token });
            } else {
                res.status(StatusCodes.OK).json({ message: "No open documents found", documentValidity: req.user.documentValidity, token });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get document" });
    }
}




module.exports = {
    addDocument,
    getDocument,
    displayDocument,
    getAllDocuments,
    getUserDocuments,
    checkDocument
}