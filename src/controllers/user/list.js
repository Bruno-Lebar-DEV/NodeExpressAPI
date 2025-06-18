import User from '../../models/User.js';
import createLogger from '../../services/logger.js';

const logger = createLogger('user');
const MAX_LIMIT = 100; // Limite máximo de itens por página

const list = async (req, res) => {
  try {
    let { page = 1, limit = 10, role, email } = req.query;
    page = Number(page);
    limit = Math.min(Number(limit), MAX_LIMIT); // Garante que não ultrapasse o máximo
    const filter = { deleted: false };
    if (role) filter.role = role;
    if (email) filter.email = email;
    const users = await User.find(filter, '-password')
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await User.countDocuments(filter);
    logger.info('Listagem de usuários realizada', { page, limit, total });
    res.json({
      users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    logger.error('Erro ao listar usuários', { error: err });
    res.status(500).json({ message: err.message });
  }
};

export default list;
