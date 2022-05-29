const {
    addService,
    getAllServices,
    updateService,
    getServiceById,
    getAllServicesAdmin
} = require("../controler/service.controler");
const isAuthorized = require("../../../common/middelWare/isAuthorized");
const validation = require("../../../common/middelWare/validation");
const {
    addServiceSchema,
    getAllServicesSchems,
    updateServiceSchema,
    getServiceByIdSchema,
    getAllServicesAdminSchems
} = require("../validation/service.validation");
const {
    ADD_SERVICE,
    UPDATE_SERVICE,
    GET_ALL_SERVICES_ADMIN
} = require("../endPoints");
const router = require("express").Router();


router.post("/addService/:createdBy", validation(addServiceSchema), isAuthorized(ADD_SERVICE), addService);

router.get("/getAllServices", validation(getAllServicesSchems), getAllServices);

router.get("/getAllServicesAdmin", validation(getAllServicesAdminSchems), isAuthorized(GET_ALL_SERVICES_ADMIN), getAllServicesAdmin);

router.put("/updateService/:serviceId", validation(updateServiceSchema), isAuthorized(UPDATE_SERVICE), updateService);

router.get("/getServiceById/:serviceId", validation(getServiceByIdSchema), getServiceById);




module.exports = router;