const validation = require("../../../common/middelWare/validation");
const isAuthorized = require("../../../common/middelWare/isAuthorized");
const {
    addAdminSchema,
    adminLogInSchema
} = require("../validation/admin.validation");
const {
    addAdmin,
    adminLogIn
} = require("../controler/addAdmin");
const { ADD_ADMIN } = require("../endPoint");



const router = require("express").Router();

router.post("/addAdmin", validation(addAdminSchema), isAuthorized(ADD_ADMIN), addAdmin);
router.post("/adminLogIn", validation(adminLogInSchema), adminLogIn)

module.exports = router;