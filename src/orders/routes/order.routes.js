const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const { getOrderById, getAllOrders, getUserOrders } = require("../controler/get.orders");
const { addOrder } = require("../controler/order.controler");
const { validateOrder } = require("../controler/validate.orders");
const {
    ADD_ORDER,
    GET_ORDER_BY_ID,
    GET_ALL_ORDERS,
    VALIDATE_ORDER,
    GET_USER_ORDERS
} = require("../endPoints");
const {
    addOrderSchema,
    getOrderByIdSchema,
    getAllOrdersSchems,
    validateOrderSchema,
    getUserOrdersSchems
} = require("../validation/order.validation");
const router = require("express").Router();


router.post("/addOrder/:createdBy/:serviceId", validation(addOrderSchema), isAuthorized(ADD_ORDER), addOrder)

router.get("/getOrderById/:orderId", validation(getOrderByIdSchema), isAuthorized(GET_ORDER_BY_ID), getOrderById)

router.get("/getAllOrders", validation(getAllOrdersSchems), isAuthorized(GET_ALL_ORDERS), getAllOrders)

router.put("/validateOrder/:orderId", validation(validateOrderSchema), isAuthorized(VALIDATE_ORDER), validateOrder)

router.get("/getUserOrders/:createdBy", validation(getUserOrdersSchems), isAuthorized(GET_USER_ORDERS), getUserOrders)


module.exports = router;