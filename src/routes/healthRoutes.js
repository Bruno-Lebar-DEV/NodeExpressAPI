// src/routes/healthRoutes.js
import express from 'express';
import health from '../controllers/health.js';

const router = express.Router();

router.get('/', health);

export default router;
