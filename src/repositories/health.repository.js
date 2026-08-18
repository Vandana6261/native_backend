import { HealthModel } from '../models/health.model.js';

/**
 * Log a new health check entry to database
 */
export const createLog = async (data) => {
  return await HealthModel.create(data);
};

/**
 * Retrieve the latest health check log
 */
export const getLatestLog = async () => {
  return await HealthModel.findOne().sort({ createdAt: -1 });
};

/**
 * Count total log records
 */
export const countLogs = async () => {
  return await HealthModel.countDocuments();
};
