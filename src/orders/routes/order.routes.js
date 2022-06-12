const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const upload = require("../../../common/service/uploadFile");
const {
    getOrderById,
    getAllOrders,
    getUserOrders,
    getSeenOrders
} = require("../controler/get.orders");
const {
    addOrder,
    updateSeenOrders
} = require("../controler/order.controler");
const { updateOrder } = require("../controler/updateOrder");
const {
    validateOrder,
    removeOrderAction
} = require("../controler/validate.orders");
const {
    ADD_ORDER,
    GET_ORDER_BY_ID,
    GET_ALL_ORDERS,
    VALIDATE_ORDER,
    GET_USER_ORDERS,
    GET_SEEN_ORDERS,
    UPDATE_SEEN_ORDERS,
    REMOVE_ORDER_ACTION,
    UPDATE_ORDER
} = require("../endPoints");
const {
    addOrderSchema,
    getOrderByIdSchema,
    getAllOrdersSchema,
    validateOrderSchema,
    getUserOrdersSchema,
    getSeenOrdersSchema,
    updateSeenOrdersSchema,
    removeOrderActionSchema,
    updateOrderSchema
} = require("../validation/order.validation");
const router = require("express").Router();


router.post("/addOrder/:createdBy/:serviceId", validation(addOrderSchema), isAuthorized(ADD_ORDER), addOrder)

router.get("/getOrderById/:orderId", validation(getOrderByIdSchema), isAuthorized(GET_ORDER_BY_ID), getOrderById)

router.get("/getAllOrders", validation(getAllOrdersSchema), isAuthorized(GET_ALL_ORDERS), getAllOrders)

router.put("/validateOrder/:orderId", upload.single('form'), validation(validateOrderSchema), isAuthorized(VALIDATE_ORDER), validateOrder)

router.get("/getUserOrders/:createdBy", validation(getUserOrdersSchema), isAuthorized(GET_USER_ORDERS), getUserOrders)

router.get("/getSeenOrders/:createdBy", validation(getSeenOrdersSchema), isAuthorized(GET_SEEN_ORDERS), getSeenOrders)

router.patch("/updateSeenOrders/:createdBy", validation(updateSeenOrdersSchema), isAuthorized(UPDATE_SEEN_ORDERS), updateSeenOrders)

router.patch("/removeOrderAction/:orderId", validation(removeOrderActionSchema), isAuthorized(REMOVE_ORDER_ACTION), removeOrderAction)

router.patch("/updateOrder/:orderId", upload.single('form'), validation(updateOrderSchema), isAuthorized(UPDATE_ORDER), updateOrder)

module.exports = router;