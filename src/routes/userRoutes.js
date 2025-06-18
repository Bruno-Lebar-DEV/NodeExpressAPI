import express from 'express';

// Validação de autorização
import verifyToken from '../middlewares/auth/verifyToken.js';
import verifyAuthorization from '../middlewares/auth/verifyAuthorization.js';

// validação de dados de entrada
import validateCreateUser from '../middlewares/user/validate-create-user.js';
import validateListUser from '../middlewares/user/validate-list-user.js';
import validateViewUser from '../middlewares/user/validate-view-user.js';
import validateUpdateUser from '../middlewares/user/validate-update-user.js';
import validateRemoveUser from '../middlewares/user/validate-remove-user.js';
import validateRolesUser from '../middlewares/user/validate-roles-user.js';

// Controllers de usuários
import create from '../controllers/user/create.js';
import update from '../controllers/user/update.js';
import list from '../controllers/user/list.js';
import remove from '../controllers/user/remove.js';
import get from '../controllers/user/get.js';
import roles from '../controllers/user/roles.js';

const router = express.Router();

router.post('/', verifyToken, verifyAuthorization(['admin']), validateCreateUser, create);
router.get('/', verifyToken, verifyAuthorization(['admin']), validateListUser, list);
router.get('/:id', verifyToken, verifyAuthorization(['admin'], true), validateViewUser, get);
router.put('/:id', verifyToken, verifyAuthorization(['admin'], true), validateUpdateUser, update);
router.patch('/:id', verifyToken, verifyAuthorization(['admin'], true), validateUpdateUser, update);
router.delete(
  '/:id',
  verifyToken,
  verifyAuthorization(['admin'], true),
  validateRemoveUser,
  remove
);
router.put('/:id/roles', verifyToken, verifyAuthorization(['admin']), validateRolesUser, roles);

export default router;
