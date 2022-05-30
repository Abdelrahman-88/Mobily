const { Schema } = require("mongoose")


const cartSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    services: [{
        serviceId: { type: Schema.Types.ObjectId, ref: "service" },
        quantity: { type: Number, required: true },
        total: { type: Number },
        _id: false
    }],
    totalPrice: { type: Number },
    priceOffer: { type: Boolean, default: false }

}, { timestamps: true })


module.exports = cartSchema