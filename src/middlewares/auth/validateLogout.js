// src/middlewares/auth/validateLogout.js
import Joi from 'joi';

const schema = Joi.object({}); // Exemplo de uso de Joi, mesmo que vazio

const validateLogout = (req, res, next) => {
  // Validação dummy só para usar Joi
  const { error } = schema.validate(req.body || {});
  if (error) {
    return res.status(400).json({ message: 'Não é permitido enviar payload no logout' });
  }
  if (req.body && Object.keys(req.body).length > 0) {
    return res.status(400).json({ message: 'Logout não deve receber payload.' });
  }
  next();
};

export default validateLogout;
