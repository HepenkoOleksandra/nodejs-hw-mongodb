import Joi from "joi";

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).message({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least {#limit} characters long',
        'string.max': 'Name must be at most {#limit} characters long',
    }),
    phoneNumber: Joi.number().integer().positive().message({
        'number.base': 'PhoneNumber must be a number',
        'number.integer': 'PhoneNumber must be an integer',
        'number.positive': 'PhoneNumber must be a positive number',
    }),
    email: Joi.string().email().message({
        'string.base': 'Email must be a string',
        'string.email': 'Please enter a valid email address',
    }),
    isFavourite: Joi.boolean().default(false).message({
        'boolean.base': 'isFavourite must be a boolean',
    }),
    contactType: Joi.string().valid('work', 'home', 'personal').default('personal').message({
        'string.base': 'ContactType must be a string',
        'string.valid': 'Invalid contactType. Allowed values: work, home, personal',
    }),
});
