import Joi from 'joi';

export const verifyGoogleOAuthSchema = Joi.object({
   code: Joi.string().required(),
});
