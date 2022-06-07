const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const { addPriceOffer } = require("../controler/add");
const { ADD_PRICE_OFFER } = require("../endPoints");
const { addPriceOfferSchema } = require("../validation/priceOffer.validation");
const router = require("express").Router();

router.post("/addPriceOffer/:createdBy", validation(addPriceOfferSchema), isAuthorized(ADD_PRICE_OFFER), addPriceOffer)





module.exports = router;