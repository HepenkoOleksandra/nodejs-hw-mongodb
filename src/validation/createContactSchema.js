import Joi from 'joi';

export const createContactSchema = Joi.object({
    name: Joi.string().required().min(3).max(20).message({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least {#limit} characters long',
        'string.max': 'Name must be at most {#limit} characters long',
        'any.required': 'Username is required',
    }),
    phoneNumber: Joi.number().integer().required().positive().message({
        'number.base': 'PhoneNumber must be a number',
        'number.integer': 'PhoneNumber must be an integer',
        'number.positive': 'PhoneNumber must be a positive number',
        'any.required': 'PhoneNumber is required',
    }),
    email: Joi.string().email().message({
        'string.base': 'Email must be a string',
        'string.email': 'Please enter a valid email address',
    }),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().required().valid('work', 'home', 'personal'),
        // 'string.base': 'ContactType must be a string',
        // 'string.valid': 'Invalid contactType. Allowed values: work, home, personal',
        // 'any.required': 'ContactType is required',
});

