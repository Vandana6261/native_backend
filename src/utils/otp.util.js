import crypto from 'crypto';

/**
 * Generate a cryptographically secure numeric OTP of specified length (default 6 digits)
 * Uses Node.js native crypto.randomInt instead of Math.random()
 * @param {number} length - Number of digits (default: 6)
 * @returns {string} - Generated OTP string (e.g. "482910")
 */
export const generateOtp = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const otpNumber = crypto.randomInt(min, max + 1);
  return otpNumber.toString();
};
