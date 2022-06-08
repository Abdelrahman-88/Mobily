const { Schema } = require("mongoose")


const formSchema = new Schema({
    updatedBy: { type: Schema.Types.ObjectId, ref: "superAdmin" },
    form: { type: Object, required: true },
    type: {
        type: String,
        enum: ["transfer"],
        unique: true
    }

}, { timestamps: true })


module.exports = formSchema