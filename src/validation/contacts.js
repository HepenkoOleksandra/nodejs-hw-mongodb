//  name: { type: String, required: true, },
//     phoneNumber: { type: String, required: true, },
//     email: {type: String, required: false, },
//     isFavourite: { type: Boolean, default: false, },
//     contactType: {type: String, required: true, default: 'personal', enum: ['work', 'home', 'personal'], }
import Joi from 'joi';

export const createContactSchema = Joi.object({
    
});

