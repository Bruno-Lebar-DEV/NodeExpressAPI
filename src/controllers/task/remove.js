// controllers/task/remove.js
import Task from '../../models/Task.js';
import createLogger from '../../services/logger.js';

const logger = createLogger('task');

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndUpdate(
      { _id: id, owner: req.user.userId, deleted: false },
      { deleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!task) {
      logger.warn('Task não encontrada para remoção', { taskId: id, owner: req.user.userId });
      return res.status(404).json({ message: 'Task não encontrada' });
    }
    logger.info('Task removida (soft delete) com sucesso', { taskId: id, owner: req.user.userId });
    res.json({ message: 'Task marcada como deletada com sucesso' });
  } catch (err) {
    logger.error('Erro ao remover task', { error: err });
    res.status(500).json({ message: 'Erro ao remover task.' });
  }
};

export default remove;
