import { response } from "express";
import job from "../models/jobSchema.js";

export const createJob = async (req, res) => {
  try {
    // destructure everything
    const {
      title,
      company,
      location,
      description,
      requirements,
      salary,
      jobType,
    } = req.body;

    // check if everything is provided
    if (
      !title ||
      !company ||
      !location ||
      !description ||
      !requirements ||
      !salary ||
      !jobType
    ) {
      return res.status(400).json({
        success: false,
        message: "please provide all the required fields",
      });
    }

    // save to mongodb

    await job.create({
      title,
      company,
      location,
      description,
      requirements,
      salary,
      jobType,
      employer: req.userId,
    });

    return res.status(200).json({
      success: true,
      message: "job created successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "failed to create job",
      error: err.message,
    });
  }
};

export const getAlljobs = async (req, res) => {
  try {
    const { search, location, jobType, sort , page=1,limit=10 } = req.query;
    let filter = {};

    // search
    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { company: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }
    // filtering
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (jobType) {
      filter.jobType = { $regex: jobType, $options: "i" };
    }

    // sorting
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") {
      sortOption = 1;
    }
    // pagination
    const pageNumber = Number(page);
    const limitNumber=Number(limit);
    const skip=(pageNumber - 1)* limitNumber;
    const totalJobs = await job.countDocuments(filter);

    const jobs = await job
      .find(filter)
      .populate("employer", "name email")
      .sort(sortOption).skip(skip).limit
      (limitNumber);

    return res.status(200).json({
      success: true,
      count: jobs.length,
      totalJobs,
      currentPage:pageNumber,
      totalPages:Math.ceil(totalJobs/limitNumber),
      jobs,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to fetch jobs",
      error: err.message,
    });
  }
};

export const getSingleJob = async (req, res) => {
  try {
    const oneJob = await job
      .findById(req.params.id)
      .populate("employer", "name mail");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "job not found",
      });
    }

    return res.status(200).json({
      status: true,
      oneJob,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to fetch job",
      error: err.message,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const oneJob = await job.findById(req.params.id);

    if (!oneJob) {
      return res.status(404).json({
        success: false,
        message: "job not found",
      });
    }

    //   check ownership
    if (oneJob.employer.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "you can delete only your own jobs",
      });
    }

    await job.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "job deleted succesfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to delete job",
      error: err.message,
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const oneJob = await job.findById(req.params.id);

    if (!oneJob) {
      return res.status(404).json({
        success: false,
        message: "job not found",
      });
    }

    // check ownership

    if (oneJob.employer.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "you can edit only your own jobs",
      });
    }

    const updatedJob = await job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "job updated succesfully",
      updated: updatedJob,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to delete job",
      error: err.message,
    });
  }
};
