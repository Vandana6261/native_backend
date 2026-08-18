import { checkHealth } from '../services/health.service.js';

/**
 * Handle GET /api/v1/health request
 */
export const getHealth = async (req, res, next) => {
  try {
    const healthStatus = await checkHealth();
    return res.status(200).json({
      success: true,
      message: 'Backend Native Server status retrieved successfully',
      data: healthStatus,
    });
  } catch (error) {
    next(error);
  }
};
