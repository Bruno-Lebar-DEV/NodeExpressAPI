import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import createLogger from '../../services/logger.js';

const logger = createLogger('user');

const allowedFields = ['name', 'email', 'password']; // role removido

const update = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      logger.warn('Tentativa de atualização não autorizada', {
        userId: req.user.userId,
        targetId: id,
      });
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    // Não permite alteração de role por aqui, exceto se admin
    if (
      Object.keys(req.body).some((k) => k.toLowerCase() === 'role') &&
      req.user.role !== 'admin'
    ) {
      logger.warn('Tentativa de alteração de role via update', {
        userId: req.user.userId,
        targetId: id,
      });
      return res.status(403).json({ message: 'Alteração de perfil (role) não é permitida.' });
    }
    // Mesmo se admin, só permite alteração de role por rota específica
    if ('role' in req.body) {
      delete req.body.role;
    }
    const updateData = {};
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updateData[field] = req.body[field];
      }
    }
    if (updateData.name) updateData.name = updateData.name.trim();
    if (updateData.email) updateData.email = updateData.email.trim().toLowerCase();
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    const user = await User.findByIdAndUpdate(id, updateData, { new: true, select: '-password' });
    if (!user) {
      logger.warn('Usuário não encontrado para atualização', { targetId: id });
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    logger.info('Usuário atualizado com sucesso', { userId: id });
    res.json(user);
  } catch (err) {
    logger.error('Erro ao atualizar usuário', { error: err });
    res.status(400).json({ message: err.message });
  }
};

export default update;
