import { body, validationResult } from 'express-validator';
import createLogger from '../../services/logger.js';
const logger = createLogger('security');

// Regex para senha forte:
// - Pelo menos 1 letra minúscula
// - Pelo menos 1 letra maiúscula
// - Pelo menos 1 número
// - Pelo menos 1 caractere especial
// - Mínimo de 6 caracteres
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email').trim().normalizeEmail().isEmail().withMessage('Informe um e-mail válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('A senha deve ter pelo menos 6 caracteres')
    .matches(strongPasswordRegex)
    .withMessage(
      'A senha deve conter pelo menos 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'
    ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validação de registro falhou', { errors: errors.array(), ip: req.ip });
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  },
];

export default validateRegister;
