import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: String, required: true },
  title: { type: String },
  completed: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("CourseProgress", courseProgressSchema);
