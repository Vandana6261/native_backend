import { Router } from 'express';
import { createJob } from '../controllers/job.controller.js';
import { verifyAccessToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @route   POST /api/jobs
 * @desc    Create a new job posting
 * @access  Private (Recruiter only)
 */
router.post('/', verifyAccessToken, authorizeRoles('recruiter'), createJob);

export default router;
