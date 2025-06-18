// middlewares/user/validate-view-user.js
import Joi from 'joi';

const viewUserSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
}).options({ stripUnknown: true });

const validateViewUser = (req, res, next) => {
  const { error, value } = viewUserSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ message: 'ID de usuário inválido.' });
  }
  req.params = value;
  next();
};

export default validateViewUser;
