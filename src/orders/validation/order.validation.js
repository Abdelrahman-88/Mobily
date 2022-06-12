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
            type: Joi.string().valid("cart", "priceOffer", "transfer").allow(''),
            activated: Joi.boolean().allow(''),
            action: Joi.boolean().allow(''),
            actionBy: Joi.string().min(24).max(24).allow('')
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
            ban: Joi.boolean(),
            services: Joi.array().items({
                serviceId: Joi.string().required().min(24).max(24),
                quantity: Joi.number().required().greater(0),
                price: Joi.number().required().greater(0)
            })
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
            type: Joi.string().valid("cart", "priceOffer", "transfer").allow(''),
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
    },
    updateOrderSchema: {
        params: Joi.object().required().keys({
            orderId: Joi.string().required().min(24).max(24)
        }),
        body: Joi.object().required().keys({
            accept: Joi.boolean().required(),
            comment: Joi.string().allow(''),
        })
    }
}