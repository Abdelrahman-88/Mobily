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
    }
}