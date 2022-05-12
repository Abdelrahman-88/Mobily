const mongoose = require("mongoose")
const orderSchema = require("../schema/order.schema")

const Order = mongoose.model("order", orderSchema)



module.exports = Order