import jwt from 'jsonwebtoken';

/**
 * Generate a JWT Signup Session token for user OTP verification flow
 * @param {Object} payload - Data to embed in token (e.g., { email })
 * @param {string} expiresIn - Expiry duration (default: '15m')
 * @returns {string} Signed JWT token
 */
export const generateSignupToken = (payload, expiresIn = '15m') => {
  const secret = process.env.JWT_SIGNUP_SECRET;
  if (!secret) {
    throw new Error('JWT_SIGNUP_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    { ...payload, purpose: 'signup_otp_verification' },
    secret,
    { expiresIn }
  );
};

/**
 * Verify a JWT Signup Session token
 * @param {string} token 
 * @returns {Object} Decoded token payload
 */
export const verifySignupToken = (token) => {
  const secret = process.env.JWT_SIGNUP_SECRET;
  if (!secret) {
    throw new Error('JWT_SIGNUP_SECRET is not defined in environment variables');
  }

  return jwt.verify(token, secret);
};

/**
 * Generate JWT Access Token (default: 15 minutes)
 * @param {Object} payload - User data (id, email, role)
 * @param {string} expiresIn - Expiry duration (default: '15m')
 * @returns {string} Signed JWT Access Token
 */
export const generateAccessToken = (payload, expiresIn = '15m') => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify JWT Access Token
 * @param {string} token 
 * @returns {Object} Decoded user payload
 */
export const verifyAccessToken = (token) => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
  }

  return jwt.verify(token, secret);
};

/**
 * Generate JWT Refresh Token (default: 30 days / 1 month)
 * @param {Object} payload - User data (id, email)
 * @param {string} expiresIn - Expiry duration (default: '30d')
 * @returns {string} Signed JWT Refresh Token
 */
export const generateRefreshToken = (payload, expiresIn = '30d') => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify JWT Refresh Token
 * @param {string} token 
 * @returns {Object} Decoded user payload
 */
export const verifyRefreshToken = (token) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }

  return jwt.verify(token, secret);
};
