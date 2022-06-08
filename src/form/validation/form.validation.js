const Joi = require('joi');

module.exports = {
    addFormSchema: {
        body: Joi.object().required().keys({
            type: Joi.string().valid("transfer").required()
        })
    },
    updateFormSchema: {
        params: Joi.object().required().keys({
            updatedBy: Joi.string().required().min(24).max(24),
            formId: Joi.string().required().min(24).max(24)
        })
    },
    displayFormsSchema: {
        params: Joi.object().required().keys({
            filename: Joi.string().required()
        })
    },
    getAllFormsSchema: {
        query: Joi.object().required().keys({
            page: Joi.string().allow(''),
            size: Joi.string().allow(''),
            type: Joi.string().valid("transfer").allow('')
        })
    }
}