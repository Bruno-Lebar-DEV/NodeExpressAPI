// middlewares/user/validate-remove-user.js
import Joi from 'joi';

const removeUserSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
}).options({ stripUnknown: true });

const validateRemoveUser = (req, res, next) => {
  const { error, value } = removeUserSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ message: 'ID de usuário inválido.' });
  }
  req.params = value;
  next();
};

export default validateRemoveUser;
