import { createLog } from '../repositories/health.repository.js';
import mongoose from 'mongoose';

/**
 * Perform system health evaluation
 */
export const checkHealth = async () => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  const statusInfo = {
    server: 'UP',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusMap[dbState] || 'Unknown',
      connected: dbState === 1,
    },
  };

  // Optionally try to record log if DB is connected
  if (dbState === 1) {
    try {
      await createLog({
        status: 'UP',
        message: 'Server and DB health check OK',
      });
    } catch (err) {
      console.warn(`[HealthService] Failed to write log: ${err.message}`);
    }
  }

  return statusInfo;
};
