const { StatusCodes } = require("http-status-codes");
const FollowUp = require("../../followUp/model/followUp.model");
const PriceOffer = require("../../priceOffer/model/priceOffer.model");
const Service = require("../../services/model/service.model");
const Order = require("../model/order.model");

const validateOrder = async(req, res) => {
    try {
        const { orderId } = req.params
        const { status, activated, comment, ban, services } = req.body
        const now = new Date().toISOString()
        const validOrder = await Order.findOne({ _id: orderId })
        if (validOrder) {
            if (validOrder.status == "closed") {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Order already closed" });
            } else {
                if (req.user._id.equals(validOrder.actionBy)) {
                    let order;
                    const { employeeId } = req.user._doc
                    const activity = [{ employeeId, comment, date: now }, ...validOrder.activity]
                    if (validOrder.type == "priceOffer") {
                        if (status == "closed") {
                            if (services) {
                                let newServices = [];
                                let totalPrice = 0;
                                const promises = await services.map(async(service) => {
                                    const valid = await Service.findOne({ _id: service.serviceId });
                                    if (valid) {
                                        service['total'] = service.price * service.quantity;
                                        totalPrice += service.total;
                                        newServices.push(service);
                                    } else {
                                        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid service" });
                                    }
                                });
                                await Promise.all(promises);
                                const priceOffer = await PriceOffer.findOneAndUpdate({ _id: validOrder.requestId }, { services: newServices, totalPrice })
                                order = await Order.findOneAndUpdate({ _id: orderId }, { status, activated, comment, seen: false, ban, activity, action: false, actionBy: null })
                                res.status(StatusCodes.OK).json({ message: "Order validated successfully" });
                            } else {
                                res.status(StatusCodes.BAD_REQUEST).json({ message: "Services are required" });
                            }
                        } else {
                            order = await Order.findOneAndUpdate({ _id: orderId }, { status, activated, comment, seen: false, ban, activity, action: false, actionBy: null })
                            res.status(StatusCodes.OK).json({ message: "Order validated successfully" });
                        }
                    } else {
                        order = await Order.findOneAndUpdate({ _id: orderId }, { status, activated, comment, seen: false, ban, activity, action: false, actionBy: null })
                        res.status(StatusCodes.OK).json({ message: "Order validated successfully" });
                    }
                } else {
                    res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
                }
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid order" });
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
                    const remove = await Order.findOneAndUpdate({ _id: orderId }, { action: false, actionBy: null })
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