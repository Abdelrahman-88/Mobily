const { StatusCodes } = require("http-status-codes");
const pageService = require("../../../common/service/page");
const Admin = require("../../admins/model/admin.model");
const Service = require("../model/service.model");
const searchServies = require("../../../common/service/search")

const addService = async(req, res) => {
    try {
        const { createdBy } = req.params
        const { name, price, desc, status, category } = req.body
        if (req.user._id = createdBy) {
            const newService = new Service({ createdBy, name, price, desc, status, category })
            const data = await newService.save()
            res.status(StatusCodes.CREATED).json({ message: "Service added successfully", data });
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "UNAUTHORIZED" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to add service" });
    }
}

const getAllServices = async(req, res) => {
    try {
        let { page, size, search, category } = req.query
        const { skip, limit, currentPage } = pageService(page, size)
        const servies = await searchServies(search, { "status": "valid", category }, limit, skip, Service, ["name"], "", "")
        if (servies.data.length) {
            res.status(StatusCodes.OK).json({ message: "done", currentPage, limit, totalPages: servies.totalPages, total: servies.total, data: servies.data });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "No services found" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get all services" });
    }
}

const updateService = async(req, res) => {
    try {
        const { serviceId } = req.params
        const { name, price, desc, status, category } = req.body
        const service = await Service.findOneAndUpdate({ _id: serviceId }, { name, price, desc, status, category })
        if (service) {
            res.status(StatusCodes.OK).json({ message: "Service updated successfully" });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid service" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to update service" });
    }
}

const getServiceById = async(req, res) => {
    try {
        const { serviceId } = req.params
        const service = await Service.findOne({ _id: serviceId })
        if (service) {
            res.status(StatusCodes.OK).json({ message: "Done", data: service });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid service" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Faild to get service" });
    }
}



module.exports = {
    addService,
    getAllServices,
    updateService,
    getServiceById
}