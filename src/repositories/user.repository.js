import { UserModel } from '../models/user.model.js';

/**
 * Create a new user record in database
 */
export const createUser = async ({ userName, email, password, role, refreshToken = null }) => {
  return await UserModel.create({
    userName,
    email,
    password,
    role,
    refreshToken,
    isVerified: true,
  });
};

/**
 * Find user by email address
 */
export const findUserByEmail = async (email) => {
  return await UserModel.findOne({ email });
};

/**
 * Find user by email address including password field
 */
export const findUserByEmailWithPassword = async (email) => {
  return await UserModel.findOne({ email }).select('+password');
};

/**
 * Find user by ID
 */
export const findUserById = async (id) => {
  return await UserModel.findById(id);
};

/**
 * Save / update refresh token for a user
 */
export const updateRefreshToken = async (userId, refreshToken) => {
  return await UserModel.findByIdAndUpdate(
    userId,
    { refreshToken },
    { new: true }
  );
};
