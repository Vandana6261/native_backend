import { postJob as postJobService, getAllJobs as getAllJobsService, updateJob as updateJobService, deleteJob as deleteJobService, searchJobs as searchJobsService } from '../services/job.service.js';

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

/**
 * GET /api/jobs
 * Retrieve all job postings (public)
 */
export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await getAllJobsService();
    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/jobs/:id
 * Update a specific job (owner only)
 */
export const updateJob = async (req, res, next) => {
  try {
    const recruiterId = req.userId;
    const jobId = req.params.id;
    const updateData = req.body;

    const updatedJob = await updateJobService(recruiterId, jobId, updateData);
    return res.status(200).json({
      success: true,
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/jobs/:id
 * Delete a specific job (owner only)
 */
export const deleteJob = async (req, res, next) => {
  try {
    const recruiterId = req.userId;
    const jobId = req.params.id;
    const deletedJob = await deleteJobService(recruiterId, jobId);
    return res.status(200).json({
      success: true,
      data: deletedJob,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs/search
 * Search for jobs by title and/or location (public)
 */
export const searchJobs = async (req, res, next) => {
  try {
    const { title, location } = req.query;
    const filters = {};
    if (title) filters.title = title;
    if (location) filters.location = location;
    const jobs = await searchJobsService(filters);
    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};
