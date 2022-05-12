const { Schema } = require("mongoose")


const documentSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
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
    }
}, { timestamps: true })


module.exports = documentSchema