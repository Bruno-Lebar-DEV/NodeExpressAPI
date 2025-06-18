// middlewares/user/validate-list-user.js
import Joi from 'joi';

const listUserSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  role: Joi.string().valid('admin', 'editor', 'visual').lowercase(),
}).options({ stripUnknown: true });

const validateListUser = (req, res, next) => {
  const { error, value } = listUserSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // Corrige: copia propriedades validadas para req.query sem sobrescrever o objeto
  Object.keys(req.query).forEach((key) => {
    delete req.query[key];
  });
  Object.assign(req.query, value);
  next();
};

export default validateListUser;
