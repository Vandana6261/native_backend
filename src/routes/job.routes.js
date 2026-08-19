import { Router } from 'express';
import { createJob, getAllJobs, updateJob, deleteJob, searchJobs } from '../controllers/job.controller.js';
import { verifyAccessToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @route   POST /api/jobs
 * @desc    Create a new job posting
 * @access  Private (Recruiter only)
 */
router.post('/', verifyAccessToken, authorizeRoles('recruiter'), createJob);
// Public route to retrieve all jobs
router.get('/', getAllJobs);
router.put('/:id', verifyAccessToken, authorizeRoles('recruiter'), updateJob);
router.delete('/:id', verifyAccessToken, authorizeRoles('recruiter'), deleteJob);
router.get('/search', searchJobs);
export default router;
