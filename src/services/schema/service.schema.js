const { Schema } = require("mongoose")


const serviceSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "admin" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String, required: true },
    status: {
        type: String,
        enum: ["valid", "expired", "pending"],
        required: true
    },
    category: {
        type: String,
        enum: ["category1", "category2", "category3"],
        required: true
    }

}, { timestamps: true })


module.exports = serviceSchema