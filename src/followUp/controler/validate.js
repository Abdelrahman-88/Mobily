const { StatusCodes } = require("http-status-codes");
const FollowUp = require("../model/followUp.model");

const validateFollowUp = async(req, res) => {
    try {
        const { followUpId } = req.params
        const { status, answered, comment } = req.body
        const now = new Date().toISOString()
        const validFollowUp = await FollowUp.findOne({ _id: followUpId })
        if (validFollowUp) {
            if (validFollowUp.status == "closed") {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Followup already closed" });
            } else {
                if (req.user._id.equals(validFollowUp.actionBy)) {
                    const { employeeId } = req.user._doc
                    const activity = [{ employeeId, comment, date: now }, ...validFollowUp.activity]
                    const followUp = await FollowUp.findOneAndUpdate({ _id: followUpId }, { status, answered, comment, seen: false, activity, action: false, actionBy: null })
                    if (followUp) {
                        res.status(StatusCodes.OK).json({ message: "Followup validated successfully" });
                    } else {
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Invalid followup" });
                    }
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
                }
            }
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Invalid followup" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to validate followup" });
    }
}


const removeFollowUpAction = async(req, res) => {
    try {
        const { followUpId } = req.params;
        const followUp = await FollowUp.findOne({ _id: followUpId })
        if (followUp) {
            if (followUp.action) {
                if (req.user._id.equals(followUp.actionBy)) {
                    const remove = await FollowUp.findOneAndUpdate({ _id: followUpId }, { action: false, actionBy: null })
                    res.status(StatusCodes.OK).json({ message: "Action removed successfully" });
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
                }
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "No action found" });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid followup" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to remove action" });
    }
}




module.exports = {
    validateFollowUp,
    removeFollowUpAction
}