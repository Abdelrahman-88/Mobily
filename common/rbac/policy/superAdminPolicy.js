const {
    ADD_ADMIN,
    ADMIN_LOG_OUT
} = require("../../../src/admins/endPoints");
const {
    GET_ALL_DOCUMENT,
    GET_DOCUMENT,
    REMOVE_DOCUMENT_ACTION,
    EDIT_DOCUMENT
} = require("../../../src/documents/endPoints");
const {
    UPDATE_FROM,
    GET_ALL_FORMS
} = require("../../../src/form/endPoints");
const { GET_ALL_USERS } = require("../../../src/users/endPoint");

module.exports = [ADD_ADMIN, GET_ALL_DOCUMENT, GET_DOCUMENT, REMOVE_DOCUMENT_ACTION, EDIT_DOCUMENT, GET_ALL_USERS, ADMIN_LOG_OUT,
    UPDATE_FROM, GET_ALL_FORMS
]