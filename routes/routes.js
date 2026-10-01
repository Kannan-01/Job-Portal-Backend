import express, { application } from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import jwtMiddleware from "../middleware/jwtMiddleware.js";
import { employeeOnly, employerOnly } from "../middleware/roleMiddleware.js";
import {
  createJob,
  deleteJob,
  getAlljobs,
  getSingleJob,
  updateJob
} from "../controllers/jobController.js";
import { applyJob, getJobApplicants, getMyApplications, updateApplicationStatus } from "../controllers/applicationConntroller.js";

const router = express.Router();
// auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// job routes
router.post("/createJob", jwtMiddleware, employerOnly, createJob);
router.get("/viewjobs", jwtMiddleware, getAlljobs);
router.get("/viewjob/:id", jwtMiddleware, getSingleJob);
router.delete("/employer/jobs/:id",jwtMiddleware,employerOnly,deleteJob);
router.patch("/employer/jobs/:id",jwtMiddleware,employerOnly,updateJob);

// application routes
router.post("/employee/jobs/:id/apply",jwtMiddleware,employeeOnly,applyJob);
router.get("/employee/applications",jwtMiddleware,employeeOnly,getMyApplications);
router.get("/employer/jobs/:jobId/applications",jwtMiddleware,employerOnly,getJobApplicants);
router.patch("/employer/applications/:id/status",jwtMiddleware,employerOnly,updateApplicationStatus);

export default router;
