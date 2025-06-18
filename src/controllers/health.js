// src/controllers/health.js
import mongoose from 'mongoose';

const health = async (req, res) => {
  let dbStatus = 'ok';
  let errorMsg = null;
  try {
    // Verifica conexão com o banco
    if (mongoose.connection.readyState !== 1) {
      dbStatus = 'unavailable';
    }
  } catch (err) {
    dbStatus = 'error';
    errorMsg = err.message;
    // Loga o erro capturado
    console.error('Erro no healthcheck:', err);
  }
  res.status(dbStatus === 'ok' ? 200 : 503).json({
    status: 'ok',
    db: dbStatus,
    error: errorMsg,
  });
};

export default health;
