// middlewares/user/validate-roles-user.js
import Joi from 'joi';

const roleSchema = Joi.object({
  role: Joi.string().valid('admin', 'editor', 'visual').required(),
}).options({ stripUnknown: true });

const validateRolesUser = (req, res, next) => {
  const { error, value } = roleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Papel de usuário inválido.' });
  }
  req.body = { ...req.body, ...value };
  next();
};

export default validateRolesUser;
