const { StatusCodes } = require("http-status-codes");
const pageService = require("../../../common/service/page");
const searchServies = require("../../../common/service/search");
const User = require("../model/user.model");

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


module.exports = { getAllUsers }