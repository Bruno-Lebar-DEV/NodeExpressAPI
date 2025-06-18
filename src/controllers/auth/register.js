// Controller para registro de usuário
import User from '../../models/User.js';
import createLogger from '../../services/logger.js';
import jwt from 'jsonwebtoken';

const logger = createLogger('auth');

export default async (req, res) => {
  try {
    let { name, email, password } = req.body;
    name = name?.trim();
    email = email?.trim().toLowerCase();
    let user = await User.findOne({ email });
    if (user) {
      logger.warn('Tentativa de registro com email já cadastrado', { email });
      return res.status(400).json({ message: 'E-mail já cadastrado!' });
    }
    user = new User({ name, email, password });
    await user.save();
    logger.info('Usuário registrado com sucesso', { userId: user._id, email: user.email });
    // Gera token JWT igual ao login
    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    logger.error('Erro ao registrar usuário', { error });
    // Só mostra detalhes do erro em ambiente de desenvolvimento
    const msg =
      process.env.NODE_ENV === 'development' ? error.message : 'Erro ao registrar usuário!';
    res.status(500).json({ message: msg });
  }
};
