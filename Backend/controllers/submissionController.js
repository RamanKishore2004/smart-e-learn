import CourseProgress from "../models/Submission.model.js";

// ✅ Mark or unmark a course as completed
export const markCourseComplete = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, title, completed } = req.body;

    let record = await CourseProgress.findOne({ userId, courseId });

    if (record) {
      record.completed = completed;
    } else {
      record = new CourseProgress({ userId, courseId, title, completed });
    }

    await record.save();
    res.json({ success: true, record });
  } catch (error) {
    console.error("❌ Error saving course progress:", error);
    res.status(500).json({ message: "Server error saving progress" });
  }
};

// ✅ Get course completion status
export const getCourseStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const record = await CourseProgress.findOne({ userId, courseId });
    res.json({ completed: record ? record.completed : false });
  } catch (error) {
    console.error("❌ Error fetching course status:", error);
    res.status(500).json({ message: "Server error fetching status" });
  }
};
