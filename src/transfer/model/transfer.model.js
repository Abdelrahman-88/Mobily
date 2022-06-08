const mongoose = require("mongoose")
const transferSchema = require("../schema/transfer.schema")

const Transfer = mongoose.model("transfer", transferSchema)



module.exports = Transfer