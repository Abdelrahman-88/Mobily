const Joi = require('joi');



module.exports = {
    addAdminSchema: {
        body: Joi.object().required().keys({
            name: Joi.string().required(),
            position: Joi.string().required(),
            email: Joi.string().required().email(),
            role: Joi.string().valid("admin", "sales", "operator", "techS", "callC"),
            password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@_$&]{8,}$/)).required(),
            cPassword: Joi.ref('password')
        })
    },
    adminLogInSchema: {
        body: Joi.object().required().keys({
            employeeId: Joi.number().required(),
            password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@_$&]{8,}$/)).required()
        })
    },
    adminLogOutSchema: {
        params: Joi.object().required().keys({
            id: Joi.string().required().min(24).max(24)
        })
    }
}