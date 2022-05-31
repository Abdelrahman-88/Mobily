const { Schema } = require("mongoose")


const followUpSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    requestId: { type: Schema.Types.ObjectId },
    actionBy: { type: Schema.Types.String, ref: "admin" },
    action: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["open", "closed", "pending"],
        required: true,
        default: "open"
    },
    activity: [{ type: Object }],
    answered: { type: Boolean, required: true, default: false }

}, {
    toJSON: { virtuals: true }
}, { timestamps: true })

followUpSchema.virtual('order', {
    ref: 'order',
    localField: 'requestId',
    foreignField: '_id',
    justOne: true
});

followUpSchema.virtual('document', {
    ref: 'document',
    localField: 'requestId',
    foreignField: '_id',
    justOne: true
});


module.exports = followUpSchema