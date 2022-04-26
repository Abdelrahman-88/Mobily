const {
    UPLOAD_FILE,
    GET_DOCUMENT
} = require("../../../src/documents/endPoints");
const {
    UPDATE_PROFILE,
    UPDATE_PASSWORD,
    RESET_PASSWORD,
    CHANGE_PASSWORD,
    LOG_OUT
} = require("../../../src/users/endPoint");

module.exports = [UPDATE_PROFILE, UPDATE_PASSWORD, RESET_PASSWORD, CHANGE_PASSWORD, LOG_OUT, UPLOAD_FILE, GET_DOCUMENT]