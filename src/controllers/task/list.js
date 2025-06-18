import Task from '../../models/Task.js';
import createLogger from '../../services/logger.js';

const logger = createLogger('task');
const MAX_LIMIT = 100;

const list = async (req, res) => {
  try {
    let { page = 1, limit = 10, group, status, search } = req.query;
    page = Number(page);
    limit = Math.min(Number(limit), MAX_LIMIT);
    const filter = { owner: req.user.userId, deleted: false };
    if (group) filter.group = group;
    if (status) filter.completed = status === 'completed';
    if (search) filter.title = { $regex: search, $options: 'i' };
    const tasks = await Task.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Task.countDocuments(filter);
    logger.info('Listagem de tasks realizada', { owner: req.user.id, page, limit, total });
    res.json({
      tasks,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    logger.error('Erro ao listar tasks', { error: err });
    res.status(500).json({ message: 'Erro ao listar tasks.' });
  }
};

export default list;
