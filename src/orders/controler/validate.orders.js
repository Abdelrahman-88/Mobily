const { StatusCodes } = require("http-status-codes");
const FollowUp = require("../../followUp/model/followUp.model");
const Order = require("../model/order.model");

const validateOrder = async(req, res) => {
    try {
        const { orderId } = req.params
        const { status, activated, comment, ban } = req.body
        const now = new Date().toISOString()
        const validOrder = await Order.findOne({ _id: orderId })
        if (validOrder) {
            if (validOrder.status == "closed") {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Order already closed" });
            } else {
                const { employeeId } = req.user._doc
                const activity = [{ employeeId, comment, date: now }, ...validOrder.activity]
                const order = await Order.findOneAndUpdate({ _id: orderId }, { status, activated, comment, seen: false, ban, activity, action: false, actionBy: "" })
                if (order) {
                    if (status == "pending") {
                        const followUp = new FollowUp({ userId: order.createdBy, requestId: orderId })
                        const saved = await followUp.save()
                    }
                    res.status(StatusCodes.OK).json({ message: "Order validated successfully" });
                } else {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Invalid order" });
                }
            }
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Invalid order" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to validate order" });
    }
}

const removeOrderAction = async(req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ _id: orderId })
        if (order) {
            if (order.action) {
                if (req.user._id.equals(order.actionBy)) {
                    const remove = await Order.findOneAndUpdate({ _id: orderId }, { action: false, actionBy: "" })
                    res.status(StatusCodes.OK).json({ message: "Action removed successfully" });
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
                }
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "No action found" });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid order" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to remove action" });
    }
}


module.exports = {
    validateOrder,
    removeOrderAction
}