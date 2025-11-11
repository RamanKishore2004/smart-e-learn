import mongoose from "mongoose";

const courseProgressSchema  = new mongoose.Schema({
  title: String,
  category: String,
  instructor: String,
  price: String,
  originalPrice: String,
  rating: Number,
  students: Number,
  duration: String,
  image: String,
  description: String,
  level: String,
  bestseller: Boolean,
  youtubeLink: String,
}); 

export default mongoose.model("courseprogresses", courseProgressSchema);
