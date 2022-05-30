const { StatusCodes } = require("http-status-codes");
const Order = require("../../orders/model/order.model");
const Service = require("../../services/model/service.model");
const Cart = require("../model/cart.model");

const addPriceOffer = async(req, res) => {
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
            const newOffer = new Cart({ createdBy, services: newServices, totalPrice, priceOffer: true });
            const offer = await newOffer.save();
            const newOrder = new Order({ createdBy, cartId: offer._id });
            const order = await newOrder.save();
            res.status(StatusCodes.CREATED).json({ message: "Price offer sent successfully", offer, order });
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to send price offer" });
    }
}



module.exports = { addPriceOffer }