const { addDocument, getDocument, displayDocument, getAllDocuments } = require("../controler/add&get");
const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const upload = require("../../../common/service/uploadFile")
const {
    addDocumentSchema,
    getDocumentSchema,
    displayDocumentSchema,
    getAllDocumentsSchema,
    validateDocumentSchema,
    activateServiceSchema
} = require("../validation/document.validation");
const {
    UPLOAD_FILE,
    GET_ALL_DOCUMENT,
    GET_DOCUMENT,
    VALIDATE_DOCUMENT,
    ACTIVATE_SERVICE
} = require("../endPoints");
const {
    validateDocument,
    activateService
} = require("../controler/validate");

const router = require("express").Router();


router.post("/addDocument/:createdBy", upload.fields([{ name: 'authorization', maxCount: 1 }, { name: 'commercialR', maxCount: 1 }]), validation(addDocumentSchema), isAuthorized(UPLOAD_FILE), addDocument)

router.get("/getDocument/:documentId", validation(getDocumentSchema), isAuthorized(GET_DOCUMENT), getDocument);

router.get("/displayDocument/:filename", validation(displayDocumentSchema), displayDocument);

router.get("/getAllDocuments", validation(getAllDocumentsSchema), isAuthorized(GET_ALL_DOCUMENT), getAllDocuments);

router.put("/validateDocument/:documentId", validation(validateDocumentSchema), isAuthorized(VALIDATE_DOCUMENT), validateDocument);






module.exports = router;