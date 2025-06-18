// middlewares/corsConfig.js
// Middleware de configuração de CORS centralizado

import cors from 'cors';

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[CORS] Origem bloqueada: ${origin}`);
      }
      return callback(new Error('Origem não permitida pelo CORS.'), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

const corsConfig = cors(corsOptions);
export default corsConfig;
