import Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  HOST: Joi.string().uri().required(),
  ALLOWED_ORIGINS: Joi.string().default(''),

  QSTASH_TOKEN: Joi.string().required(),
  QSTASH_CURRENT_SIGNING_KEY: Joi.string().required(),
  QSTASH_NEXT_SIGNING_KEY: Joi.string().required(),

  MAILER_HOST: Joi.string().required(),
  MAILER_PORT: Joi.number().required(),
  MAILER_AUTH_USER: Joi.string().required(),
  MAILER_AUTH_PASS: Joi.string().required(),

  DATABASE_URL: Joi.string().optional(),
});
