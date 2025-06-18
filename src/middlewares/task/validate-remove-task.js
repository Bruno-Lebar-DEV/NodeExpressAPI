import Joi from 'joi';

const removeTaskSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
}).options({ stripUnknown: true });

const validateRemoveTask = (req, res, next) => {
  const { error, value } = removeTaskSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ message: 'ID de task inválido.' });
  }
  req.params = value;
  next();
};

export default validateRemoveTask;
