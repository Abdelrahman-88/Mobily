const { ADD_ADMIN } = require("../../../src/admins/endPoints");
const {
    GET_ALL_DOCUMENT,
    GET_DOCUMENT,
    REMOVE_DOCUMENT_ACTION,
    EDIT_DOCUMENT
} = require("../../../src/documents/endPoints");
const { GET_ALL_USERS } = require("../../../src/users/endPoint");

module.exports = [ADD_ADMIN, GET_ALL_DOCUMENT, GET_DOCUMENT, REMOVE_DOCUMENT_ACTION, EDIT_DOCUMENT, GET_ALL_USERS]