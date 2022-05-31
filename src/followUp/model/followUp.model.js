const mongoose = require("mongoose")
const followUpSchema = require("../schema/followUp.schema")

const FollowUp = mongoose.model("followUp", followUpSchema)



module.exports = FollowUp