const { StatusCodes } = require("http-status-codes");
const Order = require("../model/order.model");
const pageService = require("../../../common/service/page");
const searchServies = require("../../../common/service/search")

const getOrderById = async(req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findOne({ orderId }).populate("createdBy serviceId", "-password -verificationKey")
        if (order) {
            if (req.user._id.equals(order.createdBy._id) || req.user.role == "admin" || req.user.role == "operator") {
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
        let { page, size, status, activated } = req.query
        const { skip, limit, currentPage } = pageService(page, size)
        const orders = await searchServies("", { status, activated }, limit, skip, Order, [], "", "")
        if (orders.data.length) {
            res.status(StatusCodes.OK).json({ message: "done", currentPage, limit, totalPages: orders.totalPages, total: orders.total, data: orders.data });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "No orders found" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get orders" });
    }
}

const getUserOrders = async(req, res) => {
    try {
        const { createdBy } = req.params
        if (req.user._id == createdBy) {
            let { page, size, status, activated } = req.query
            const { skip, limit, currentPage } = pageService(page, size)
            const orders = await searchServies("", { createdBy, status, activated }, limit, skip, Order, [], "", "")
            if (orders.data.length) {
                res.status(StatusCodes.OK).json({ message: "done", currentPage, limit, totalPages: orders.totalPages, total: orders.total, data: orders.data });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "No orders found" });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get orders" });
    }
}



module.exports = {
    getOrderById,
    getAllOrders,
    getUserOrders
}