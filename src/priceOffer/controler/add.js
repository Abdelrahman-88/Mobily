const { StatusCodes } = require("http-status-codes");
const Order = require("../../orders/model/order.model");
const Service = require("../../services/model/service.model");
const PriceOffer = require("../model/priceOffer.model");

const addPriceOffer = async(req, res) => {
    try {
        const { createdBy } = req.params;
        let services = req.body;
        if (req.user._id == createdBy) {
            let newServices = [];
            const promises = await services.map(async(service) => {
                const valid = await Service.findOne({ _id: service.serviceId });
                if (valid) {
                    newServices.push(service);
                } else {
                    res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid service" });
                }
            });
            await Promise.all(promises);
            const newOffer = new PriceOffer({ createdBy, services: newServices });
            const offer = await newOffer.save();
            const newOrder = new Order({ createdBy, requestId: offer._id, type: "priceOffer" });
            const order = await newOrder.save();
            res.status(StatusCodes.CREATED).json({ message: "Price offer sent successfully" });
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to send price offer" });
    }
}



module.exports = { addPriceOffer }