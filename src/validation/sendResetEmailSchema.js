import Joi from 'joi';

export const sendResetEmailSchema = Joi.object({
   email: Joi.string().required().email().min(3).max(30).message({
        'string.base': 'Email must be a string',
        'string.min': 'Email must be at least {#limit} characters long',
        'string.max': 'Email must be at most {#limit} characters long',
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required',
    }),
});

