const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const { addCart } = require("../controler/add");
const {
    sendVerificationKey,
    verifyCart
} = require("../controler/verifyCart");
const {
    ADD_CART,
    SEND_VERIFICATION_KEY,
    VERIFY_CART
} = require("../endPoints");
const {
    addCartSchema,
    sendVerificationKeySchema,
    verifyCartSchema
} = require("../validation/cart.validation");
const router = require("express").Router();

router.post("/addCart/:createdBy", validation(addCartSchema), isAuthorized(ADD_CART), addCart);

router.post("/sendVerificationKey/:id", validation(sendVerificationKeySchema), isAuthorized(SEND_VERIFICATION_KEY), sendVerificationKey)

router.post("/verifyCart/:id", validation(verifyCartSchema), isAuthorized(VERIFY_CART), verifyCart)










module.exports = router;