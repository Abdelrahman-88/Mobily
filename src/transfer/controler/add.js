const { StatusCodes } = require("http-status-codes");
const { conn } = require("../../../common/connection/confg");
const Transfer = require("../model/transfer.model");
const mongoose = require('mongoose');

let gfs;
conn.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
});

const addTransfer = async(req, res) => {
    try {
        if (req.fileValidationError) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: req.fileValidationError });
        } else {
            const { createdBy } = req.params
            if (createdBy == req.user._id) {
                if (req.file) {
                    let transferForm = {
                        name: req.file.filename,
                        url: process.env.URL + 'displayForm/' + req.file.filename
                    }
                    const transfer = new Transfer({ createdBy, transferForm })
                    const data = await transfer.save()
                    res.status(StatusCodes.CREATED).json({ message: "Transfer form sent successfully", data });
                } else {
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "Transfer form is required" });
                }
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
            }
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to send transfer form" });
    }
}


const displayForm = async(req, res) => {
    try {
        const { filename } = req.params
        const file = await Transfer.findOne({
            "transferForm.name": filename
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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to display form" });
    }
}




module.exports = {
    addTransfer,
    displayForm
}