const { addDocument, getDocument, displayDocument, getAllDocuments, getUserDocuments } = require("../controler/add&get");
const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const upload = require("../../../common/service/uploadFile")
const {
    addDocumentSchema,
    getDocumentSchema,
    displayDocumentSchema,
    getAllDocumentsSchema,
    validateDocumentSchema,
    getUserDocumentsSchema,
    getSeenDocumentsSchema,
    updateSeenDocumentsSchema,
    removeOrderActionSchema
} = require("../validation/document.validation");
const {
    UPLOAD_FILE,
    GET_ALL_DOCUMENT,
    GET_DOCUMENT,
    VALIDATE_DOCUMENT,
    ACTIVATE_SERVICE,
    GET_USER_DOCUMENTS,
    GET_SEEN_DOCUMENTS,
    UPDATE_SEEN_DOCUMENTS,
    REMOVE_ORDER_ACTION
} = require("../endPoints");
const {
    validateDocument,
    activateService,
    removeOrderAction
} = require("../controler/validate");
const { getSeenDocuments, updateSeenDocuments } = require("../controler/seen");

const router = require("express").Router();


router.post("/addDocument/:createdBy", upload.fields([
    { name: 'authorization', maxCount: 1 },
    { name: 'commercialR', maxCount: 1 },
    { name: 'valueC', maxCount: 1 },
    { name: 'iD', maxCount: 1 },
    { name: 'insuranceC', maxCount: 1 },
]), validation(addDocumentSchema), isAuthorized(UPLOAD_FILE), addDocument)

router.get("/getDocument/:documentId", validation(getDocumentSchema), isAuthorized(GET_DOCUMENT), getDocument);

router.get("/displayDocument/:filename", validation(displayDocumentSchema), displayDocument);

router.get("/getAllDocuments", validation(getAllDocumentsSchema), isAuthorized(GET_ALL_DOCUMENT), getAllDocuments);

router.put("/validateDocument/:documentId", validation(validateDocumentSchema), isAuthorized(VALIDATE_DOCUMENT), validateDocument);

router.get("/getUserDocuments/:createdBy", validation(getUserDocumentsSchema), isAuthorized(GET_USER_DOCUMENTS), getUserDocuments);

router.get("/getSeenDocuments/:createdBy", validation(getSeenDocumentsSchema), isAuthorized(GET_SEEN_DOCUMENTS), getSeenDocuments);

router.patch("/updateSeenDocuments/:createdBy", validation(updateSeenDocumentsSchema), isAuthorized(UPDATE_SEEN_DOCUMENTS), updateSeenDocuments)

router.patch("/removeOrderAction/:documentId", validation(removeOrderActionSchema), isAuthorized(REMOVE_ORDER_ACTION), removeOrderAction)


module.exports = router;