const Joi = require('joi');


module.exports = {
    addPriceOfferSchema: {
        params: Joi.object().required().keys({
            createdBy: Joi.string().required().min(24).max(24)
        }),
        body: Joi.array().required().items({
            serviceId: Joi.string().required().min(24).max(24),
            quantity: Joi.number().required().greater(0)
        })
    },
    displayPdfSchema: {
        params: Joi.object().required().keys({
            filename: Joi.string().required()
        })
    }
}