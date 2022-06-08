const { Schema } = require("mongoose")


const orderSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    requestId: { type: Schema.Types.ObjectId },
    actionBy: { type: Schema.Types.String, ref: "admin" },
    action: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["open", "closed", "pending"],
        required: true,
        default: "open"
    },
    type: {
        type: String,
        enum: ["cart", "priceOffer", "transfer"]
    },
    activated: { type: Boolean, required: true, default: false },
    seen: { type: Boolean, required: true, default: true },
    ban: { type: Boolean, default: false },
    activity: [{ type: Object }]

}, {
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
})

orderSchema.virtual('cart', {
    ref: 'cart',
    localField: 'requestId',
    foreignField: '_id',
    justOne: true
});

orderSchema.virtual('priceOffer', {
    ref: 'priceOffer',
    localField: 'requestId',
    foreignField: '_id',
    justOne: true
});

orderSchema.virtual('transfer', {
    ref: 'transfer',
    localField: 'requestId',
    foreignField: '_id',
    justOne: true
});


module.exports = orderSchema