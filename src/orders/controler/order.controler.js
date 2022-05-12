const { StatusCodes } = require("http-status-codes");
const Service = require("../../services/model/service.model");
const Order = require("../model/order.model");

const addOrder = async(req, res) => {
    try {
        const { createdBy, serviceId } = req.params
        if (req.user._id == createdBy) {
            const service = await Service.findOne({ _id: serviceId })
            if (service) {
                const newOrder = new Order({ createdBy, serviceId })
                const data = await newOrder.save()
                res.status(StatusCodes.CREATED).json({ message: "Order added successfully", data });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid service" });
            }
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to add order" });
    }
}



module.exports = { addOrder }