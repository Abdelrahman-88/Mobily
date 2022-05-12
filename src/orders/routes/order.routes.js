const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const { getOrderById } = require("../controler/get.orders");
const { addOrder } = require("../controler/order.controler");
const {
    ADD_ORDER,
    GET_ORDER_BY_ID
} = require("../endPoints");
const {
    addOrderSchema,
    getOrderByIdSchema
} = require("../validation/order.validation");
const router = require("express").Router();


router.post("/addOrder/:createdBy/:serviceId", validation(addOrderSchema), isAuthorized(ADD_ORDER), addOrder)

router.get("/getOrderById/:orderId", validation(getOrderByIdSchema), isAuthorized(GET_ORDER_BY_ID), getOrderById)




module.exports = router;