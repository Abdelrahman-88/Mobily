const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const { addCart } = require("../controler/add");
const { addPriceOffer } = require("../controler/priceOffer");
const { sendVerificationKey, verifyCart } = require("../controler/verifyCart");
const {
    ADD_CART,
    PRICE_OFFER,
    SEND_VERIFICATION_KEY,
    VERIFY_CART
} = require("../endPoints");
const {
    addCartSchema,
    priceOfferSchema,
    sendVerificationKeySchema,
    verifyCartSchema
} = require("../validation/cart.validation");
const router = require("express").Router();

router.post("/addCart/:createdBy", validation(addCartSchema), isAuthorized(ADD_CART), addCart);

router.post("/addPriceOffer/:createdBy", validation(priceOfferSchema), isAuthorized(PRICE_OFFER), addPriceOffer)

router.post("/sendVerificationKey/:id", validation(sendVerificationKeySchema), isAuthorized(SEND_VERIFICATION_KEY), sendVerificationKey)

router.post("/verifyCart/:id", validation(verifyCartSchema), isAuthorized(VERIFY_CART), verifyCart)










module.exports = router;