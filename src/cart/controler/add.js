const { StatusCodes } = require("http-status-codes");
const Service = require("../../services/model/service.model");

const addCart = async(req, res) => {
    try {
        const { createdBy } = req.params;
        let { services } = req.body;
        services = services.map((service) => {
            const valid = await Service.findOne({ _id: service.serviceId });
            if (valid) {

            } else {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid service" });
            }
        })

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to add cart" });
    }
}