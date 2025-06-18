import createLogger from '../../services/logger.js';
const logger = createLogger('security');

/**
 * Middleware para autorização baseada em perfil e/ou propriedade do recurso.
 * @param {Array|string} roles - Perfis permitidos (ex: 'admin' ou ['admin', 'editor'])
 * @param {boolean} allowSelf - Se true, permite que o próprio usuário acesse (ex: PUT/DELETE /users/:id)
 */
const verifyAuthorization = (roles = [], allowSelf = false) => {
  if (typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    // Se não autenticado ou sem perfil permitido
    if (!req.user || (roles.length && !roles.includes(req.user.role))) {
      // Se allowSelf está ativo, verifica se o usuário está tentando acessar o próprio recurso
      if (
        allowSelf &&
        req.user &&
        req.params &&
        (req.user.userId === req.params.id || req.user.id === req.params.id)
      ) {
        return next();
      }
      logger.warn('Acesso negado: permissão insuficiente', {
        userId: req.user?.userId,
        role: req.user?.role,
        path: req.originalUrl,
        method: req.method,
      });
      return res.status(403).json({ message: 'Acesso negado: permissão insuficiente.' });
    }
    next();
  };
};

export default verifyAuthorization;
