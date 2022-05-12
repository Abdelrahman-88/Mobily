const { Schema } = require("mongoose")


const orderSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    serviceId: { type: Schema.Types.ObjectId, ref: "service" },
    status: {
        type: String,
        enum: ["open", "closed", "pending"],
        required: true,
        default: "open"
    },
    activated: { type: Boolean, required: true, default: false }

}, { timestamps: true })


module.exports = orderSchema