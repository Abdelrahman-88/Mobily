const { StatusCodes } = require("http-status-codes");
const { conn } = require("../../../common/connection/confg");
const mongoose = require('mongoose');
const PriceOffer = require("../model/priceOffer.model");

let gfs;
conn.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
});


const displayPdf = async(req, res) => {
    try {
        const { filename } = req.params
        const file = await PriceOffer.findOne({ $or: [{ 'pricePdf.name': filename }, { 'userPdf.name': filename }] })
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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to display pdf" });
    }
}



module.exports = { displayPdf }