const { Schema } = require("mongoose")


const documentSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    actionBy: { type: Schema.Types.String, ref: "admin" },
    action: { type: Boolean, default: false },
    documents: [{ type: Object, required: true }],
    expiryDate: Date,
    valid: {
        type: String,
        enum: ["valid", "invalid"],
        default: "invalid"
    },
    status: {
        type: String,
        enum: ["open", "closed", "pending"],
        default: "open"
    },
    seen: { type: Boolean, required: true, default: true },
    activity: [{ type: Object }]
}, { timestamps: true })


module.exports = documentSchema