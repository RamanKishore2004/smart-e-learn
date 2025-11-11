import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function StaffProfilePage() {
  const [staff, setStaff] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please log in first.");
          return navigate("/login");
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/staff/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) setStaff(data);
        else alert(data.message || "Failed to load profile");
      } catch (err) {
        console.error("Staff profile fetch error:", err);
        alert("Network error");
      }
    }

    fetchProfile();
  }, [navigate]);

  if (!staff) return <div className="loading">Loading staff profile...</div>;

  return (
    <div className="profile-container">
      {/* Background Cover */}
      <div className="profile-cover"></div>

      {/* Profile Card */}
      <div className="profile-card">
        {/* Avatar */}
        <div className="profile-avatar">
          <img
            src={`https://ui-avatars.com/api/?name=${staff.name}&background=0D8ABC&color=fff&size=128`}
            alt="Avatar"
          />
        </div>

        {/* Basic Info */}
        <h2>{staff.name}</h2>
        <p className="profile-email">{staff.email}</p>
        <p className="profile-role">
          <strong>Role:</strong> {staff.role}
        </p>

        {/* Extra Staff Info */}
        <div className="profile-details">
          <p>
            <strong>Department:</strong> {staff.department || "Not Assigned"}
          </p>
          <p>
            <strong>Joined Date:</strong>{" "}
            {new Date(staff.joinedDate).toLocaleDateString()}
          </p>
        </div>

        {/* About Section */}
        <div className="profile-bio">
          <h3>About Me</h3>
          <p>
            Hello 👋 I'm <strong>{staff.name}</strong>, part of the SmartLearn
            academic team. I work in the{" "}
            <strong>{staff.department}</strong> department and help students
            enhance their learning experience through active guidance and
            progress tracking.
          </p>
        </div>

        {/* Buttons */}
        <div className="profile-buttons">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
