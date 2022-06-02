const Joi = require('joi');



module.exports = {
    validateFollowUpSchema: {
        params: Joi.object().required().keys({
            followUpId: Joi.string().required().min(24).max(24)
        }),
        body: Joi.object().required().keys({
            status: Joi.string().valid("closed", "pending").required(),
            comment: Joi.string().required(),
            answered: Joi.boolean().required()
        })
    },
    removeFollowUpActionSchema: {
        params: Joi.object().required().keys({
            followUpId: Joi.string().required().min(24).max(24)
        })
    },
    getFollowUpByIdSchema: {
        params: Joi.object().required().keys({
            followUpId: Joi.string().required().min(24).max(24)
        })
    },
    getAllFollowUpSchema: {
        query: Joi.object().required().keys({
            page: Joi.string().allow(''),
            size: Joi.string().allow(''),
            status: Joi.string().valid("open", "closed", "pending", "notClosed").allow(''),
            answered: Joi.boolean().allow(''),
            action: Joi.boolean().allow(''),
            actionBy: Joi.string().min(24).max(24).allow('')
        })
    }
}