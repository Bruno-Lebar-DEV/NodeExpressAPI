import Joi from 'joi';

const listTaskSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  group: Joi.string().max(100).allow('').trim(),
}).options({ stripUnknown: true });

const validateListTask = (req, res, next) => {
  const { error, value } = listTaskSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  Object.assign(req.query, value); // Corrigido para não sobrescrever req.query
  next();
};

export default validateListTask;
