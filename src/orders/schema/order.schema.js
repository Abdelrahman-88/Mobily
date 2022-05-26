const { Schema } = require("mongoose")


const orderSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    cartId: { type: Schema.Types.ObjectId, ref: "cart" },
    actionBy: { type: Schema.Types.String, ref: "admin" },
    action: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["open", "closed", "pending"],
        required: true,
        default: "open"
    },
    activated: { type: Boolean, required: true, default: false },
    seen: { type: Boolean, required: true, default: true },
    ban: { type: Boolean, default: false },
    activity: [{ type: Object }]

}, { timestamps: true })


module.exports = orderSchema