import express from 'express';

// Validação de dados de entrada
import validateRegister from '../middlewares/auth/validateRegister.js';
import validateLogin from '../middlewares/auth/validateLogin.js';
import validateLogout from '../middlewares/auth/validateLogout.js';
import validateRefreshToken from '../middlewares/auth/validateRefreshToken.js';

// Controllers de autenticação
import register from '../controllers/auth/register.js';
import login from '../controllers/auth/login.js';
import logout from '../controllers/auth/logout.js';
import refreshToken from '../controllers/auth/refreshToken.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', validateLogout, logout);
router.post('/refresh', validateRefreshToken, refreshToken);

export default router;
