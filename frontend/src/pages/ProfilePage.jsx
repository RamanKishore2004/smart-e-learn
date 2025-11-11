import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Layout } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please log in first.");
          return navigate("/login");
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          alert(data.message || "Failed to load profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        alert("Network error");
      }
    }

    fetchProfile();
  }, [navigate]);

  if (!user) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-cover"></div>

      <div className="profile-card">
        <div className="profile-avatar">
          <img
            src={`https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff&size=128`}
            alt="Avatar"
          />
        </div>

        <h2>{user.username}</h2>
        <p className="profile-email">{user.email || "user@example.com"}</p>
        <p className="profile-role">
          <strong>Role:</strong> {localStorage.getItem("role") || "User"}
        </p>

        <div className="profile-bio">
          <h3>About Me</h3>
          <p>
            Hi 👋 I'm {user.username}. I'm part of this learning platform to improve
            my skills and collaborate with others. I enjoy exploring new topics
            and sharing knowledge with my peers.
          </p>
        </div>

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
