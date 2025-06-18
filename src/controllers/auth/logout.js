// controllers/auth/logout.js
import createLogger from '../../services/logger.js';

const logger = createLogger('auth');

/**
 * Logout controller: para JWT stateless, apenas orienta o client a descartar o token.
 * Opcionalmente, pode-se implementar blacklist/token revocation.
 */
const logout = async (req, res) => {
  // Se usar blacklist, adicionar o token à blacklist aqui
  logger.info('Logout realizado', { user: req.user?.userId });
  res
    .status(200)
    .json({ message: 'Logout realizado com sucesso. Faça o descarte do token no client.' });
};

export default logout;
