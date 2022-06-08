const Joi = require('joi');

module.exports = {
    addTransferSchema: {
        params: Joi.object().required().keys({
            createdBy: Joi.string().required().min(24).max(24)
        })
    },
    displayFormSchema: {
        params: Joi.object().required().keys({
            filename: Joi.string().required()
        })
    }
}