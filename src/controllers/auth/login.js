// Controller para login de usuário
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import { comparePassword } from '../../services/passwordService.js';
import createLogger from '../../services/logger.js';
import NodeCache from 'node-cache';

const logger = createLogger('auth');
const bruteForceCache = new NodeCache({ stdTTL: 900, checkperiod: 120 }); // 15 min
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60; // 15 minutos em segundos

export default async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.trim().toLowerCase();
    const ip = req.ip;
    const key = `loginfail:${email}:${ip}`;
    const blockedKey = `loginblock:${email}:${ip}`;
    if (bruteForceCache.get(blockedKey)) {
      logger.warn('Login bloqueado por brute force', { email, ip });
      return res
        .status(429)
        .json({ message: 'Muitas tentativas de login. Tente novamente mais tarde.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn('Tentativa de login com email não cadastrado', { email, ip });
      bruteForceCache.set(key, (bruteForceCache.get(key) || 0) + 1, BLOCK_TIME);
      if (bruteForceCache.get(key) >= MAX_ATTEMPTS) {
        bruteForceCache.set(blockedKey, true, BLOCK_TIME);
        logger.warn('IP/email bloqueado por brute force', { email, ip });
      }
      return res.status(400).json({ message: 'E-mail ou senha inválidos!' });
    }
    // Verifica se o usuário está removido/desativado (soft delete)
    if (user.deleted) {
      logger.warn('Tentativa de login em conta removida/desativada', { email, ip });
      return res.status(400).json({ message: 'Conta removida ou desativada.' });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      logger.warn('Tentativa de login com senha inválida', { email, ip });
      bruteForceCache.set(key, (bruteForceCache.get(key) || 0) + 1, BLOCK_TIME);
      if (bruteForceCache.get(key) >= MAX_ATTEMPTS) {
        bruteForceCache.set(blockedKey, true, BLOCK_TIME);
        logger.warn('IP/email bloqueado por brute force', { email, ip });
      }
      return res.status(400).json({ message: 'E-mail ou senha inválidos!' });
    }
    bruteForceCache.del(key);
    bruteForceCache.del(blockedKey);
    const token = jwt.sign(
      { userId: user.id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    logger.info('Login realizado com sucesso', { userId: user.id, email: user.email, ip });
    res.status(200).json({
      token,
      user: {
        _id: String(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Erro ao fazer login', { error });
    const msg = process.env.NODE_ENV === 'development' ? error.message : 'Erro ao fazer login!';
    res.status(500).json({ message: msg });
  }
};
