import * as Joi from 'joi';

export const registerValidationSchema = Joi.object({
  full_name: Joi.string().allow('').optional(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
});
