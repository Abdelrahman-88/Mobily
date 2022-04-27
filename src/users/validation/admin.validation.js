const Joi = require('joi');



module.exports = {
    addAdminSchema: {
        body: Joi.object().required().keys({
            email: Joi.string().required().email(),
            password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@_$&]{8,}$/)).required(),
            cPassword: Joi.ref('password')
        })
    }
}