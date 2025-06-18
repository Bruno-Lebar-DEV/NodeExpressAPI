// middlewares/user/validate-create-user.js
import Joi from 'joi';

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;

const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(100).trim().required(),
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().pattern(strongPasswordRegex).min(6).max(128).required().messages({
    'string.pattern.base':
      'A senha deve conter ao menos 1 minúscula, 1 maiúscula, 1 número, 1 caractere especial e mínimo de 6 caracteres.',
  }),
}).options({ stripUnknown: true });

const validateCreateUser = (req, res, next) => {
  const { error, value } = createUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  req.body = value;
  next();
};

export default validateCreateUser;
