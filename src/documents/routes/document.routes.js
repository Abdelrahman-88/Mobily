const { addDocument, getDocument, displayDocument, getAllDocuments } = require("../controler/add&get");
const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const upload = require("../../../common/service/uploadFile")
const {
    addDocumentSchema,
    getDocumentSchema,
    displayDocumentSchema,
    getAllDocumentsSchema,
    validateDocumentSchema
} = require("../validation/document.validation");
const {
    UPLOAD_FILE,
    GET_ALL_DOCUMENT,
    GET_DOCUMENT,
    VALIDATE_DOCUMENT
} = require("../endPoints");
const { validateDocument } = require("../controler/validate");

const router = require("express").Router();


router.post("/addDocument/:createdBy", upload.array("documents", 3), validation(addDocumentSchema), isAuthorized(UPLOAD_FILE), addDocument)

router.get("/getDocument/:documentId", validation(getDocumentSchema), isAuthorized(GET_DOCUMENT), getDocument);

router.get("/displayDocument/:filename", validation(displayDocumentSchema), displayDocument);

router.get("/getAllDocuments", validation(getAllDocumentsSchema), isAuthorized(GET_ALL_DOCUMENT), getAllDocuments);

router.put("/validateDocument/:documentId", validation(validateDocumentSchema), isAuthorized(VALIDATE_DOCUMENT), validateDocument);





module.exports = router;