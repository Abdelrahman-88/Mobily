const { Schema } = require("mongoose")


const priceOfferSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    services: [{
        serviceId: { type: Schema.Types.ObjectId, ref: "service" },
        quantity: { type: Number, required: true },
        price: { type: Number },
        total: { type: Number },
        _id: false
    }],
    totalPrice: { type: Number },
    pricePdf: { type: Object },
    userPdf: { type: Object },
    comments: [Object],
    accept: { type: Boolean, default: false }


}, { timestamps: true })


module.exports = priceOfferSchema