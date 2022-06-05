const { StatusCodes } = require("http-status-codes");
const pageService = require("../../../common/service/page");
const searchServies = require("../../../common/service/search")

const getAllUsers = async(req, res) => {
    try {

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get all users" });
    }
}