// src/controllers/auth/refreshToken.js
import jwt from 'jsonwebtoken';
import createLogger from '../../services/logger.js';

const logger = createLogger('auth');

/**
 * Controller para refresh token.
 * Espera receber um refreshToken válido no body.
 * Gera novo accessToken se válido.
 */
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token é obrigatório.' });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    // Gera novo access token
    const accessToken = jwt.sign(
      {
        userId: decoded.userId,
        role: decoded.role,
        name: decoded.name,
        email: decoded.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    logger.info('Refresh token bem-sucedido', { userId: decoded.userId });
    res.json({ accessToken });
  } catch (err) {
    logger.warn('Refresh token inválido', { error: err });
    res.status(401).json({ message: 'Refresh token inválido ou expirado.' });
  }
};

export default refreshToken;
