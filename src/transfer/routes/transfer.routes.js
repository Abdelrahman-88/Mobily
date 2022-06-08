const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const {
    addTransfer,
    displayForm
} = require("../controler/add");
const upload = require("../../../common/service/uploadFile");
const {
    addTransferSchema,
    displayFormSchema
} = require("../validation/transfer.validation");
const { ADD_TRANSFER } = require("../endPoints");
const router = require("express").Router();


router.post("/addTransfer/:createdBy", upload.single('form'), validation(addTransferSchema), isAuthorized(ADD_TRANSFER), addTransfer)

router.get("/displayForm/:filename", validation(displayFormSchema), displayForm);







module.exports = router;