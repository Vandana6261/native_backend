import {
  requestOtp as requestOtpService,
  verifyOtp as verifyOtpService,
  registerUser as registerUserService,
  refreshAccessToken as refreshAccessTokenService,
  loginUser as loginUserService,
  logoutUser as logoutUserService,
} from '../services/auth.service.js';

/**
 * POST /api/auth/request-otp
 * Request OTP for signup / authentication
 */
export const requestOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await requestOtpService(email);

    return res.status(200).json({
      success: true,
      message: result.message,
      signupSessionToken: result.signupSessionToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify-otp
 * Verify OTP code submitted by user (requires signupSessionToken)
 */
export const verifyOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const email = req.email; // From verifySignupSession middleware

    const result = await verifyOtpService(email, otp);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/register
 * Complete user registration after OTP verification (requires signupSessionToken)
 */
export const register = async (req, res, next) => {
  try {
    const { userName, password, role } = req.body;
    const email = req.email; // From verifySignupSession middleware

    const result = await registerUserService({
      email,
      userName,
      password,
      role,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * User login with email and password
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await loginUserService({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Logout user (requires verified Access Token)
 */
export const logout = async (req, res, next) => {
  try {
    const userId = req.userId; // Extracted by verifyAccessToken middleware

    const result = await logoutUserService(userId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/refresh-token
 * Generate a new Access Token using a verified Refresh Token
 */
export const refreshToken = async (req, res, next) => {
  try {
    const userId = req.userId; // From verifyRefreshToken middleware
    const incomingRefreshToken = req.refreshToken; // From verifyRefreshToken middleware

    const result = await refreshAccessTokenService(userId, incomingRefreshToken);

    return res.status(200).json({
      success: true,
      message: 'New access token generated successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


