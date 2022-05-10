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
    },
    stage: {
        type: String,
        enum: ["stage1", "stage2"],
        default: "stage1"
    }
}, { timestamps: true })


module.exports = documentSchema