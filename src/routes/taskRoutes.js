import express from 'express';

// Validação de autorização
import verifyToken from '../middlewares/auth/verifyToken.js';
import verifyAuthorization from '../middlewares/auth/verifyAuthorization.js';

// Validação de dados de entrada
import validateCreateTask from '../middlewares/task/validate-create-task.js';
import validateUpdateTask from '../middlewares/task/validate-update-task.js';
import validateListTask from '../middlewares/task/validate-list-task.js';
import validateViewTask from '../middlewares/task/validate-view-task.js';
import validateRemoveTask from '../middlewares/task/validate-remove-task.js';

// Controllers de tarefas
import create from '../controllers/task/create.js';
import update from '../controllers/task/update.js';
import list from '../controllers/task/list.js';
import get from '../controllers/task/get.js';
import remove from '../controllers/task/remove.js';

const router = express.Router();

router.post('/', verifyToken, verifyAuthorization(['admin', 'editor']), validateCreateTask, create);
router.get('/', verifyToken, verifyAuthorization(['admin', 'editor']), validateListTask, list);
router.get('/:id', verifyToken, verifyAuthorization(['admin', 'editor']), validateViewTask, get);
router.put(
  '/:id',
  verifyToken,
  verifyAuthorization(['admin', 'editor']),
  validateUpdateTask,
  update
);
router.delete(
  '/:id',
  verifyToken,
  verifyAuthorization(['admin', 'editor']),
  validateRemoveTask,
  remove
);

export default router;
