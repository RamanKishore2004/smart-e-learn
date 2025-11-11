import React, { useEffect, useState } from "react";

export default function TrackProgressPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/staff/track-progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setStudents(data);
        else alert(data.message || "Failed to load progress");
      } catch (err) {
        console.error("Progress fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, []);

  if (loading) return <div className="loading">Loading progress...</div>;

  return (
    <div className="track-container">
      <h2>📊 Student Progress Overview</h2>
      <p className="track-subtitle">Monitor students’ completed courses and assignments.</p>

      <div className="track-table">
        <table>
          <thead>
            <tr>
              <th>Student Email</th>
              <th>Completed Courses</th>
              <th>Assignments</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="3">No students found</td>
              </tr>
            ) : (
              students.map((student, i) => (
                <tr key={i}>
                  <td>{student.username}</td>
                  <td>
                    {student.completedCourses && student.completedCourses.length > 0 ? (
                      <ul>
                        {student.completedCourses.map((c, idx) => (
                          <li key={idx}>{c.title}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="empty">No courses yet</span>
                    )}
                  </td>
                  <td>
                    {student.assignments && student.assignments.length > 0 ? (
                      <ul>
                        {student.assignments.map((a, idx) => (
                          <li key={idx}>
                            {a.subject} ({a.level}) — <strong>{a.score}</strong>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="empty">No assignments yet</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
