const {
    UPLOAD_FILE,
    GET_DOCUMENT
} = require("../../../src/documents/endPoints");
const {
    ADD_ORDER,
    GET_ORDER_BY_ID,
    GET_USER_ORDERS
} = require("../../../src/orders/endPoints");
const {
    UPDATE_PROFILE,
    UPDATE_PASSWORD,
    RESET_PASSWORD,
    CHANGE_PASSWORD,
    LOG_OUT
} = require("../../../src/users/endPoint");

module.exports = [UPDATE_PROFILE, UPDATE_PASSWORD, RESET_PASSWORD, CHANGE_PASSWORD, LOG_OUT, UPLOAD_FILE, GET_DOCUMENT, ADD_ORDER,
    GET_ORDER_BY_ID, GET_USER_ORDERS
]