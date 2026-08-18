import { postJob as postJobService } from '../services/job.service.js';

/**
 * POST /api/jobs
 * Create / Post a new job opportunity (Recruiter only)
 */
export const createJob = async (req, res, next) => {
  try {
    const recruiterId = req.userId; // Extracted from verified Access Token by verifyAccessToken middleware
    const jobData = req.body;

    const job = await postJobService(recruiterId, jobData);

    return res.status(201).json({
      success: true,
      message: 'Job posted successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};
