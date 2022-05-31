const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const { getFollowUpById, getAllFollowUp } = require("../controler/get");
const {
    validateFollowUp,
    removeFollowUpAction
} = require("../controler/validate");
const {
    VALIDATE_FOLLOWUP,
    REMOVE_FOLLOWUP_ACTION,
    GET_FOLLOWUP_BY_ID,
    GET_ALL_FOLLOWUP
} = require("../endPoints");
const {
    validateFollowUpSchema,
    removeFollowUpActionSchema,
    getFollowUpByIdSchema,
    getAllFollowUpSchema
} = require("../validation/followUp.validation");

const router = require("express").Router();

router.put("/validateFollowUp/:followUpId", validation(validateFollowUpSchema), isAuthorized(VALIDATE_FOLLOWUP), validateFollowUp)

router.patch("/removeFollowUpAction/:followUpId", validation(removeFollowUpActionSchema), isAuthorized(REMOVE_FOLLOWUP_ACTION), removeFollowUpAction)

router.get("/getFollowUpById/:followUpId", validation(getFollowUpByIdSchema), isAuthorized(GET_FOLLOWUP_BY_ID), getFollowUpById)

router.get("/getAllFollowUp", validation(getAllFollowUpSchema), isAuthorized(GET_ALL_FOLLOWUP), getAllFollowUp)


module.exports = router;