import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Loginpage() {
  const [loginType, setLoginType] = useState("user"); // "user" | "staff" | "admin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

async function handleLogin(e) {
  e.preventDefault();
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,
        password,
        role: loginType, // ✅ send role too
      }),
    });

    const data = await res.json();

if (res.ok) {
  const normalizedRole = loginType.toLowerCase();
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", normalizedRole);
  localStorage.setItem("loginInfo", JSON.stringify({
    type: normalizedRole,
    email,
    loginTime: new Date().toISOString(),
  }));

  alert(`✅ Logged in as ${normalizedRole.toUpperCase()}!`);

  if (normalizedRole === "admin") navigate("/admin/home");
  else if (normalizedRole === "staff") navigate("/staff/home");
  else navigate("/home");
}

  } catch (err) {
    console.error("Login error:", err);
    alert("❌ Network error");
  }
}



  return (
    <div className="login-container">
      <div className="login-content">
        {/* Left welcome section */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h1>WELCOME</h1>
            <h2>YOUR HEADLINE NAME</h2>
            <p>
              Empower your learning journey with personalized courses, assignments, and collaboration tools.
              Let’s continue where you left off.
            </p>
          </div>
          <div className="geometric-shape-1"></div>
          <div className="geometric-shape-2"></div>
        </div>

        {/* Right form section */}
        <div className="form-section">
          <form className="form-container" onSubmit={handleLogin}>
            <h2>Sign in</h2>
            <p className="form-subtitle">Select your role and enter credentials.</p>

            {/* Sliding tabs */}
            <div className="login-type-tabs">
              {["user", "staff", "admin"].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`tab-btn ${loginType === type ? "active" : ""}`}
                  onClick={() => setLoginType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Email */}
            <div className="input-group">
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="email"
                  placeholder={`${loginType.charAt(0).toUpperCase() + loginType.slice(1)} Username`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className="sign-in-btn">Sign in</button>

            {/* Divider & Signup link (for users only) */}
            {loginType === "user" && (
              <>
                <div className="divider"><span>Or</span></div>
                <div className="sign-up-link">
                  Don’t have an account? <Link to="/signup">Sign up</Link>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
