import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import createLogger from '../../services/logger.js';

dotenv.config();
const logger = createLogger('security');

/**
 * Middleware para verificar e validar o token JWT.
 * - Exige header Authorization no formato "Bearer <token>"
 * - Retorna 401 se o token estiver ausente, malformado, inválido ou expirado
 * - Adiciona os dados do usuário autenticado em req.user
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Token ausente ou malformado', { ip: req.ip });
    return res.status(401).json({ message: 'Token ausente ou malformado!' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) {
    logger.warn('Token não fornecido', { ip: req.ip });
    return res.status(401).json({ message: 'Token não fornecido!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      logger.warn('Token inválido (payload)', { ip: req.ip });
      return res.status(401).json({ message: 'Token inválido!' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Token expirado', { ip: req.ip });
      return res.status(401).json({ message: 'Token expirado!' });
    }
    logger.warn('Token inválido (catch)', { ip: req.ip, error });
    return res.status(401).json({ message: 'Token inválido!' });
  }
};

export default verifyToken;
