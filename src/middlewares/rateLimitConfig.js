// middlewares/rateLimitConfig.js
// Middleware de configuração de rate limit centralizado

import rateLimit from 'express-rate-limit';
import createLogger from '../services/logger.js';

const logger = createLogger('security');

const windowMs = process.env.RATE_LIMIT_WINDOW_MS
  ? parseInt(process.env.RATE_LIMIT_WINDOW_MS)
  : process.env.NODE_ENV === 'test'
    ? 1000
    : 15 * 60 * 1000; // 1s para teste, 15min padrão
const max = process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : 50; //  50 padrão

const limiter = rateLimit({
  windowMs,
  max,
  statusCode: 429,
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',
  handler: (req, res, next, options) => {
    logger.warn('Rate limit atingido', {
      ip: req.ip,
      path: req.originalUrl,
      method: req.method,
      userId: req.user?.userId || null,
    });
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[RATE LIMIT] IP bloqueado: ${req.ip}`);
    }
    res.status(options.statusCode).json({ message: options.message });
  },
});

export default limiter;
