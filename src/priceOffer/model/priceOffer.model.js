const mongoose = require("mongoose")
const priceOfferSchema = require("../schema/priceOffer.schema")

const PriceOffer = mongoose.model("priceOffer", priceOfferSchema)



module.exports = PriceOffer