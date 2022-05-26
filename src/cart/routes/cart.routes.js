const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const { addCart } = require("../controler/add");
const { ADD_CART } = require("../endPoints");
const { addCartSchema } = require("../validation/cart.validation");
const router = require("express").Router();

router.post("/addCart/:createdBy", validation(addCartSchema), isAuthorized(ADD_CART), addCart)












module.exports = router;