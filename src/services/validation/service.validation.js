const Joi = require('joi');

module.exports = {
    addServiceSchema: {
        params: Joi.object().required().keys({
            createdBy: Joi.string().required().min(24).max(24)
        }),
        body: Joi.object().required().keys({
            name: Joi.string().required(),
            price: Joi.number().required(),
            desc: Joi.string().required(),
            status: Joi.string().valid("valid", "expired", "pending").required(),
            category: Joi.string().valid("category1", "category2", "category3").required()
        })
    },
    getAllServicesSchems: {
        query: Joi.object().required().keys({
            page: Joi.string().allow(''),
            size: Joi.string().allow(''),
            search: Joi.string().allow(''),
            category: Joi.string().valid("category1", "category2", "category3").allow('')
        })
    },
    updateServiceSchema: {
        params: Joi.object().required().keys({
            serviceId: Joi.string().required().min(24).max(24)
        }),
        body: Joi.object().required().keys({
            name: Joi.string().required(),
            price: Joi.number().required(),
            desc: Joi.string().required(),
            status: Joi.string().valid("valid", "expired", "pending").required(),
            category: Joi.string().valid("category1", "category2", "category3").required()
        })
    },
    getServiceByIdSchema: {
        params: Joi.object().required().keys({
            serviceId: Joi.string().required().min(24).max(24)
        })
    }
}