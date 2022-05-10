const { ADD_ADMIN } = require("../../../src/admins/endPoints");
const {
    GET_ALL_DOCUMENT,
    GET_DOCUMENT,
    VALIDATE_DOCUMENT,
    ACTIVATE_SERVICE
} = require("../../../src/documents/endPoints");
const {
    USER_EXPIRE_DOCMENT
} = require("../../../src/users/endPoint");

module.exports = [ADD_ADMIN, GET_ALL_DOCUMENT, GET_DOCUMENT, VALIDATE_DOCUMENT, USER_EXPIRE_DOCMENT, ACTIVATE_SERVICE]