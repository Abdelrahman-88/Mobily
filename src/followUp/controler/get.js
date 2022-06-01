const { StatusCodes } = require("http-status-codes");
const pageService = require("../../../common/service/page");
const searchServies = require("../../../common/service/search");
const FollowUp = require("../model/followUp.model");

const getFollowUpById = async(req, res) => {
    try {
        const { followUpId } = req.params
        const followUp = await FollowUp.findOne({ _id: followUpId }).populate("userId", "-password -verificationKey").populate({ path: "order", populate: { path: "cartId", populate: { path: "services.serviceId" } } }).populate("document")
        if (followUp) {
            if (followUp.action) {
                if (req.user._id.equals(followUp.actionBy)) {
                    res.status(StatusCodes.OK).json({ message: "done", data: followUp });
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
                }
            } else {
                const action = await FollowUp.findOneAndUpdate({ _id: followUpId, status: { $ne: "closed" } }, { actionBy: req.user._id, action: true }, { new: true }).populate("userId", "-password -verificationKey").populate("actionBy", "employeeId").populate({ path: "order", populate: { path: "cartId", populate: { path: "services.serviceId" } } }).populate("document")
                if (action) {
                    res.status(StatusCodes.OK).json({ message: "done", data: action });
                } else {
                    res.status(StatusCodes.OK).json({ message: "done", data: followUp });
                }
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid followup" });
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get followup" });
    }
}


const getAllFollowUp = async(req, res) => {
    try {
        let { page, size, ...value } = req.query
        Object.keys(value).forEach(key => {
            if (value[key] === '' || value[key] === undefined || value[key] === null) {
                delete value[key];
            }
        });
        const yesterday = new Date(new Date(new Date().setHours(0, 0, 0, 0)).setDate(new Date().getDate() - 2)).toISOString()
        const { skip, limit, currentPage } = pageService(page, size)
            // const followUp = await searchServies("", { status, answered, action, createdAt: { $lte: yesterday } }, limit, skip, FollowUp, [], "", "")
        const followUp = await FollowUp.find({...value }).skip(skip).limit(parseInt(limit))
        const total = await FollowUp.find({...value }).count()
        const totalPages = Math.ceil(total / limit)
        if (followUp.length) {
            res.status(StatusCodes.OK).json({ message: "done", currentPage, limit, totalPages, total, data: followUp });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "No followup found" });
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get followup" });
    }
}


module.exports = {
    getFollowUpById,
    getAllFollowUp
}