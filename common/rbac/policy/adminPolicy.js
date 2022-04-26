const {
    GET_ALL_DOCUMENT,
    GET_DOCUMENT,
    VALIDATE_DOCUMENT
} = require("../../../src/documents/endPoints");
const {
    ADD_ADMIN,
    USER_EXPIRE_DOCMENT
} = require("../../../src/users/endPoint");

module.exports = [ADD_ADMIN, GET_ALL_DOCUMENT, GET_DOCUMENT, VALIDATE_DOCUMENT, USER_EXPIRE_DOCMENT]