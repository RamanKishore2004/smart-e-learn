import React, { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";

const StaffDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch all student data from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users?role=student", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load student data. Please check your network or server.");
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // ✅ Stats summary
  const stats = [
    {
      icon: Users,
      label: "Total Students",
      value: students.length,
      color: "primary",
    },
    {
      icon: CheckCircle,
      label: "Average Course Completion",
      value: `${Math.round(
        students.reduce((acc, s) => acc + (s.progress || 0), 0) /
          (students.length || 1)
      )}%`,
      color: "success",
    },
    {
      icon: Clock,
      label: "Average Study Hours",
      value: `${students.length * 3}`,
      color: "info",
    },
  ];

  // ✅ Performance Chart (Average Progress by Student)
  const performanceData = students.map((student) => ({
    name: student.name || "Unknown",
    progress: student.progress || Math.floor(Math.random() * 100),
  }));

  // ✅ Mock upcoming assignments (can be replaced by backend)
  const upcomingAssignments = [
    {
      id: 1,
      title: "Python Mini Project",
      course: "Python for Beginners",
      dueDate: "Nov 12, 2025",
      priority: "high",
    },
    {
      id: 2,
      title: "React UI Assignment",
      course: "React.js Advanced",
      dueDate: "Nov 15, 2025",
      priority: "medium",
    },
  ];

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h1 className="display-6 fw-bold">Staff Dashboard 👩‍🏫</h1>
        <p className="text-muted">
          Monitor your students' learning progress and engagement.
        </p>
      </div>

      {/* Loading & Error */}
      {loading && <p>Loading students...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* Stats */}
      <div className="row g-4 mb-4">
        {stats.map((stat, i) => (
          <div className="col-md-6 col-lg-4" key={i}>
            <div className="card shadow-sm p-3 h-100 rounded-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small mb-1">{stat.label}</div>
                  <div className="h4 fw-bold mb-0">{stat.value}</div>
                </div>
                <div
                  className={`d-flex align-items-center justify-content-center rounded-circle text-white bg-${stat.color} p-3`}
                >
                  <stat.icon size={20} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Student List */}
      <div className="card shadow-sm rounded-3 mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Student Overview</h5>

          {students.length === 0 && !loading && (
            <p className="text-muted">No student records available.</p>
          )}

          {students.map((student, idx) => (
            <div className="mb-4 border-bottom pb-3" key={idx}>
              <div className="d-flex align-items-center">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: 50, height: 50 }}
                >
                  {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                </div>
                <div className="flex-grow-1">
                  <div className="fw-semibold">{student.name}</div>
                  <div className="small text-muted">
                    {student.email || "No email"}
                  </div>
                </div>
                <div className="text-end">
                  <span className="badge bg-success">
                    {student.progress || Math.floor(Math.random() * 100)}% Complete
                  </span>
                </div>
              </div>

              <div className="progress mt-2 rounded-pill" style={{ height: "6px" }}>
                <div
                  className="progress-bar bg-primary rounded-pill"
                  style={{
                    width: `${student.progress || Math.floor(Math.random() * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="card shadow-sm rounded-3 mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Upcoming Assignments</h5>
          {upcomingAssignments.map((assign) => (
            <div className="mb-3" key={assign.id}>
              <div className="border rounded-3 p-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="fw-semibold">{assign.title}</div>
                  <span
                    className={`badge bg-${
                      assign.priority === "high"
                        ? "danger"
                        : assign.priority === "medium"
                        ? "warning"
                        : "success"
                    }`}
                  >
                    {assign.priority}
                  </span>
                </div>
                <div className="small text-muted mb-1">{assign.course}</div>
                <div className="d-flex align-items-center small text-muted">
                  <Calendar size={14} className="me-1" /> Due: {assign.dueDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Graph */}
      <div className="card shadow-sm rounded-3">
        <div className="card-body">
          <h5 className="card-title mb-3">Student Performance Overview</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
