const Joi = require('joi');


module.exports = {
    addCartSchema: {
        params: Joi.object().required().keys({
            createdBy: Joi.string().required().min(24).max(24)
        }),
        body: Joi.array().required().items({
            serviceId: Joi.string().required().min(24).max(24),
            quantity: Joi.number().required()
        })
    },
    sendVerificationKeySchema: {
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    },
    verifyCartSchema: {
        body: Joi.object().required().keys({
            verificationKey: Joi.string().required()
        }),
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    }
}