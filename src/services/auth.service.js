import bcrypt from 'bcryptjs';
import { generateOtp } from '../utils/otp.util.js';
import {
  generateSignupToken,
  generateAccessToken,
  generateRefreshToken,
} from '../utils/jwt.util.js';
import { sendOtpEmail } from '../utils/mailer.util.js';
import {
  createOrReplaceOtp,
  findOtpByEmail,
  markAsVerified,
  deleteOtpsByEmail,
} from '../repositories/otp.repository.js';
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateRefreshToken,
} from '../repositories/user.repository.js';

/**
 * Request OTP for email verification / signup
 * @param {string} email - Target email address
 */
export const requestOtp = async (email) => {
  if (!email || typeof email !== 'string') {
    const error = new Error('A valid email address is required');
    error.statusCode = 400;
    throw error;
  }

  const cleanEmail = email.trim();
  
  // Case-insensitive email format validation (preserves exact case)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  if (!emailRegex.test(cleanEmail)) {
    const error = new Error('Invalid email format');
    error.statusCode = 400;
    throw error;
  }

  // 1. Generate 6-digit cryptographically secure OTP (using crypto.randomInt)
  const otp = generateOtp(6);

  // 2. Set OTP expiration time (10 minutes from now)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // 3. Save OTP record to database
  await createOrReplaceOtp({
    email: cleanEmail,
    otp,
    expiresAt,
  });

  // 4. Send OTP email via Nodemailer
  try {
    await sendOtpEmail(cleanEmail, otp);
  } catch (mailError) {
    console.error('[AuthService] Nodemailer error:', mailError);
    const error = new Error(`Failed to send OTP email: ${mailError.message}`);
    error.statusCode = 500;
    throw error;
  }

  // 5. Generate Signup Session JWT Token
  const signupSessionToken = generateSignupToken({ email: cleanEmail });

  // 6. Return response object
  return {
    message: 'OTP has been shared with your email.',
    signupSessionToken,
  };
};

/**
 * Verify OTP submitted by user
 * @param {string} email - Email attached to verified signup session token
 * @param {string} otp - OTP code submitted by user
 */
export const verifyOtp = async (email, otp) => {
  if (!otp || typeof otp !== 'string') {
    const error = new Error('OTP is required for verification');
    error.statusCode = 400;
    throw error;
  }

  const cleanOtp = otp.trim();

  // 1. Retrieve the latest OTP record for this email
  const otpRecord = await findOtpByEmail(email);

  if (!otpRecord) {
    const error = new Error('No active OTP request found for this email. Please request a new OTP.');
    error.statusCode = 404;
    throw error;
  }

  // 2. Check if OTP is expired
  if (new Date(otpRecord.expiresAt) < new Date()) {
    const error = new Error('OTP has expired. Please request a new OTP.');
    error.statusCode = 400;
    throw error;
  }

  // 3. Check if submitted OTP matches stored OTP
  if (otpRecord.otp !== cleanOtp) {
    const error = new Error('Invalid OTP code. Please check your email and try again.');
    error.statusCode = 400;
    throw error;
  }

  // 4. Mark OTP record as verified
  await markAsVerified(otpRecord._id);

  return {
    message: 'OTP verified successfully.',
  };
};

/**
 * Register user after OTP verification
 * @param {Object} params - { email, userName, password, role }
 */
export const registerUser = async ({ email, userName, password, role }) => {
  if (!userName || typeof userName !== 'string' || !userName.trim()) {
    const error = new Error('User name is required');
    error.statusCode = 400;
    throw error;
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    const error = new Error('Password is required and must be at least 6 characters long');
    error.statusCode = 400;
    throw error;
  }

  if (!role || !['recruiter', 'student'].includes(role.toLowerCase())) {
    const error = new Error('Role must be either "recruiter" or "student"');
    error.statusCode = 400;
    throw error;
  }

  const cleanEmail = email.trim();
  const cleanUserName = userName.trim();
  const cleanRole = role.toLowerCase();

  // 1. Check if an OTP record for this email exists and has been verified
  const otpRecord = await findOtpByEmail(cleanEmail);
  if (!otpRecord || !otpRecord.verified) {
    const error = new Error('Email verification required. Please verify your OTP before signing up.');
    error.statusCode = 400;
    throw error;
  }

  // 2. Check if user with this email already exists
  const existingUser = await findUserByEmail(cleanEmail);
  if (existingUser) {
    const error = new Error('A user with this email is already registered. Please login.');
    error.statusCode = 400;
    throw error;
  }

  // 3. Hash password using bcryptjs (salt rounds = 10)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Create user in database
  const user = await createUser({
    userName: cleanUserName,
    email: cleanEmail,
    password: hashedPassword,
    role: cleanRole,
  });

  // 5. Generate Access Token (15m) and Refresh Token (30d)
  const accessToken = generateAccessToken(
    { id: user._id, email: user.email, role: user.role },
    '15m'
  );

  const refreshToken = generateRefreshToken(
    { id: user._id, email: user.email },
    '30d'
  );

  // 6. Save Refresh Token in database User document
  await updateRefreshToken(user._id, refreshToken);

  // 7. Delete used OTP records for this email
  await deleteOtpsByEmail(cleanEmail);

  return {
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh Access Token using valid Refresh Token & database user check
 * @param {string} userId - User ID extracted from verified Refresh Token
 * @param {string} incomingRefreshToken - Refresh token submitted by client
 */
export const refreshAccessToken = async (userId, incomingRefreshToken) => {
  if (!userId) {
    const error = new Error('User ID is missing from token payload.');
    error.statusCode = 401;
    throw error;
  }

  // 1. Fetch user from database to ensure user exists & get latest role/status
  const user = await findUserById(userId);

  if (!user) {
    const error = new Error('User not found. Please log in again.');
    error.statusCode = 404;
    throw error;
  }

  // 2. Verify incoming refresh token matches the active refresh token in DB
  if (user.refreshToken && incomingRefreshToken && user.refreshToken !== incomingRefreshToken) {
    const error = new Error('Invalid or revoked refresh token. Please log in again.');
    error.statusCode = 401;
    throw error;
  }

  // 3. Generate a fresh Access Token (15m expiry) with up-to-date user details
  const accessToken = generateAccessToken(
    { id: user._id, email: user.email, role: user.role },
    '15m'
  );

  return {
    accessToken,
  };
};
