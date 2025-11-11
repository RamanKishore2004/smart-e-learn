import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";

const AdminCourses = () => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    instructor: "",
    price: "",
    originalPrice: "",
    rating: "",
    students: "",
    duration: "",
    image: "",
    description: "",
    level: "",
    bestseller: false,
    youtubeLink: "",
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

  // ✅ Placeholder image
  const FALLBACK_IMAGE =
    "https://via.placeholder.com/400x250?text=Image+Not+Available";

  // ✅ Fetch all courses
  const fetchCourses = async () => {
    setFetching(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/courses`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to fetch courses (${res.status})`);
      }
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Check console for details.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // ✅ Validate form
  const validateForm = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.category.trim()) return "Category is required";
    if (!form.instructor.trim()) return "Instructor is required";
    if (!form.price.trim()) return "Price is required";
    return null;
  };

  // ✅ Add course
  const handleAddCourse = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in as admin.");
        return;
      }

      const payload = {
        ...form,
        rating: form.rating === "" ? undefined : Number(form.rating),
        students: form.students === "" ? undefined : Number(form.students),
      };

      const res = await fetch(`${API_BASE}/api/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `Failed to add course (${res.status})`);
      }

      const newCourse = await res.json();
      setCourses((prev) => [newCourse, ...prev]);

      setForm({
        title: "",
        category: "",
        instructor: "",
        price: "",
        originalPrice: "",
        rating: "",
        students: "",
        duration: "",
        image: "",
        description: "",
        level: "",
        bestseller: false,
        youtubeLink: "",
      });

      alert("✅ Course added successfully!");
    } catch (err) {
      console.error("Error adding course:", err);
      setError(err.message || "Failed to add course");
      alert("Error adding course: " + (err.message || "see console"));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete course
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in as admin.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/courses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `Failed to delete course (${res.status})`);
      }

      setCourses((prev) => prev.filter((c) => c._id !== id));
      alert("🗑️ Course deleted successfully!");
    } catch (err) {
      console.error("Error deleting course:", err);
      setError(err.message || "Failed to delete course");
      alert("Error deleting course: " + (err.message || "see console"));
    }
  };

  // ✅ Function to extract video ID and handle invalid YouTube links
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <>
      <div
        className="container py-5"
        style={{ fontFamily: "Poppins, Inter, Raleway, sans-serif" }}
      >
        <h2 className="fw-bold text-center mb-4">📚 Admin Course Management</h2>

        {/* ✅ Add Course Form */}
        <form
          onSubmit={handleAddCourse}
          className="card shadow-sm p-4 mb-5 rounded-4 border-0 bg-light"
        >
          <h5 className="mb-3 fw-semibold text-primary">Add New Course</h5>

          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                name="title"
                placeholder="Course Title"
                className="form-control"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <input
                type="text"
                name="category"
                placeholder="Category"
                className="form-control"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <input
                type="text"
                name="instructor"
                placeholder="Instructor"
                className="form-control"
                value={form.instructor}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <input
                type="text"
                name="price"
                placeholder="Price"
                className="form-control"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <input
                type="text"
                name="originalPrice"
                placeholder="Original Price"
                className="form-control"
                value={form.originalPrice}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <input
                type="number"
                name="rating"
                placeholder="Rating"
                className="form-control"
                value={form.rating}
                onChange={handleChange}
                step="0.1"
              />
            </div>

            <div className="col-md-3">
              <input
                type="number"
                name="students"
                placeholder="Students"
                className="form-control"
                value={form.students}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <input
                type="text"
                name="duration"
                placeholder="Duration (e.g., 40 hours)"
                className="form-control"
                value={form.duration}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-9">
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                className="form-control"
                value={form.image}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-12">
              <input
                type="text"
                name="youtubeLink"
                placeholder="YouTube Video Link (embed or watch URL)"
                className="form-control"
                value={form.youtubeLink}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <textarea
                name="description"
                placeholder="Description"
                className="form-control"
                rows="2"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <input
                type="text"
                name="level"
                placeholder="Level (Beginner/Intermediate/Advanced)"
                className="form-control"
                value={form.level}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 d-flex align-items-center">
              <label className="form-check-label me-2 fw-semibold">
                Bestseller:
              </label>
              <input
                type="checkbox"
                name="bestseller"
                checked={form.bestseller}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn btn-primary px-4 rounded-pill fw-semibold"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Course"}
            </button>
          </div>

          {error && <p className="text-danger text-center mt-3">{error}</p>}
        </form>

        {/* ✅ Course List */}
        <div className="row g-4">
          {fetching ? (
            <div className="text-center">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center">No courses found.</div>
          ) : (
            courses.map((course) => {
              const embedUrl = getYouTubeEmbedUrl(course.youtubeLink);
              return (
                <div className="col-md-6 col-lg-4" key={course._id}>
                  <div className="card shadow-sm border-0 rounded-4 h-100">
                    <img
                      src={course.image || FALLBACK_IMAGE}
                      onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                      className="card-img-top"
                      alt={course.title}
                    />
                    <div className="card-body">
                      <h5 className="fw-bold">{course.title}</h5>
                      <p className="small text-muted">{course.category}</p>
                      <p className="text-truncate">{course.description}</p>

                      {/* ✅ YouTube Embed or Fallback */}
                      {embedUrl ? (
                        <iframe
                          width="100%"
                          height="200"
                          src={embedUrl}
                          title={course.title}
                          allowFullScreen
                          onError={(e) => {
                            e.target.outerHTML =
                              '<div class="text-center text-danger py-3 fw-semibold">🎬 Video Not Available</div>';
                          }}
                        ></iframe>
                      ) : (
                        <div className="text-center text-muted py-3 fw-semibold">
                          🎬 Video Not Available
                        </div>
                      )}

                      <div className="d-flex gap-2 mt-3">
                        <button
                          className="btn btn-danger btn-sm rounded-pill"
                          onClick={() => handleDelete(course._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default AdminCourses;
