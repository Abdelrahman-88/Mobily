const Joi = require('joi');

module.exports = {
    addDocumentSchema: {
        params: Joi.object().required().keys({
            createdBy: Joi.string().required().min(24).max(24)
        })
    },
    getDocumentSchema: {
        params: Joi.object().required().keys({
            documentId: Joi.string().required().min(24).max(24)
        })
    },
    displayDocumentSchema: {
        params: Joi.object().required().keys({
            filename: Joi.string().required()
        })
    },
    getAllDocumentsSchema: {
        query: Joi.object().required().keys({
            page: Joi.string().allow(''),
            size: Joi.string().allow(''),
            valid: Joi.string().valid('valid', 'invalid').allow(''),
            status: Joi.string().valid('open', 'closed', 'pending').allow(''),
            from: Joi.date().allow(''),
            to: Joi.date().allow(''),
            action: Joi.boolean().allow('')
        })
    },
    validateDocumentSchema: {
        params: Joi.object().required().keys({
            documentId: Joi.string().required().min(24).max(24)
        }),
        body: Joi.object().required().keys({
            expiryDate: Joi.date().required(),
            valid: Joi.string().valid('valid', 'invalid').required(),
            status: Joi.string().valid('closed', 'pending').required(),
            comment: Joi.string().required(),
            phone: Joi.string().required(),
            contactEmail: Joi.string().email().required()
        })
    },
    getUserDocumentsSchema: {
        params: Joi.object().required().keys({
            createdBy: Joi.string().required().min(24).max(24)
        }),
        query: Joi.object().required().keys({
            page: Joi.string().allow(''),
            size: Joi.string().allow(''),
            status: Joi.string().valid("open", "closed", "pending").allow(''),
            valid: Joi.string().valid("valid", "invalid").allow('')
        })
    },
    getSeenDocumentsSchema: {
        params: Joi.object().required().keys({
            createdBy: Joi.string().required().min(24).max(24)
        }),
        query: Joi.object().required().keys({
            page: Joi.string().allow(''),
            size: Joi.string().allow('')
        })
    },
    updateSeenDocumentsSchema: {
        params: Joi.object().required().keys({
            createdBy: Joi.string().required().min(24).max(24)
        })
    },
    removeDocumentActionSchema: {
        params: Joi.object().required().keys({
            documentId: Joi.string().required().min(24).max(24)
        })
    },
    checkDocumentSchema: {
        params: Joi.object().required().keys({
            createdBy: Joi.string().required().min(24).max(24)
        })
    }
}