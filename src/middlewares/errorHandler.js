// middlewares/errorHandler.js
// Middleware centralizado para tratamento de erros

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERRO] ${req.method} ${req.originalUrl} -`, err);
  }
  if (res.headersSent) {
    return next(err);
  }
  // Erro de CORS
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ message: 'Origem não permitida.' });
  }
  // Erro de limite de taxa
  if (err.status === 429) {
    return res
      .status(429)
      .json({ message: err.message || 'Muitas requisições, tente novamente mais tarde.' });
  }
  // Outros erros
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export default errorHandler;
