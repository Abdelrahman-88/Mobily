const { StatusCodes } = require("http-status-codes");
const Order = require("../model/order.model");

const getOrderById = async(req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findOne({ orderId }).populate("createdBy serviceId", "-password -verificationKey")
        if (order) {
            if (req.user._id.equals(order.createdBy._id) || req.user.role == "admin") {
                res.status(StatusCodes.OK).json({ message: "Done", data: order });
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid order" });
        }

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get order" });
    }
}


const getAllOrders = async(req, res) => {
    try {

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get order" });
    }
}



module.exports = { getOrderById }