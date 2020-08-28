const Joi = require('@hapi/joi');

const registerValidation = (data) => {
const schema = Joi.object({
    userId: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    profilePicName: Joi.string().max(255)
});


return schema.validate(data);

};

const loginValidation = (user) => {
    const loginSchema = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required()
    });
    
    return loginSchema.validate(user);
    
    };

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;



