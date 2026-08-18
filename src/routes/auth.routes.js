import { Router } from 'express';
import { requestOtp, verifyOtp, register, refreshToken } from '../controllers/auth.controller.js';
import { verifySignupSession, verifyRefreshToken } from '../middlewares/auth.middleware.js';

const router = Router();

// POST /api/auth/request-otp - Request OTP and receive signupSessionToken
router.post('/request-otp', requestOtp);

// POST /api/auth/verify-otp - Verify OTP code (requires signupSessionToken)
router.post('/verify-otp', verifySignupSession, verifyOtp);

// POST /api/auth/register - Complete user registration (requires signupSessionToken)
router.post('/register', verifySignupSession, register);

// POST /api/auth/refresh-token - Refresh Access Token (requires valid Refresh Token)
router.post('/refresh-token', verifyRefreshToken, refreshToken);

export default router;
