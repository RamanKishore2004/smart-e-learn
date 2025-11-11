import express from "express";
import { markCourseComplete, getCourseStatus } from "../controllers/submissionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/course-complete", auth, markCourseComplete);
router.get("/course-status/:courseId", auth, getCourseStatus);



export default router;
