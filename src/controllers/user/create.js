// controllers/user/create.js
import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import createLogger from '../../services/logger.js';

const logger = createLogger('user');

const create = async (req, res) => {
  try {
    let userData;
    // Remove qualquer tentativa de definir role no cadastro
    if (req.user && req.user.role === 'admin') {
      userData = { ...req.body };
      delete userData.role;
    } else {
      userData = { ...req.body, role: 'visual' };
    }
    if (userData.name) userData.name = userData.name.trim();
    if (userData.email) userData.email = userData.email.trim().toLowerCase();
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    const user = new User(userData);
    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    logger.info('Usuário criado com sucesso', { userId: user._id, email: user.email });
    res.status(201).json(userObj);
  } catch (err) {
    logger.error('Erro ao criar usuário', { error: err });
    res.status(400).json({ message: err.message });
  }
};

export default create;
