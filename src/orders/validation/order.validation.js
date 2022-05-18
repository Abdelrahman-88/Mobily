const Joi = require('joi');

module.exports = {
    addOrderSchema: {
        params: Joi.object().required().keys({
            createdBy: Joi.string().required().min(24).max(24),
            serviceId: Joi.string().required().min(24).max(24)

        })
    },
    getOrderByIdSchema: {
        params: Joi.object().required().keys({
            orderId: Joi.string().required().min(24).max(24)

        })
    },
    getAllOrdersSchema: {
        query: Joi.object().required().keys({
            page: Joi.string().allow(''),
            size: Joi.string().allow(''),
            status: Joi.string().valid("open", "closed", "pending").allow(''),
            activated: Joi.boolean().allow(''),
            action: Joi.boolean().allow('')
        })
    },
    validateOrderSchema: {
        params: Joi.object().required().keys({
            orderId: Joi.string().required().min(24).max(24)
        }),
        body: Joi.object().required().keys({
            activated: Joi.boolean().required(),
            status: Joi.string().valid("closed", "pending").required(),
            comment: Joi.string().required(),
            ban: Joi.boolean()
        })
    },
    getUserOrdersSchema: {
        params: Joi.object().required().keys({
            createdBy: Joi.string().required().min(24).max(24)
        }),
        query: Joi.object().required().keys({
            page: Joi.string().allow(''),
            size: Joi.string().allow(''),
            status: Joi.string().valid("open", "closed", "pending").allow(''),
            activated: Joi.boolean().allow('')
        })
    },
    getSeenOrdersSchema: {
        params: Joi.object().required().keys({
            createdBy: Joi.string().required().min(24).max(24)
        }),
        query: Joi.object().required().keys({
            page: Joi.string().allow(''),
            size: Joi.string().allow('')
        })
    },
    updateSeenOrdersSchema: {
        params: Joi.object().required().keys({
            createdBy: Joi.string().required().min(24).max(24)
        })
    },
    removeOrderActionSchema: {
        params: Joi.object().required().keys({
            orderId: Joi.string().required().min(24).max(24)
        })
    }
}