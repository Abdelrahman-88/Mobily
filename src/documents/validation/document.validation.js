const Joi = require('joi');

module.exports = {
    addDocumentSchema: {
        params: Joi.object().required().keys({
            createdBy: Joi.string().required().min(24).max(24)
        }),
        body: Joi.object().required().keys({
            phone: Joi.string().required(),
            contactEmail: Joi.string().email().required(),
            commercialRNumber: Joi.string().required(),
            idNumber: Joi.string().required()
        })
    },
    updateDocumentSchema: {
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24),
            documentId: Joi.string().required().min(24).max(24)
        }),
        body: Joi.object().required().keys({
            phone: Joi.string().required(),
            contactEmail: Joi.string().email().required(),
            commercialRNumber: Joi.string().required(),
            idNumber: Joi.string().required()
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
            action: Joi.boolean().allow(''),
            actionBy: Joi.string().min(24).max(24).allow('')
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
            contactEmail: Joi.string().email().required(),
            commercialRNumber: Joi.string().required(),
            idNumber: Joi.string().required()
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
    },
    editDocumentSchema: {
        params: Joi.object().required().keys({
            documentId: Joi.string().required().min(24).max(24)
        }),
        body: Joi.object().required().keys({
            expiryDate: Joi.date().required(),
            valid: Joi.string().valid('valid', 'invalid').required(),
            status: Joi.string().valid('closed', 'pending').required(),
            comment: Joi.string().required(),
            phone: Joi.string().required(),
            contactEmail: Joi.string().email().required(),
            commercialRNumber: Joi.string().required(),
            idNumber: Joi.string().required()
        })
    }
}