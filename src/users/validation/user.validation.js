const Joi = require('joi');



module.exports = {
    registerSchema: {
        body: Joi.object().required().keys({
            name: Joi.string().required(),
            companyName: Joi.string().required(),
            position: Joi.string().required(),
            email: Joi.string().required().email(),
            password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@_$&]{8,}$/)).required(),
            cPassword: Joi.ref('password')
        })
    },
    verifyEmailSchema: {
        body: Joi.object().required().keys({
            verificationKey: Joi.string().required()
        }),
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    },
    resendVerificationKeySchema: {
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    },
    logInSchema: {
        body: Joi.object().required().keys({
            email: Joi.string().required().email(),
            password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@_$&]{8,}$/)).required()
        })
    },
    updateProfileSchema: {
        body: Joi.object().required().keys({
            email: Joi.string().required().email(),
            name: Joi.string().required(),
            companyName: Joi.string().required(),
            position: Joi.string().required()
        }),
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    },
    updatePasswordSchema: {
        body: Joi.object().required().keys({
            oldPassword: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@_$&]{8,}$/)).required(),
            newPassword: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@_$&]{8,}$/)).required(),
            cNewPassword: Joi.ref('newPassword')
        }),
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    },
    resetKeySchema: {
        body: Joi.object().required().keys({
            email: Joi.string().required().email()
        })
    },
    resetPasswordSchema: {
        body: Joi.object().required().keys({
            verificationKey: Joi.string().required()
        })
    },
    changePasswordSchema: {
        body: Joi.object().required().keys({
            newPassword: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@_$&]{8,}$/)).required(),
            cNewPassword: Joi.ref('newPassword')
        }),
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    },
    logOutSchema: {
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    },
    userExpireDocmentSchema: {
        body: Joi.object().required().keys({
            from: Joi.date().required(),
            to: Joi.date().required()
        })
    }
}