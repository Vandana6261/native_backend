import mongoose from 'mongoose';

const healthSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      default: 'UP',
    },
    message: {
      type: String,
      required: true,
    },
    checkedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const HealthModel = mongoose.model('Health', healthSchema);
