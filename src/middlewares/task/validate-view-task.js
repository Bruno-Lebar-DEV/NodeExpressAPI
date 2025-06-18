import Joi from 'joi';

const viewTaskSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
}).options({ stripUnknown: true });

const validateViewTask = (req, res, next) => {
  const { error, value } = viewTaskSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ message: 'ID de task inválido.' });
  }
  req.params = value;
  next();
};

export default validateViewTask;
