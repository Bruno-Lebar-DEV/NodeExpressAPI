// controllers/user/roles.js
import User from '../../models/User.js';
import createLogger from '../../services/logger.js';

const logger = createLogger('user');

// Altera a role de um usuário (apenas admin)
const roles = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true, select: '-password' });
    if (!user) {
      logger.warn('Usuário não encontrado para alteração de role', { targetId: id });
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    logger.info('Role de usuário alterada com sucesso', { userId: id, newRole: role });
    res.json({ message: 'Perfil (role) atualizado com sucesso', user });
  } catch (err) {
    logger.error('Erro ao alterar role de usuário', { error: err });
    res.status(400).json({ message: err.message });
  }
};

export default roles;
