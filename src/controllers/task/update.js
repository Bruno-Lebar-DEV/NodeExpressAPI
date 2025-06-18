// controllers/task/update.js
import Task from '../../models/Task.js';
import createLogger from '../../services/logger.js';

const logger = createLogger('task');

const allowedFields = ['title', 'description', 'group', 'completed'];

const update = async (req, res) => {
  try {
    const { id } = req.params;
    // Filtra apenas campos permitidos e sanitiza
    const updateData = {};
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        const value = req.body[field];
        updateData[field] = typeof value === 'string' ? value.trim() : value;
      }
    }
    const task = await Task.findOneAndUpdate(
      { _id: id, owner: req.user.userId, deleted: false },
      updateData,
      { new: true }
    );
    if (!task) {
      logger.warn('Task não encontrada para atualização', { taskId: id, owner: req.user.userId });
      return res.status(404).json({ message: 'Task não encontrada' });
    }
    logger.info('Task atualizada com sucesso', { taskId: id, owner: req.user.userId });
    res.json(task);
  } catch (err) {
    logger.error('Erro ao atualizar task', { error: err });
    res.status(400).json({ message: err.message });
  }
};

export default update;
