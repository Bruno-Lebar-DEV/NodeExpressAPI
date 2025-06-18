// controllers/task/get.js
import Task from '../../models/Task.js';
import createLogger from '../../services/logger.js';

const logger = createLogger('task');

const get = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, owner: req.user.userId, deleted: false });
    if (!task) {
      logger.warn('Task não encontrada no get', { taskId: id, owner: req.user.userId });
      return res.status(404).json({ message: 'Task não encontrada' });
    }
    logger.info('Task consultada com sucesso', { taskId: id, owner: req.user.userId });
    res.json(task);
  } catch (err) {
    logger.error('Erro ao consultar task', { error: err });
    res.status(500).json({ message: 'Erro ao buscar task.' });
  }
};

export default get;
