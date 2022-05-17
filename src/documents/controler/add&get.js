const { StatusCodes } = require("http-status-codes");
const User = require("../../users/model/user.model");
const Document = require("../model/document.model");
const { conn } = require("../../../common/connection/confg");
const mongoose = require('mongoose');
const pageService = require("../../../common/service/page");
const searchServies = require("../../../common/service/search")

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
            if (createdBy == req.user._id) {
                const user = await User.findOne({ _id: createdBy });
                if (user) {
                    if (req.files) {
                        if (req.files.authorization && req.files.commercialR && req.files.valueC && req.files.iD) {
                            let filesUrl = [];
                            for (let key of Object.keys(req.files)) {
                                filesUrl.push({
                                    name: req.files[key][0].filename,
                                    url: process.env.URL + 'displayDocument/' + req.files[key][0].filename
                                })
                            }
                            // filesUrl = [{
                            //             name: req.files.authorization[0].filename,
                            //             url: process.env.URL + 'displayDocument/' + req.files.authorization[0].filename
                            //         },
                            //         {
                            //             name: req.files.commercialR[0].filename,
                            //             url: process.env.URL + 'displayDocument/' + req.files.commercialR[0].filename
                            //         }
                            //     ]
                            // for (let index = 0; index < req.files.length; index++) {
                            //     // filesUrl.push(`${process.env.URL}${req.files[index].filename}`)
                            //     filesUrl.push({
                            //         name: req.files[index].filename,
                            //         url: process.env.URL + 'displayDocument/' + req.files[index].filename
                            //     })

                            //     // const file = await gfs.files.findOne({ filename: req.files[index].filename });
                            //     // const readStream = gfs.openDownloadStreamByName(req.files[index].filename).pipe(res);
                            //     // filesUrl.push(readStream)
                            // }
                            const newDocument = new Document({ createdBy, documents: filesUrl })
                            const data = await newDocument.save()
                                // const updateUser = await User.updateOne({ _id: createdBy }, { documentId: [...user.documentId, newDocument._id] })
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
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to add document" });
    }
}


const getDocument = async(req, res) => {
    try {
        const { documentId } = req.params
        const document = await Document.findOne({ _id: documentId }).populate('createdBy', '-password -verificationKey')
        if (document) {
            let { _id } = document.createdBy
            if (req.user._id.equals(_id)) {
                res.status(StatusCodes.OK).json({ message: "done", document });

            } else if (req.user.role == "admin" || req.user.role == "operator") {
                const action = await Document.findOneAndUpdate({ _id: documentId }, { actionBy: req.user._id, action: true }, { new: true }).populate("action", "employeeId")
                if (action) {
                    res.status(StatusCodes.OK).json({ message: "done", document: action });
                } else {
                    res.status(StatusCodes.OK).json({ message: "done", document });
                }
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "invalid document" });
        }
    } catch (error) {
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

        let { page, size, from, to, status, valid, action } = req.query
        if (!from) {
            from = new Date('2022')
        }
        if (!to) {
            to = new Date()
        }

        from = new Date(from).toISOString()
        to = new Date(to).toISOString()
        const { skip, limit, currentPage } = pageService(page, size)
        const documents = await searchServies("", { status, valid, action }, limit, skip, Document, [], "createdBy", "-password -verificationKey")
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






module.exports = {
    addDocument,
    getDocument,
    displayDocument,
    getAllDocuments,
    getUserDocuments
}