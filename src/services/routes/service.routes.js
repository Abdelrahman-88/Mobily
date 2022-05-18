const {
    addService,
    getAllServices,
    updateService,
    getServiceById
} = require("../controler/service.controler");
const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const {
    addServiceSchema,
    getAllServicesSchems,
    updateServiceSchema,
    getServiceByIdSchema
} = require("../validation/service.validation");
const {
    ADD_SERVICE,
    UPDATE_SERVICE
} = require("../endPoints");
const router = require("express").Router();


router.post("/addService/:createdBy", validation(addServiceSchema), isAuthorized(ADD_SERVICE), addService);

router.get("/getAllServices", validation(getAllServicesSchems), getAllServices);

router.put("/updateService/:serviceId", validation(updateServiceSchema), isAuthorized(UPDATE_SERVICE), updateService);

router.get("/getServiceById/:serviceId", validation(getServiceByIdSchema), getServiceById);




module.exports = router;