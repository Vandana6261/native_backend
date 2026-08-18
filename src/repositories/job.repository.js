import { JobModel } from '../models/job.model.js';

/**
 * Create a new job document in the database
 * @param {Object} jobData - Job fields including recruiter ID
 * @returns {Promise<Object>} Created job document
 */
export const createJob = async (jobData) => {
  return await JobModel.create(jobData);
};
