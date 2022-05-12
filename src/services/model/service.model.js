const mongoose = require("mongoose")
const serviceSchema = require("../schema/service.schema")

const Service = mongoose.model("service", serviceSchema)



module.exports = Service