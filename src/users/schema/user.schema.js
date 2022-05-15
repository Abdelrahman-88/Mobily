const { Schema } = require("mongoose")
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name: { type: String, required: true },
    companyName: { type: String, required: true },
    position: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    documentId: { type: Schema.Types.ObjectId, ref: "document" },
    documentExpiryDate: Date,
    documentValidity: { type: Boolean, default: false },
    salesId: { type: Number },
    role: {
        type: String,
        enum: ["user"],
        default: "user"
    },
    verificationKey: { type: String, required: true },
    verified: { type: Boolean, default: false },
    deactivated: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    logedIn: { type: Boolean, default: false },
    forgetPassword: { type: Boolean, default: false }
}, { timestamps: true })


userSchema.pre("save", async function(next) {
    try {
        this.password = await bcrypt.hash(this.password, parseInt(process.env.SALTROUNDS))
        next()
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = userSchema