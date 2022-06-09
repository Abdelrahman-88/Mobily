const { StatusCodes } = require("http-status-codes");
const pageService = require("../../../common/service/page");
const searchServies = require("../../../common/service/search");
const User = require("../model/user.model");
const { conn } = require("../../../common/connection/confg");
const mongoose = require('mongoose');

let gfs;
conn.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
});

const getAllUsers = async(req, res) => {
    try {
        let { page, size, search } = req.query
        const { skip, limit, currentPage } = pageService(page, size)
        const users = await searchServies(search, {}, limit, skip, User, ['companyName', 'email', 'phone', 'contactEmail'], "documentId", "", "-password -verificationKey")
        if (users.data.length) {
            res.status(StatusCodes.OK).json({ message: "done", currentPage, limit, totalPages: users.totalPages, total: users.total, data: users.data });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "No users found" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get all users" });
    }
}



const displayProfilePic = async(req, res) => {
    try {
        const { filename } = req.params
        const file = await User.findOne({
            "profilePic.name": filename
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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to display profile pic" });
    }
}


module.exports = {
    getAllUsers,
    displayProfilePic
}