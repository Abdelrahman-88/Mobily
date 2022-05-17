const validation = require("../../../common/middelWare/validation");
const isAuthorized = require("../../../common/middelWare/isAuthorized");

const { addAdmin } = require("../controler/addAdmin");
const { adminLogIn, adminLogOut } = require("../controler/adminLogin");
const {
    addAdminSchema,
    adminLogInSchema,
    adminLogOutSchema
} = require("../validation/admin.validation");
const {
    ADD_ADMIN,
    ADMIN_LOG_OUT
} = require("../endPoints");

const router = require("express").Router();

router.post("/addAdmin", validation(addAdminSchema), isAuthorized(ADD_ADMIN), addAdmin);

router.post("/adminLogIn", validation(adminLogInSchema), adminLogIn);

router.patch("/adminLogOut/:id", validation(adminLogOutSchema), isAuthorized(ADMIN_LOG_OUT), adminLogOut)

module.exports = router;