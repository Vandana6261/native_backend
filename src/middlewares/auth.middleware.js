import {
  verifySignupToken,
  verifyAccessToken as verifyAccessTokenUtil,
  verifyRefreshToken as verifyRefreshTokenUtil,
} from '../utils/jwt.util.js';

/**
 * Middleware to verify Signup Session JWT Token before OTP verification or signup completion
 */
export const verifySignupSession = (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Fallback to x-signup-token header or req.body
    if (!token) {
      token = req.headers['x-signup-token'] || req.body?.signupSessionToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Signup session token is missing. Please request an OTP first.',
      });
    }

    // 3. Verify token signature and expiration
    const decoded = verifySignupToken(token);

    if (!decoded || !decoded.email) {
      return res.status(401).json({
        success: false,
        message: 'Invalid signup session token payload.',
      });
    }

    // 4. Attach decoded signup session and email to request object
    req.email = decoded.email;
    req.signupSession = decoded;

    next();
  } catch (error) {
    console.error('[AuthMiddleware] Signup Session verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired signup session token.',
      error: error.message,
    });
  }
};

/**
 * Middleware to verify JWT Access Token for protected routes
 */
export const verifyAccessToken = (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    
    // 2. Fallback to x-access-token header
    if (!token) {
      token = req.headers['x-access-token'];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required. Please login.',
      });
    }

    // 3. Verify access token signature and expiration
    const decoded = verifyAccessTokenUtil(token);

    // 4. Attach decoded user payload to request object
    req.user = decoded;
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    console.error('[AuthMiddleware] Access Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired access token. Please login again.',
      error: error.message,
    });
  }
};

/**
 * Middleware to verify JWT Refresh Token (e.g. for token refresh endpoint)
 */
export const verifyRefreshToken = (req, res, next) => {
  try {
    let token = null;

    // 1. Check body (req.body.refreshToken)
    if (req.body && req.body.refreshToken) {
      token = req.body.refreshToken;
    }

    // 2. Fallback to x-refresh-token header
    if (!token) {
      token = req.headers['x-refresh-token'];
    }

    // 3. Fallback to Authorization header (Bearer <token>)
    if (!token) {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is missing. Please provide a refresh token.',
      });
    }

    // 4. Verify refresh token signature and expiration
    const decoded = verifyRefreshTokenUtil(token);

    // 5. Attach decoded user payload and raw refresh token to request object
    req.user = decoded;
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.refreshToken = token;

    next();
  } catch (error) {
    console.error('[AuthMiddleware] Refresh Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token. Please login again.',
      error: error.message,
    });
  }
};

/**
 * Middleware to restrict access based on user roles (e.g. 'recruiter', 'student')
 * @param  {...string} allowedRoles - List of allowed roles
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.userRole || 'unknown'}' is not authorized to access this route.`,
      });
    }
    next();
  };
};
