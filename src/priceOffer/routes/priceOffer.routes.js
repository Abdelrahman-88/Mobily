const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const { addPriceOffer } = require("../controler/add");
const { displayPdf } = require("../controler/display");
const { ADD_PRICE_OFFER } = require("../endPoints");
const {
    addPriceOfferSchema,
    displayPdfSchema
} = require("../validation/priceOffer.validation");
const router = require("express").Router();

router.post("/addPriceOffer/:createdBy", validation(addPriceOfferSchema), isAuthorized(ADD_PRICE_OFFER), addPriceOffer)

router.get("/displayPdf/:filename", validation(displayPdfSchema), displayPdf)



module.exports = router;