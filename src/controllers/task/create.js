// controllers/task/create.js
import Task from '../../models/Task.js';
import createLogger from '../../services/logger.js';

const logger = createLogger('task');

const create = async (req, res) => {
  try {
    const { title, description, group, completed } = req.body;
    const task = new Task({
      title: title?.trim(),
      description: description?.trim(),
      group: group?.trim(),
      completed: typeof completed === 'boolean' ? completed : undefined,
      owner: req.user.userId, // Corrigido de req.user.id para req.user.userId
    });
    await task.save();
    logger.info('Task criada com sucesso', { taskId: task._id, owner: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    logger.error('Erro ao criar task', { error: err });
    res.status(400).json({ message: err.message });
  }
};

export default create;
