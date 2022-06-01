const { ADMIN_LOG_OUT } = require("../../../src/admins/endPoints");
const {
    VALIDATE_FOLLOWUP,
    REMOVE_FOLLOWUP_ACTION,
    GET_FOLLOWUP_BY_ID,
    GET_ALL_FOLLOWUP
} = require("../../../src/followUp/endPoints");

module.exports = [VALIDATE_FOLLOWUP, REMOVE_FOLLOWUP_ACTION, GET_FOLLOWUP_BY_ID, GET_ALL_FOLLOWUP, ADMIN_LOG_OUT]