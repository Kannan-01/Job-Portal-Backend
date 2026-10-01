import job from "../models/jobSchema.js";
import Application from "../models/applicationSchema.js";

export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    // check job exists
    const findjob = await job.findById(jobId);

    if (!findjob) {
      return res.status(404).json({
        succes: false,
        message: "job not found",
      });
    }

    // check if employee already applied
    const checkApplied = await Application.findOne({
      employee: req.userId,
      job: jobId,
    });

    if (checkApplied) {
      return res.status(400).json({
        succes: false,
        message: "you already applied",
      });
    }
    const application = await Application.create({
      employee: req.userId,
      job: jobId,
    });

    return res.status(201).json({
      succes: true,
      message: "Job application submitted succesfully",
      application,
    });
  } catch (err) {
    return res.status(500).json({
      succes: false,
      message: "failed to apply for this job",
      error: err.message,
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ employee: req.userId })
      .populate("job", "title company location salary jobType")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to fetch applications",
      error: err.message,
    });
  }
};

export const getJobApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const oneJob = await job.findById(jobId);
    if (!oneJob) {
      return res.status(404).json({
        success: false,
        message: "job not found !",
      });
    }
    // check job ownership
    if (oneJob.employer.toString() !== req.userId) {
      return res.status(403).json({
        succes: false,
        message: "you can view applicants for only your job",
      });
    }

    // get applicatons
    const applications = await Application.find({ job: jobId })
      .populate("employee", "name email")
      .populate("job", "title company location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      succes: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applicants",
      error: err.message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;

    // valid status
    const validStatuses = [
      "applied",
      "shortlisted",
      "interview",
      "selected",
      "rejected",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        succes: false,
        message: "invalid application status",
      });
    }

    // find application
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "application not found",
      });
    }

    // find the job

    const oneJob = await job.findById(application.job);
    if (!oneJob) {
      return res.status(404).json({
        succes: false,
        message: "job not found",
      });
    }

    // check ownership
    if (oneJob.employer.toString() !== req.userId) {
      return res.status(403).json({
        succes: false,
        message: "you can update applicantions of your own job",
      });
    }

    // update status
    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: err.message,
    });
  }
};
