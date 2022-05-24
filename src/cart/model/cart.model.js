const mongoose = require("mongoose")
const cartSchema = require("../schema/cart.schema")

const Cart = mongoose.model("document", cartSchema)



module.exports = Cart