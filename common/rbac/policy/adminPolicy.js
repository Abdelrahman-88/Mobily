const {
    ADD_ADMIN,
    ADMIN_LOG_OUT
} = require("../../../src/admins/endPoints");
const {
    GET_ALL_DOCUMENT,
    GET_DOCUMENT,
    VALIDATE_DOCUMENT,
    REMOVE_ORDER_ACTION
} = require("../../../src/documents/endPoints");
const {
    GET_ORDER_BY_ID,
    GET_ALL_ORDERS,
    VALIDATE_ORDER
} = require("../../../src/orders/endPoints");
const {
    ADD_SERVICE,
    UPDATE_SERVICE
} = require("../../../src/services/endPoints");
const {
    USER_EXPIRE_DOCMENT
} = require("../../../src/users/endPoint");

module.exports = [ADD_ADMIN, GET_ALL_DOCUMENT, GET_DOCUMENT, VALIDATE_DOCUMENT, USER_EXPIRE_DOCMENT, ADD_SERVICE, UPDATE_SERVICE,
    ADMIN_LOG_OUT, REMOVE_ORDER_ACTION
]