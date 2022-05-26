const { StatusCodes } = require("http-status-codes");
const Order = require("../../orders/model/order.model");
const Service = require("../../services/model/service.model");
const Cart = require("../model/cart.model");

const addCart = async(req, res) => {
    try {
        const { createdBy } = req.params;
        let services = req.body;
        if (req.user._id == createdBy) {
            let newServices = [];
            let totalPrice = 0;
            const promises = await services.map(async(service) => {
                const valid = await Service.findOne({ _id: service.serviceId });
                if (valid) {
                    service['total'] = valid.price * service.quantity;
                    totalPrice += service.total;
                    newServices.push(service);
                } else {
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid service" });
                }
            });
            await Promise.all(promises);
            const newCart = new Cart({ createdBy, services: newServices, totalPrice });
            const cart = await newCart.save();
            const newOrder = new Order({ createdBy, cartId: cart._id });
            const order = await newOrder.save();
            res.status(StatusCodes.CREATED).json({ message: "Cart added successfully", cart, order });
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to add cart" });
    }
}



module.exports = { addCart }