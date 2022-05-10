const mongoose = require("mongoose")
const adminSchema = require("../schema/admin.schema")

const Admin = mongoose.model("admin", adminSchema)

module.exports = Admin