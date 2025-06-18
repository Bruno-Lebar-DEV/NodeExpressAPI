import { body, validationResult } from 'express-validator';
import createLogger from '../../services/logger.js';
const logger = createLogger('security');

const validateLogin = [
  body('email').trim().normalizeEmail().isEmail().withMessage('Informe um e-mail válido'),
  body('password').exists({ checkFalsy: true }).withMessage('Senha é obrigatória'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validação de login falhou', { errors: errors.array(), ip: req.ip });
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  },
];

export default validateLogin;
