import Joi from 'joi';

export const createContactSchema = Joi.object({
    name: Joi.string().required().min(3).max(30),
    phoneNumber: Joi.number().integer().required().positive(),
    email: Joi.string().email(),
    isFavourite: Joi.boolean().default(false),
    contactType: Joi.string().required().valid('work', 'home', 'personal').default('personal'),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    phoneNumber: Joi.number().integer().positive(),
    email: Joi.string().email(),
    isFavourite: Joi.boolean().default(false),
    contactType: Joi.string().valid('work', 'home', 'personal').default('personal'),
});
