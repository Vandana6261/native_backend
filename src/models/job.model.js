import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    companyWebsite: {
      type: String,
      trim: true,
      default: '',
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/i, 'Please provide a valid contact email address'],
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    employmentType: {
      type: String,
      trim: true,
      default: 'Full-time',
      enum: {
        values: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
        message: '{VALUE} is not a valid employment type',
      },
    },
    experience: {
      type: String,
      trim: true,
      default: '',
    },
    salary: {
      type: String,
      trim: true,
      default: '',
    },
    skills: {
      type: [String],
      required: [true, 'Skills are required'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0 && val.some((s) => s && s.trim().length > 0);
        },
        message: 'At least one mandatory skill must be specified',
      },
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    applicationStartDate: {
      type: Date,
      required: [true, 'Application start date is required'],
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
      validate: {
        validator: function (value) {
          if (!this.applicationStartDate) return true;
          return new Date(value) > new Date(this.applicationStartDate);
        },
        message: 'Application deadline must be after application start date',
      },
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter user reference is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const JobModel = mongoose.model('Job', jobSchema);
