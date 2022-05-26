const mongoose = require("mongoose")
const cartSchema = require("../schema/cart.schema")

const Cart = mongoose.model("cart", cartSchema)



module.exports = Cart