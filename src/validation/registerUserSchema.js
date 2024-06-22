import Joi from 'joi';

export const registerUserSchema = Joi.object({
    name: Joi.string().required().min(3).max(20).message({
        'string.base': 'UserName must be a string',
        'string.min': 'UserName must be at least {#limit} characters long',
        'string.max': 'UserName must be at most {#limit} characters long',
        'any.required': 'UserName is required',
    }),
    email: Joi.string().required().email().min(3).max(30).message({
        'string.base': 'Email must be a string',
        'string.min': 'Email must be at least {#limit} characters long',
        'string.max': 'Email must be at most {#limit} characters long',
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required(),
    //     message({
    //     'string.base': 'Password must be a string',
    //     'any.required': 'Password is required',
    // }),
});






