// server.js
// Este arquivo conecta ao banco de dados, registra a documentação Swagger e inicia o servidor Express.

import dotenv from 'dotenv';
import app from './index.js';
import connectDB from './config/database.js';
import { swaggerUI, specs } from './config/swagger.js';

// Carrega variáveis de ambiente do arquivo .env correspondente ao ambiente
const envFile = `.env${process.env.NODE_ENV && process.env.NODE_ENV !== 'development' ? '.' + process.env.NODE_ENV : ''}`;
dotenv.config({ path: envFile });

// Registra a rota da documentação Swagger ANTES de iniciar o servidor
// Assim, a documentação estará disponível mesmo se o banco estiver fora do ar
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(specs));

// Define a porta do servidor (padrão: 5000)
const PORT = process.env.PORT || 5000;

// Conecta ao banco e só então inicia o servidor
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    // Exibe erro detalhado caso a conexão falhe
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1); // Encerra o processo com erro
  });
