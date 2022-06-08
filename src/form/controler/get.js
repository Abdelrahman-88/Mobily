const Form = require("../model/form.model");
const { StatusCodes } = require("http-status-codes");
const pageService = require("../../../common/service/page");
const searchServies = require("../../../common/service/search")

const getAllForms = async(req, res) => {
    try {
        let { page, size, type } = req.query
        const { skip, limit, currentPage } = pageService(page, size)
        const forms = await searchServies("", { type }, limit, skip, Form, [], "", "", "")
        if (forms.data.length) {
            res.status(StatusCodes.OK).json({ message: "done", currentPage, limit, totalPages: forms.totalPages, total: forms.total, data: forms.data });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "No forms found" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to get forms" });
    }
}



module.exports = { getAllForms }