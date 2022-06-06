const {
    addDocument,
    getDocument,
    displayDocument,
    getAllDocuments,
    getUserDocuments,
    checkDocument
} = require("../controler/add&get");
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
    removeDocumentActionSchema,
    checkDocumentSchema,
    updateDocumentSchema,
    editDocumentSchema
} = require("../validation/document.validation");
const {
    UPLOAD_FILE,
    GET_ALL_DOCUMENT,
    GET_DOCUMENT,
    VALIDATE_DOCUMENT,
    GET_USER_DOCUMENTS,
    GET_SEEN_DOCUMENTS,
    UPDATE_SEEN_DOCUMENTS,
    REMOVE_DOCUMENT_ACTION,
    CHECK_DOCUMENT,
    UPDATE_FILE,
    EDIT_DOCUMENT
} = require("../endPoints");
const {
    validateDocument,
    activateService,
    removeDocumentAction
} = require("../controler/validate");
const { getSeenDocuments, updateSeenDocuments } = require("../controler/seen");
const { updateDocument } = require("../controler/update");
const { editDocument } = require("../controler/edit");

const router = require("express").Router();


router.post("/addDocument/:createdBy", upload.fields([
    { name: 'authorization', maxCount: 1 },
    { name: 'commercialR', maxCount: 1 },
    { name: 'valueC', maxCount: 1 },
    { name: 'iD', maxCount: 1 },
    { name: 'insuranceC', maxCount: 1 },
]), validation(addDocumentSchema), isAuthorized(UPLOAD_FILE), addDocument);

router.post("/updateDocument/:id/:documentId", upload.fields([
    { name: 'authorization', maxCount: 1 },
    { name: 'commercialR', maxCount: 1 },
    { name: 'valueC', maxCount: 1 },
    { name: 'iD', maxCount: 1 },
    { name: 'insuranceC', maxCount: 1 },
]), validation(updateDocumentSchema), isAuthorized(UPDATE_FILE), updateDocument);

router.get("/getDocument/:documentId", validation(getDocumentSchema), isAuthorized(GET_DOCUMENT), getDocument);

router.get("/displayDocument/:filename", validation(displayDocumentSchema), displayDocument);

router.get("/getAllDocuments", validation(getAllDocumentsSchema), isAuthorized(GET_ALL_DOCUMENT), getAllDocuments);

router.put("/validateDocument/:documentId", validation(validateDocumentSchema), isAuthorized(VALIDATE_DOCUMENT), validateDocument);

router.get("/getUserDocuments/:createdBy", validation(getUserDocumentsSchema), isAuthorized(GET_USER_DOCUMENTS), getUserDocuments);

router.get("/getSeenDocuments/:createdBy", validation(getSeenDocumentsSchema), isAuthorized(GET_SEEN_DOCUMENTS), getSeenDocuments);

router.patch("/updateSeenDocuments/:createdBy", validation(updateSeenDocumentsSchema), isAuthorized(UPDATE_SEEN_DOCUMENTS), updateSeenDocuments)

router.patch("/removeDocumentAction/:documentId", validation(removeDocumentActionSchema), isAuthorized(REMOVE_DOCUMENT_ACTION), removeDocumentAction)

router.get("/checkDocument/:createdBy", validation(checkDocumentSchema), isAuthorized(CHECK_DOCUMENT), checkDocument);

router.put("/editDocument/:documentId", validation(editDocumentSchema), isAuthorized(EDIT_DOCUMENT), editDocument)

module.exports = router;