const { StatusCodes } = require("http-status-codes");
const pageService = require("../../../common/service/page");
const searchServies = require("../../../common/service/search");
const FollowUp = require("../model/followUp.model");

const getFollowUpById = async(req, res) => {
    try {
        const { followUpId } = req.params
        let followUp = await FollowUp.findOne({ _id: followUpId }).populate("userId", "-password -verificationKey").populate("document")
        if (followUp) {
            if (followUp.action) {
                followUp = await FollowUp.findOne({ _id: followUpId }).populate("userId", "-password -verificationKey").populate("document").populate("actionBy", "employeeId")
                if (req.user._id.equals(followUp.actionBy._id)) {
                    res.status(StatusCodes.OK).json({ message: "done", data: followUp });
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({ message: `Request opend by employee Id ${followUp.actionBy.employeeId}` });
                }
            } else {
                const action = await FollowUp.findOneAndUpdate({ _id: followUpId, status: { $ne: "closed" } }, { actionBy: req.user._id, action: true }, { new: true }).populate("userId", "-password -verificationKey").populate("actionBy", "employeeId").populate("document")
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
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get followup" });
    }
}


const getAllFollowUp = async(req, res) => {
    try {
        let { page, size, ...value } = req.query
        const yesterday = new Date(new Date(new Date().setHours(0, 0, 0, 0)).setDate(new Date().getDate() - 2)).toISOString()
        const { skip, limit, currentPage } = pageService(page, size)
        const followUp = await searchServies("", {...value, createdAt: { $lte: yesterday } }, limit, skip, FollowUp, [], "", "")
        if (followUp.data.length) {
            res.status(StatusCodes.OK).json({ message: "done", currentPage, limit, totalPages: followUp.totalPages, total: followUp.total, data: followUp.data });

        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "No followup found" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get followup" });
    }
}


module.exports = {
    getFollowUpById,
    getAllFollowUp
}