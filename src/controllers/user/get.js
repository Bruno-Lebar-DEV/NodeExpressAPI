// controllers/user/get.js
import User from '../../models/User.js';
import createLogger from '../../services/logger.js';

const logger = createLogger('user');

const get = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      logger.warn('Tentativa de acesso não autorizada ao get', {
        userId: req.user.userId,
        targetId: id,
      });
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    const user = await User.findOne({ _id: id, deleted: false }, '-password');
    if (!user) {
      logger.warn('Usuário não encontrado no get', { targetId: id });
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    logger.info('Usuário consultado com sucesso', { userId: id });
    res.json(user);
  } catch (err) {
    logger.error('Erro ao consultar usuário', { error: err });
    res.status(500).json({ message: err.message });
  }
};

export default get;
