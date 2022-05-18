const { StatusCodes } = require("http-status-codes");
const Order = require("../model/order.model");
const pageService = require("../../../common/service/page");
const searchServies = require("../../../common/service/search")

const getOrderById = async(req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findOne({ _id: orderId }).populate("createdBy serviceId", "-password -verificationKey")
        if (order) {
            if (req.user._id.equals(order.createdBy._id)) {
                res.status(StatusCodes.OK).json({ message: "Done", data: order });
            } else if (req.user.role == "operator") {
                const action = await Order.findOneAndUpdate({ _id: orderId, status: { $ne: "closed" } }, { actionBy: req.user._id, action: true }, { new: true }).populate("createdBy serviceId", "-password -verificationKey").populate("actionBy", "employeeId")
                if (action) {
                    res.status(StatusCodes.OK).json({ message: "done", data: action });
                } else {
                    res.status(StatusCodes.OK).json({ message: "done", data: order });
                }
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
        let { page, size, status, activated, action } = req.query
        const { skip, limit, currentPage } = pageService(page, size)
        const orders = await searchServies("", { status, activated, action }, limit, skip, Order, [], "serviceId", "name")
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
            const orders = await searchServies("", { createdBy, status, activated }, limit, skip, Order, [], "serviceId", "name")
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


const getSeenOrders = async(req, res) => {
    try {
        const { createdBy } = req.params
        if (req.user._id == createdBy) {
            let { page, size } = req.query
            const { skip, limit, currentPage } = pageService(page, size)
            const orders = await searchServies("", { createdBy, seen: false }, limit, skip, Order, [], "", "")
            if (orders.data.length) {
                res.status(StatusCodes.OK).json({ message: "done", currentPage, limit, totalPages: orders.totalPages, total: orders.total, data: orders.data });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "No seen orders found" });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get seen orders" });
    }
}



module.exports = {
    getOrderById,
    getAllOrders,
    getUserOrders,
    getSeenOrders
}