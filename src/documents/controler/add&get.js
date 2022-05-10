const { StatusCodes } = require("http-status-codes");
const User = require("../../users/model/user.model");
const Document = require("../model/document.model");
const { conn } = require("../../../common/connection/confg");
const mongoose = require('mongoose');
const pageService = require("../../../common/service/page");
let gfs
conn.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
});

const addDocument = async(req, res) => {
    try {
        const { createdBy } = req.params
        if (createdBy == req.user._id) {
            const user = await User.findOne({ _id: createdBy });
            if (user) {
                if (req.files) {
                    if (req.files.authorization && req.files.commercialR) {
                        let filesUrl = [{
                                    name: req.files.authorization[0].filename,
                                    url: process.env.URL + 'displayDocument/' + req.files.authorization[0].filename
                                },
                                {
                                    name: req.files.commercialR[0].filename,
                                    url: process.env.URL + 'displayDocument/' + req.files.commercialR[0].filename
                                }
                            ]
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
                        res.status(StatusCodes.CREATED).json({ message: "done", data });
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
            if (req.user._id.equals(_id) || req.user.role == "admin") {
                res.status(StatusCodes.OK).json({ message: "done", document });

            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED1" });
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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get document" });
    }
}


const getAllDocuments = async(req, res) => {
    try {

        let { page, size, from, to, ...rest } = req.query
        if (!from) {
            from = new Date('2022')
        }
        if (!to) {
            to = new Date()
        }
        Object.keys(rest).forEach(key => {
            if (rest[key] === '') {
                delete rest[key];
            }
        });
        from = new Date(from).toISOString()
        to = new Date(to).toISOString()
        const { skip, limit, currentPage } = pageService(page, size)
        const data = await Document.find({...rest, createdAt: { $gte: from, $lte: to } }).populate('createdBy', '-password -verificationKey').skip(skip).limit(parseInt(limit))
        const total = await Document.find({...rest, createdAt: { $gte: from, $lte: to } }).count()
        totalPages = Math.ceil(total / limit)
        res.status(StatusCodes.OK).json({ message: "done", currentPage, limit, totalPages, total, data })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to get documents" });
    }
}



module.exports = {
    addDocument,
    getDocument,
    displayDocument,
    getAllDocuments
}