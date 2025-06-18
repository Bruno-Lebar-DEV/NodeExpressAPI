// index.js
// Este arquivo configura o app Express: middlewares, rotas e exporta o app para uso em server.js e testes.

import express from 'express';
import helmet from 'helmet';
import corsConfig from './middlewares/corsConfig.js';
import rateLimitConfig from './middlewares/rateLimitConfig.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

// Cria a instância do app Express
const app = express();

// Oculta o header X-Powered-By para maior segurança
app.disable('x-powered-by');

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Middleware de segurança HTTP (protege contra várias vulnerabilidades)
app.use(
  helmet({
    contentSecurityPolicy: false, // Desabilita CSP padrão para evitar conflitos em APIs
    crossOriginResourcePolicy: { policy: 'same-site' }, // Restringe recursos a mesma origem
  })
);

// Middleware de CORS centralizado (permite requisições de origens específicas)
app.use(corsConfig);

// Middleware de rate limit centralizado (protege contra ataques de força bruta)
app.use(rateLimitConfig);

// Rota de teste para verificar se a API está online
app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

// Importa e registra as rotas de autenticação
app.use('/api/auth', authRoutes);

// Importa e registra as rotas de usuário
app.use('/api/users', userRoutes);

// Importa e registra as rotas de tasks
app.use('/api/tasks', taskRoutes);

// Importa e registra a rota de healthcheck
app.use('/api/health', healthRoutes);

// Middleware de tratamento de erros centralizado
app.use(errorHandler);

// Exporta o app para uso em server.js e nos testes
export default app;
