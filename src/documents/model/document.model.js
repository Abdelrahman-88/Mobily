const mongoose = require("mongoose")
const documentSchema = require("../schema/document.schema")

const Document = mongoose.model("document", documentSchema)



module.exports = Document