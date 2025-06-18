import Joi from 'joi';

const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100).trim().required().messages({
    'any.required': 'O título é obrigatório',
    'string.base': 'O título deve ser um texto',
    'string.empty': 'O título é obrigatório',
    'string.min': 'O título deve ter pelo menos 3 caracteres',
    'string.max': 'O título deve ter no máximo 100 caracteres',
  }),
  description: Joi.string().max(500).allow('').trim().messages({
    'string.max': 'A descrição deve ter no máximo 500 caracteres',
  }),
  group: Joi.string().max(100).allow('').trim().messages({
    'string.max': 'O grupo deve ter no máximo 100 caracteres',
  }),
  completed: Joi.boolean().messages({
    'boolean.base': 'O campo completed deve ser verdadeiro ou falso',
  }),
}).options({ stripUnknown: true });

const validateCreateTask = (req, res, next) => {
  const { error, value } = createTaskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  req.body = value;
  next();
};

export default validateCreateTask;
