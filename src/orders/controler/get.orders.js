const { StatusCodes } = require("http-status-codes");
const Order = require("../model/order.model");
const pageService = require("../../../common/service/page");
const searchServies = require("../../../common/service/search");

const getOrderById = async(req, res) => {
    try {
        const { orderId } = req.params
        let order = await Order.findOne({ _id: orderId }).populate({ path: "cart priceOffer", populate: { path: "services.serviceId" } }).populate({ path: "createdBy", populate: { path: "documentId" }, select: "-password -verificationKey" }).populate("transfer")
        if (order) {
            if (req.user._id.equals(order.createdBy._id)) {
                const seen = await Order.findOneAndUpdate({ _id: orderId }, { seen: true }, { new: true }).populate({ path: "createdBy", populate: { path: "documentId" }, select: "-password -verificationKey" }).populate({ path: "cart priceOffer", populate: { path: "services.serviceId" } }).populate("transfer")
                res.status(StatusCodes.OK).json({ message: "Done", data: seen });
            } else if (req.user.role == "operator") {
                if (order.action) {
                    order = await Order.findOne({ _id: orderId }).populate({ path: "createdBy", populate: { path: "documentId" }, select: "-password -verificationKey" }).populate({ path: "cart priceOffer", populate: { path: "services.serviceId" } }).populate("actionBy", "employeeId").populate("transfer")
                    if (req.user._id.equals(order.actionBy._id)) {
                        res.status(StatusCodes.OK).json({ message: "done", data: order });
                    } else {
                        res.status(StatusCodes.UNAUTHORIZED).json({ message: `Request opend by employee Id ${order.actionBy.employeeId}` });
                    }
                } else {
                    const action = await Order.findOneAndUpdate({ _id: orderId, status: { $ne: "closed" } }, { actionBy: req.user._id, action: true }, { new: true }).populate({ path: "createdBy", populate: { path: "documentId" }, select: "-password -verificationKey" }).populate("actionBy", "employeeId").populate({ path: "cart priceOffer", populate: { path: "services.serviceId" } }).populate("transfer")
                    if (action) {
                        res.status(StatusCodes.OK).json({ message: "done", data: action });
                    } else {
                        res.status(StatusCodes.OK).json({ message: "done", data: order });
                    }
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
        let { page, size, status, activated, action, actionBy, type } = req.query
        const { skip, limit, currentPage } = pageService(page, size)
        const orders = await searchServies("", { status, activated, action, actionBy, type }, limit, skip, Order, [], "cart priceOffer transfer createdBy", "companyName", "")
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
            let { page, size, status, activated, type } = req.query
            const { skip, limit, currentPage } = pageService(page, size)
            const orders = await searchServies("", { createdBy, status, activated, type }, limit, skip, Order, [], "cart priceOffer transfer", "", "")
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
            const orders = await searchServies("", { createdBy, seen: false }, limit, skip, Order, [], "", "", "")
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