// config/database.js
// Este arquivo faz a conexão com o MongoDB usando Mongoose.
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import createLogger from '../services/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logger = createLogger('db');

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });
} else {
  dotenv.config();
}

// Corrigido para usar DB_URI do .env
const uri = process.env.DB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      // useNewUrlParser e useUnifiedTopology são desnecessários em versões recentes
    });

    logger.info('MongoDB conectado!');
    return mongoose.connection;
  } catch (error) {
    logger.error('Erro ao conectar ao MongoDB', { error });
    if (process.env.NODE_ENV === 'test') throw error;
    else process.exit(1); // Só encerra fora do ambiente de teste
  }
};

export default connectDB;
