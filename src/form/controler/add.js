const { StatusCodes } = require("http-status-codes");
const { conn } = require("../../../common/connection/confg");
const mongoose = require('mongoose');
const Form = require("../model/form.model");

let gfs;
conn.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
});

const addForm = async(req, res) => {
    try {
        if (req.fileValidationError) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: req.fileValidationError });
        } else {
            const { type } = req.body
            const find = await Form.findOne({ type })
            if (find) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Form already exist" });
            } else {
                if (req.file) {
                    let form = {
                        name: req.file.filename,
                        url: process.env.URL + 'displayForms/' + req.file.filename
                    }
                    const newForm = new Form({ type, form })
                    const data = await newForm.save()
                    res.status(StatusCodes.CREATED).json({ message: "Form added successfully" });
                } else {
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "Form is required" });
                }
            }
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to add form" });
    }
}

const displayForms = async(req, res) => {
    try {
        const { filename } = req.params
        const file = await Form.findOne({
            "form.name": filename
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
    addForm,
    displayForms
}