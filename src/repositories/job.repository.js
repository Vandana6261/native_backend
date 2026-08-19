import { JobModel } from '../models/job.model.js';

/**
 * Create a new job document in the database
 * @param {Object} jobData - Job fields including recruiter ID
 * @returns {Promise<Object>} Created job document
 */
export const createJob = async (jobData) => {
  return await JobModel.create(jobData);
};

/**
 * Retrieve all job documents from the database
 * @returns {Promise<Array>} List of job documents
 */
export const getAllJobs = async () => {
  return await JobModel.find({});
};

/**
 * Retrieve a single job by its ID
 * @param {String} jobId - MongoDB ObjectId of the job
 * @returns {Promise<Object|null>} Job document or null if not found
 */
export const getJobById = async (jobId) => {
  return await JobModel.findById(jobId);
};

/**
 * Search jobs by title and/or location (case-insensitive partial match)
 * @param {Object} filters - May contain title and/or location strings
 * @returns {Promise<Array>} List of matching job documents
 */
export const searchJobs = async (filters) => {
  const query = {};
  if (filters.title) {
    query.title = { $regex: filters.title, $options: 'i' };
  }
  if (filters.location) {
    query.location = { $regex: filters.location, $options: 'i' };
  }
  return await JobModel.find(query);
};


/**
 * Update a job document by its ID
 * @param {String} jobId - MongoDB ObjectId of the job
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object|null>} Updated job document or null if not found
 */
export const updateJob = async (jobId, updateData) => {
  return await JobModel.findByIdAndUpdate(jobId, updateData, { new: true });
};

/**
 * Delete a job document by its ID
 * @param {String} jobId - MongoDB ObjectId of the job
 * @returns {Promise<Object|null>} Deleted job document or null if not found
 */
export const deleteJob = async (jobId) => {
  return await JobModel.findByIdAndDelete(jobId);
};
