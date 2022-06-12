const { StatusCodes } = require("http-status-codes");
const PriceOffer = require("../../priceOffer/model/priceOffer.model");
const Order = require("../model/order.model");


const updateOrder = async(req, res) => {
    try {
        const { orderId } = req.params
        const validOrder = await Order.findOne({ _id: orderId })
        if (validOrder) {
            if (validOrder.type == "priceOffer" && req.user._id.equals(validOrder.createdBy) && validOrder.status == "pending") {
                if (req.fileValidationError) {
                    res.status(StatusCodes.BAD_REQUEST).json({ message: req.fileValidationError });
                } else {
                    if (req.file) {
                        let userPdf = {
                            name: req.file.filename,
                            url: process.env.URL + 'displayPdf/' + req.file.filename
                        }
                        const priceOffer = await PriceOffer.findOneAndUpdate({ _id: validOrder.requestId }, { userPdf })
                        const order = await Order.findOneAndUpdate({ _id: orderId }, { status: "open" })
                        res.status(StatusCodes.OK).json({ message: "Order updated successfully" });
                    } else {
                        res.status(StatusCodes.BAD_REQUEST).json({ message: "User PDF is required" });
                    }
                }
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid order" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to update order" });
    }
}

module.exports = { updateOrder }