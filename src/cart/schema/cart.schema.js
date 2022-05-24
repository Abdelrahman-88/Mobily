const { Schema } = require("mongoose")


const cartSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    services: [{
        serviceId: { type: Schema.Types.ObjectId, ref: "service" },
        quantity: { type: Number, required: true },
        total: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true }

}, { timestamps: true })


module.exports = cartSchema