import Joi from 'joi';

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(100).trim(),
  email: Joi.string().email().trim().lowercase(),
  password: Joi.string().pattern(strongPasswordRegex).min(6).max(128).messages({
    'string.pattern.base':
      'A senha deve conter ao menos 1 minúscula, 1 maiúscula, 1 número, 1 caractere especial e mínimo de 6 caracteres.',
  }),
}).options({ stripUnknown: true });

const validateUpdateUser = (req, res, next) => {
  if ('role' in req.body) {
    return res.status(403).json({ message: 'Alteração de perfil (role) não é permitida.' });
  }
  const { error, value } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  req.body = value;
  next();
};

export default validateUpdateUser;
