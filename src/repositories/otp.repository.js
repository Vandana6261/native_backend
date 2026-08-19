import { OtpModel } from '../models/otp.model.js';

/**
 * Remove previous existing OTPs for email and create a new OTP record
 */
export const createOrReplaceOtp = async ({ email, otp, expiresAt }) => {
  console.log("in repo");
  // Find any existing OTPs for this email
  const existingOtps = await OtpModel.find({ email });
  if (existingOtps && existingOtps.length > 0) {
    await OtpModel.deleteMany({ email });
    console.log(`Deleted ${existingOtps.length} existing OTP(s) for ${email}`);
  }
  console.log("14 repo")
  // Create new OTP record
  return await OtpModel.create({
    email,
    otp,
    expiresAt,
  });
};

/**
 * Find latest active OTP by email
 */
export const findOtpByEmail = async (email) => {
  return await OtpModel.findOne({ email }).sort({ createdAt: -1 });
};

/**
 * Mark OTP as verified
 */
export const markAsVerified = async (id) => {
  return await OtpModel.findByIdAndUpdate(id, { verified: true }, { new: true });
};

/**
 * Delete OTP records for an email address
 */
export const deleteOtpsByEmail = async (email) => {
  return await OtpModel.deleteMany({ email });
};
