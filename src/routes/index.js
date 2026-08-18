import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import jobRoutes from './job.routes.js';

const router = Router();

// Base API v1 routers
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);

export default router;

