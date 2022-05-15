const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const { getOrderById, getAllOrders, getUserOrders, getSeenOrders } = require("../controler/get.orders");
const { addOrder, updateSeenOrders } = require("../controler/order.controler");
const { validateOrder } = require("../controler/validate.orders");
const {
    ADD_ORDER,
    GET_ORDER_BY_ID,
    GET_ALL_ORDERS,
    VALIDATE_ORDER,
    GET_USER_ORDERS,
    GET_SEEN_ORDERS,
    UPDATE_SEEN_ORDERS
} = require("../endPoints");
const {
    addOrderSchema,
    getOrderByIdSchema,
    getAllOrdersSchema,
    validateOrderSchema,
    getUserOrdersSchema,
    getSeenOrdersSchema,
    updateSeenOrdersSchema
} = require("../validation/order.validation");
const router = require("express").Router();


router.post("/addOrder/:createdBy/:serviceId", validation(addOrderSchema), isAuthorized(ADD_ORDER), addOrder)

router.get("/getOrderById/:orderId", validation(getOrderByIdSchema), isAuthorized(GET_ORDER_BY_ID), getOrderById)

router.get("/getAllOrders", validation(getAllOrdersSchema), isAuthorized(GET_ALL_ORDERS), getAllOrders)

router.put("/validateOrder/:orderId", validation(validateOrderSchema), isAuthorized(VALIDATE_ORDER), validateOrder)

router.get("/getUserOrders/:createdBy", validation(getUserOrdersSchema), isAuthorized(GET_USER_ORDERS), getUserOrders)

router.get("/getSeenOrders/:createdBy", validation(getSeenOrdersSchema), isAuthorized(GET_SEEN_ORDERS), getSeenOrders)

router.patch("/updateSeenOrders/:createdBy", validation(updateSeenOrdersSchema), isAuthorized(UPDATE_SEEN_ORDERS), updateSeenOrders)

module.exports = router;