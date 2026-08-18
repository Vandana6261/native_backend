import { createJob as createJobRepository } from '../repositories/job.repository.js';

/**
 * Post a new job opportunity (Recruiter only)
 * @param {string} recruiterId - ID of the recruiter posting the job
 * @param {Object} jobData - Raw job posting payload from request body
 * @returns {Promise<Object>} Created job document
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
