const {
    ADD_CART,
    SEND_VERIFICATION_KEY,
    VERIFY_CART
} = require("../../../src/cart/endPoints");
const {
    UPLOAD_FILE,
    GET_DOCUMENT,
    GET_USER_DOCUMENTS,
    GET_SEEN_DOCUMENTS,
    UPDATE_SEEN_DOCUMENTS,
    CHECK_DOCUMENT,
    UPDATE_FILE
} = require("../../../src/documents/endPoints");
const { GET_ALL_FORMS } = require("../../../src/form/endPoints");
const {
    ADD_ORDER,
    GET_ORDER_BY_ID,
    GET_USER_ORDERS,
    GET_SEEN_ORDERS,
    UPDATE_SEEN_ORDERS,
    UPDATE_ORDER
} = require("../../../src/orders/endPoints");
const { ADD_PRICE_OFFER } = require("../../../src/priceOffer/endPoints");
const { ADD_TRANSFER } = require("../../../src/transfer/endPoints");
const {
    UPDATE_PROFILE,
    UPDATE_PASSWORD,
    RESET_PASSWORD,
    CHANGE_PASSWORD,
    LOG_OUT
} = require("../../../src/users/endPoint");

module.exports = [UPDATE_PROFILE, UPDATE_PASSWORD, RESET_PASSWORD, CHANGE_PASSWORD, LOG_OUT, UPLOAD_FILE, GET_DOCUMENT, ADD_ORDER,
    GET_ORDER_BY_ID, GET_USER_ORDERS, GET_SEEN_ORDERS, UPDATE_SEEN_ORDERS, GET_USER_DOCUMENTS, GET_SEEN_DOCUMENTS, UPDATE_SEEN_DOCUMENTS,
    CHECK_DOCUMENT, ADD_CART, SEND_VERIFICATION_KEY, VERIFY_CART, UPDATE_FILE, ADD_PRICE_OFFER, ADD_TRANSFER, GET_ALL_FORMS,
    UPDATE_ORDER
]