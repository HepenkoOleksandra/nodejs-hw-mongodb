import Joi from 'joi';

export const createContactSchema = Joi.object({
    name: Joi.string().required().min(3).max(20).message({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least {#limit} characters long',
        'string.max': 'Name must be at most {#limit} characters long',
        'any.required': 'Name is required',
    }),
    phoneNumber: Joi.string().required().min(3).max(20).message({
        'string.base': 'PhoneNumber must be a string',
        'string.min': 'PhoneNumber must be at least {#limit} characters long',
        'string.max': 'PhoneNumber must be at most {#limit} characters long',
        'any.required': 'PhoneNumber is required',
    }),
    email: Joi.string().email().min(3).max(20).message({
        'string.base': 'Email must be a string',
        'string.min': 'Email must be at least {#limit} characters long',
        'string.max': 'Email must be at most {#limit} characters long',
        'string.email': 'Please enter a valid email address',
    }),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid('work', 'home', 'personal').required(),
    userId: Joi.string(),
});

