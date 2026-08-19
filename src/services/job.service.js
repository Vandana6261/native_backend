import { createJob as createJobRepository, getAllJobs as getAllJobsRepository, getJobById as getJobByIdRepository, updateJob as updateJobRepository, deleteJob as deleteJobRepository, searchJobs as searchJobsRepository } from '../repositories/job.repository.js';

/**
 * Post a new job opportunity (Recruiter only)
 */
export const postJob = async (recruiterId, jobData) => {
  if (!recruiterId) {
    const error = new Error('Recruiter ID is required to post a job');
    error.statusCode = 400;
    throw error;
  }
  if (!jobData || typeof jobData !== 'object') {
    const error = new Error('Job data payload is required');
    error.statusCode = 400;
    throw error;
  }

  const {
    title,
    companyName,
    companyWebsite,
    contactEmail,
    location,
    employmentType,
    experience,
    salary,
    skills,
    description,
    applicationStartDate,
    applicationDeadline,
  } = jobData;

  // Basic validation checks
  if (!title || typeof title !== 'string' || !title.trim()) {
    const error = new Error('Job title is required');
    error.statusCode = 400;
    throw error;
  }

  if (!contactEmail || typeof contactEmail !== 'string' || !contactEmail.trim()) {
    const error = new Error('Contact email is required');
    error.statusCode = 400;
    throw error;
  }

  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    const error = new Error('At least one mandatory skill must be specified');
    error.statusCode = 400;
    throw error;
  }

  if (!applicationStartDate) {
    const error = new Error('Application start date is required');
    error.statusCode = 400;
    throw error;
  }

  if (!applicationDeadline) {
    const error = new Error('Application deadline is required');
    error.statusCode = 400;
    throw error;
  }

  if (new Date(applicationDeadline) <= new Date(applicationStartDate)) {
    const error = new Error('Application deadline must be after application start date');
    error.statusCode = 400;
    throw error;
  }

  // Construct job payload with recruiter reference
  const payload = {
    title: title.trim(),
    companyName: companyName ? companyName.trim() : '',
    companyWebsite: companyWebsite ? companyWebsite.trim() : '',
    contactEmail: contactEmail.trim(),
    location: location ? location.trim() : '',
    employmentType: employmentType || 'Full-time',
    experience: experience ? experience.trim() : '',
    salary: salary ? salary.trim() : '',
    skills,
    description: description ? description.trim() : '',
    applicationStartDate: new Date(applicationStartDate),
    applicationDeadline: new Date(applicationDeadline),
    recruiter: recruiterId,
  };

  const job = await createJobRepository(payload);
  return job;
};

/**
 * Retrieve all job postings (public)
 * @returns {Promise<Array>} List of job documents
 */
export const getAllJobs = async () => {
  const jobs = await getAllJobsRepository();
  return jobs;
};

/**
 * Update a job (owner only)
 * @param {string} recruiterId - ID of the authenticated recruiter
 * @param {string} jobId - ID of the job to update
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} Updated job document
 */
export const updateJob = async (recruiterId, jobId, updateData) => {
  if (!recruiterId) {
    const error = new Error('Recruiter ID is required');
    error.statusCode = 400;
    throw error;
  }
  if (!jobId) {
    const error = new Error('Job ID is required');
    error.statusCode = 400;
    throw error;
  }
  const job = await getJobByIdRepository(jobId);
  if (!job) {
    const error = new Error('Job not found');
    error.statusCode = 404;
    throw error;
  }
  if (job.recruiter.toString() !== recruiterId) {
    const error = new Error('Unauthorized: you are not the owner of this job');
    error.statusCode = 403;
    throw error;
  }
  const updatedJob = await updateJobRepository(jobId, updateData);
  return updatedJob;
};

/**
 * Delete a job (owner only)
 * @param {string} recruiterId - ID of the authenticated recruiter
 * @param {string} jobId - ID of the job to delete
 * @returns {Promise<Object>} Deleted job document
 */
export const deleteJob = async (recruiterId, jobId) => {
  if (!recruiterId) {
    const error = new Error('Recruiter ID is required');
    error.statusCode = 400;
    throw error;
  }
  if (!jobId) {
    const error = new Error('Job ID is required');
    error.statusCode = 400;
    throw error;
  }
  const job = await getJobByIdRepository(jobId);
  if (!job) {
    const error = new Error('Job not found');
    error.statusCode = 404;
    throw error;
  }
  if (job.recruiter.toString() !== recruiterId) {
    const error = new Error('Unauthorized: you are not the owner of this job');
    error.statusCode = 403;
    throw error;
  }
  const deletedJob = await deleteJobRepository(jobId);
  return deletedJob;
};

/**
 * Search jobs by title and/or location (public)
 * @param {Object} filters - May contain title and/or location strings
 * @returns {Promise<Array>} List of matching job documents
 */
export const searchJobs = async (filters) => {
  // Ensure filters is an object
  if (!filters || typeof filters !== 'object') {
    const error = new Error('Filters must be provided as an object');
    error.statusCode = 400;
    throw error;
  }
  // Delegates to repository
  const jobs = await searchJobsRepository(filters);
  return jobs;
};
