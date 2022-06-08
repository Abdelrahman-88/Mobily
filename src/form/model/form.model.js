const mongoose = require("mongoose")
const formSchema = require("../schema/form.schema")

const Form = mongoose.model("form", formSchema)



module.exports = Form