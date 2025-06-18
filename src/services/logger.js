// src/services/logger.js
import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  // Permite sobrescrever via variável de ambiente LOG_LEVEL
  if (process.env.LOG_LEVEL) return process.env.LOG_LEVEL;
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'info';
    case 'test':
      return 'error';
    default:
      return 'debug';
  }
};

const createModuleLogger = (moduleName) => {
  // No ambiente de teste, remove todos os transports para silenciar logs
  if (process.env.NODE_ENV === 'test') {
    return winston.createLogger({
      level: 'error',
      levels,
      transports: [], // Nenhum transporte
    });
  }
  return winston.createLogger({
    level: level(),
    levels,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(
        ({ timestamp, level, message, ...meta }) =>
          `${timestamp} [${level.toUpperCase()}] [${moduleName}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
      )
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: `logs/${moduleName}.log` }), // opcional
    ],
  });
};

export default createModuleLogger;
