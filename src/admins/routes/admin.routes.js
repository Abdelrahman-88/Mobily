const validation = require("../../../common/middelWare/validation");
const isAuthorized = require("../../../common/middelWare/isAuthorized");

const { addAdmin } = require("../controler/addAdmin");
const { adminLogIn } = require("../controler/adminLogin");
const {
    addAdminSchema,
    adminLogInSchema
} = require("../validation/admin.validation");
const { ADD_ADMIN } = require("../endPoints");



const router = require("express").Router();

router.post("/addAdmin", validation(addAdminSchema), isAuthorized(ADD_ADMIN), addAdmin);
router.post("/adminLogIn", validation(adminLogInSchema), adminLogIn)

module.exports = router;