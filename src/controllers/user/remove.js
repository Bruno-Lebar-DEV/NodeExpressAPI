import User from '../../models/User.js';
import createLogger from '../../services/logger.js';

const logger = createLogger('user');

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    // Só o próprio usuário ou admin pode remover
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      logger.warn('Tentativa de remoção não autorizada', { userId: req.user.userId, targetId: id });
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    const user = await User.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: new Date() },
      { new: true, select: '-password' }
    );
    if (!user) {
      logger.warn('Usuário não encontrado para remoção', { targetId: id });
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    logger.info('Usuário removido (soft delete) com sucesso', { userId: id });
    res.json({ message: 'Usuário marcado como deletado com sucesso' });
  } catch (err) {
    logger.error('Erro ao remover usuário', { error: err });
    res.status(500).json({ message: err.message });
  }
};

export default remove;
