import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  FileText,
  Star,
  PlayCircle,
} from "lucide-react";
import {
  formatDistanceToNow,
  parse,
  format,
} from "date-fns";
import { useNavigate } from "react-router-dom";

// ✅ Courses with Levels
const COURSES = [
  { subject: "Python", instructor: "Dr. James Wilson" },
  { subject: "React", instructor: "Sarah Johnson" },
  { subject: "Node.js", instructor: "Emily Davis" },
  { subject: "Data Science", instructor: "Dr. Michael Chen" },
  { subject: "Business Analyst", instructor: "John Carter" },
];

const LEVELS = ["Beginner", "Intermediate"];

const AssignmentCard = ({ data, activeTab, onStart }) => {
  const {
    title,
    course,
    instructor,
    dueDate,
    submittedDate,
    completedDate,
    grade,
    description,
    points,
    maxPoints,
  } = data;

  const timeLeft =
    activeTab === "pending" && dueDate
      ? formatDistanceToNow(parse(dueDate, "MMM d, yyyy", new Date()), {
          addSuffix: true,
        })
      : null;

  return (
    <div className="col-12">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 className="card-title fw-semibold mb-1">{title}</h5>
              <div className="text-muted small">
                {course} | {instructor}
              </div>
            </div>
            {grade && <span className="badge bg-success fs-6">{grade}</span>}
          </div>

          {description && <p className="card-text mb-2">{description}</p>}

          <div className="d-flex flex-wrap gap-3 text-muted small">
            {dueDate && (
              <div>
                <CalendarIcon size={16} className="me-1" /> Due: {dueDate}
              </div>
            )}
            {submittedDate && (
              <div>
                <CheckCircle size={16} className="me-1" /> Submitted:{" "}
                {submittedDate}
              </div>
            )}
            {completedDate && (
              <div>
                <Star size={16} className="me-1 text-warning" /> Completed:{" "}
                {completedDate}
              </div>
            )}
            {timeLeft && (
              <div>
                <Clock size={16} className="me-1 text-info" /> {timeLeft}
              </div>
            )}
            <div>
              <FileText size={16} className="me-1" /> {points}
              {maxPoints && ` / ${maxPoints}`} points
            </div>
          </div>
        </div>

        <div className="card-footer bg-transparent border-top-0 text-end">
          {activeTab === "pending" && (
            <button
              className="btn btn-gradient px-4 py-2 rounded-pill"
              onClick={onStart}
            >
              <PlayCircle size={16} className="me-1" /> Start Assessment
            </button>
          )}
          {activeTab === "submitted" && (
            <button className="btn btn-outline-secondary px-4 py-2 rounded-pill">
              View Submission
            </button>
          )}
          {activeTab === "completed" && (
            <button className="btn btn-outline-success px-4 py-2 rounded-pill">
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Assignments = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [todaySubmissions, setTodaySubmissions] = useState([]);
  const [completedAssessments, setCompletedAssessments] = useState([]);
  const [filteredCompleted, setFilteredCompleted] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const today = format(new Date(), "yyyy-MM-dd");

    // ✅ Generate daily assignments (all courses + Beginner & Intermediate)
    const generatedAssignments = [];
    COURSES.forEach((course) => {
      LEVELS.forEach((level) => {
        generatedAssignments.push({
          id: `${course.subject}-${level}-${today}`,
          title: `${course.subject} ${level} Assessment`,
          course: course.subject,
          instructor: course.instructor,
          dueDate: "Dec 31, 2025",
          priority: "high",
          description: `Daily ${course.subject} (${level}) challenge.`,
          points: 50,
          subject: course.subject,
          level,
        });
      });
    });

    // ✅ Load submissions from localStorage
    const storedSubmissions = JSON.parse(
      localStorage.getItem("submissions") || "[]"
    );

    const todaySubs = storedSubmissions
      .filter((s) => s.date.split("T")[0] === today)
      .map((sub, idx) => ({
        id: `today-${idx + 1}`,
        title: `${sub.subject} ${sub.level} Assessment`,
        course: sub.subject,
        instructor: "AI Auto-Grader",
        submittedDate: new Date(sub.date).toLocaleString(),
        completedDate: new Date(sub.date).toLocaleString(),
        grade: `${sub.score} / ${sub.total}`,
        description: `You scored ${sub.score} out of ${sub.total}.`,
        points: sub.score,
        maxPoints: sub.total,
        subject: sub.subject,
        level: sub.level,
      }));

    const allCompleted = storedSubmissions.map((sub, idx) => ({
      id: `sub-${idx + 1}`,
      title: `${sub.subject} ${sub.level} Assessment`,
      course: sub.subject,
      instructor: "AI Auto-Grader",
      submittedDate: new Date(sub.date).toLocaleString(),
      completedDate: new Date(sub.date).toLocaleDateString(),
      grade: `${sub.score} / ${sub.total}`,
      description: `You scored ${sub.score} out of ${sub.total}.`,
      points: sub.score,
      maxPoints: sub.total,
      subject: sub.subject,
      level: sub.level,
      rawDate: sub.date.split("T")[0],
    }));

    // Pending = generated - today’s submissions
    const pending = generatedAssignments.filter(
      (a) =>
        !todaySubs.find(
          (s) => s.subject === a.subject && s.level === a.level
        )
    );

    setPendingAssignments(pending);
    setTodaySubmissions(todaySubs);
    setCompletedAssessments(allCompleted);
    setFilteredCompleted(allCompleted);
  }, []);

  // ✅ Filter completed by calendar date
  const handleDateChange = (e) => {
    const value = e.target.value;
    setSelectedDate(value);

    if (!value) {
      setFilteredCompleted(completedAssessments);
    } else {
      setFilteredCompleted(
        completedAssessments.filter((c) => c.rawDate === value)
      );
    }
  };

  const assignments = {
    pending: pendingAssignments,
    submitted: todaySubmissions,
    completed: filteredCompleted,
  };

  const tabNames = {
    pending: "Pending",
    submitted: "Submitted (Today)",
    completed: "Completed (All)",
  };

  return (
  <>
      <style>{`
        .btn-gradient {
          background: linear-gradient(90deg, #60a5fa, #3b82f6);
          color: #fff;
          border: none;
        }
        .btn-gradient:hover {
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
        }
      `}</style>

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h1 className="h3 fw-bold text-primary">Assignments</h1>
            <p className="text-muted">
              Track your assignments, submissions, and grades
            </p>
          </div>

          {/* ✅ Calendar filter only for Completed tab */}
          {activeTab === "completed" && (
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={handleDateChange}
              style={{ maxWidth: "200px" }}
            />
          )}
        </div>

        {/* Tabs */}
        <ul className="nav nav-pills mb-4 gap-2">
          {Object.keys(tabNames).map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tabNames[tab]} ({assignments[tab]?.length || 0})
              </button>
            </li>
          ))}
        </ul>

        {/* Assignment Cards */}
        <div className="row gy-4">
          {assignments[activeTab].length === 0 && (
            <div className="text-center py-5">
              <FileText size={40} className="text-secondary" />
              <h4>No assignments found</h4>
            </div>
          )}

          {assignments[activeTab].map((a) => (
            <AssignmentCard
              key={a.id}
              data={a}
              activeTab={activeTab}
              onStart={() =>
                navigate(
                  `/quiz?subject=${encodeURIComponent(
                    a.subject
                  )}&level=${encodeURIComponent(a.level)}`
                )
              }
            />
          ))}
        </div>
      </div>
</>
  );
};

export default Assignments;
