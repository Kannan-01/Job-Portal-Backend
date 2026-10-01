import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    salary: {type: String,},
    jobType: { type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      required: true,},
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const job = mongoose.model("job", jobSchema);

export default job;
