const { StatusCodes } = require("http-status-codes");
const Order = require("../model/order.model");

const validateOrder = async(req, res) => {
    try {
        const { orderId } = req.params
        const { status, activated, comment, ban } = req.body
        const validOrder = await Order.findOne({ _id: orderId, status: "closed" })
        if (validOrder) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Order already closed" });
        } else {
            const order = await Order.findOneAndUpdate({ _id: orderId }, { status, activated, comment, seen: false, ban })
            if (order) {
                res.status(StatusCodes.OK).json({ message: "Order validated successfully" });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Invalid order" });
            }
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to validate order" });
    }
}


module.exports = { validateOrder }