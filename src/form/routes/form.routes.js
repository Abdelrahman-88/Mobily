const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const upload = require("../../../common/service/uploadFile");
const {
    addForm,
    displayForms
} = require("../controler/add");
const { getAllForms } = require("../controler/get");
const { updateForm } = require("../controler/update");
const {
    ADD_FORM,
    UPDATE_FROM,
    GET_ALL_FORMS
} = require("../endPoints");
const {
    addFormSchema,
    updateFormSchema,
    displayFormsSchema,
    getAllFormsSchema
} = require("../validation/form.validation");
const router = require("express").Router();


router.post("/addForm", upload.single('form'), validation(addFormSchema), isAuthorized(ADD_FORM), addForm);

router.put("/updateForm/:updatedBy/:formId", upload.single('form'), validation(updateFormSchema), isAuthorized(UPDATE_FROM), updateForm)

router.get("/displayForms/:filename", validation(displayFormsSchema), displayForms);

router.get("/getAllForms", validation(getAllFormsSchema), isAuthorized(GET_ALL_FORMS), getAllForms)


module.exports = router;