const { Schema } = require("mongoose")


const transferSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    transferForm: { type: Object, required: true }

}, { timestamps: true })


module.exports = transferSchema