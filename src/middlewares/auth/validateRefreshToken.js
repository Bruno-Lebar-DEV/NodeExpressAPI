// src/middlewares/auth/validateRefreshToken.js
import Joi from 'joi';

const schema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token é obrigatório.',
    'string.base': 'Refresh token deve ser uma string.',
  }),
});

const validateRefreshToken = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export default validateRefreshToken;
