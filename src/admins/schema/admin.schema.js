const { Schema } = require("mongoose")
const bcrypt = require('bcrypt');

const adminSchema = new Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    employeeId: { type: Number, unique: true },
    role: {
        type: String,
        enum: ["admin", "sales", "operator", "techS", "callC"],
        required: true
    },
    verificationKey: { type: String, required: true },
    deactivated: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    logedIn: { type: Boolean, default: false },
    forgetPassword: { type: Boolean, default: false }
}, { timestamps: true })


adminSchema.pre("save", async function(next) {
    try {
        this.password = await bcrypt.hash(this.password, parseInt(process.env.SALTROUNDS))
        next()
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = adminSchema