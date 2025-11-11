import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, BarChart2, User, LogOut, BookOpen, Menu, X } from "lucide-react";

export default function StaffLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: "Home", href: "/staff/home", icon: Home },
    { name: "TrackProgress", href: "/staff/progress", icon: BarChart2 },
    { name: "Profile", href: "/staff/profile", icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  const logout = () => {
    localStorage.clear();
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-expand-md bg-white border-bottom shadow-sm sticky-top rounded-bottom px-4 py-2">
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between w-100">
            {/* Logo */}
            <Link to="/staff/home" className="navbar-brand d-flex align-items-center gap-2">
              <div
                className="bg-primary text-white rounded d-flex align-items-center justify-content-center"
                style={{ width: 32, height: 32 }}
              >
                <BookOpen size={18} />
              </div>
              <span className="fw-bold">SmartLearn Staff</span>
            </Link>

            {/* Mobile Controls */}
            <div className="d-md-none d-flex align-items-center gap-2">
              <button
                className="btn btn-light rounded-circle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Collapsible Navbar */}
          <div
            className={`collapse navbar-collapse mt-3 mt-md-0 ${
              isMobileMenuOpen ? "show" : ""
            }`}
          >
            <ul className="navbar-nav me-auto mb-2 mb-md-0 gap-md-4 gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li className="nav-item w-100" key={item.name}>
                    <Link
                      to={item.href}
                      className={`nav-link d-flex align-items-center gap-2 px-3 py-2 rounded ${
                        isActive(item.href)
                          ? "active fw-semibold text-primary bg-light"
                          : "text-dark"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon size={16} />
                      <span className="d-md-inline d-none">{item.name}</span>
                      <span className="d-md-none">{item.name.substring(0, 6)}…</span>
                    </Link>
                  </li>
                );
              })}

              {/* Logout - Mobile only */}
              <li className="nav-item d-md-none w-100">
                <button
                  onClick={logout}
                  className="nav-link text-danger d-flex align-items-center gap-2 px-3 py-2 rounded w-100"
                  style={{ border: "none", background: "none" }}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </li>
            </ul>

            {/* Desktop controls */}
            <div className="d-none d-md-flex align-items-center gap-3 ms-auto">
              <button
                onClick={logout}
                className="btn btn-light position-relative rounded-circle text-danger"
                title="Logout"
              >
                <LogOut size={16} />
              </button>

              
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-grow-1">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-top mt-auto py-4 rounded-top">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="d-flex align-items-center mb-2">
                <div
                  className="bg-primary text-white rounded d-flex align-items-center justify-content-center me-2"
                  style={{ width: 32, height: 32 }}
                >
                  <BookOpen size={18} />
                </div>
                <span className="fw-bold">SmartLearn Staff</span>
              </div>
              <p className="text-muted">
                Manage student progress, assist in learning, and monitor performance with SmartLearn.
              </p>
            </div>

            <div className="col-md-3 mb-4">
              <h5 className="fw-semibold">Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/staff/home" className="text-muted text-decoration-none">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/staff/progress" className="text-muted text-decoration-none">
                    Track Progress
                  </Link>
                </li>
                <li>
                  <Link to="/staff/profile" className="text-muted text-decoration-none">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-md-3 mb-4">
              <h5 className="fw-semibold">Support</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#" className="text-muted text-decoration-none">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted text-decoration-none">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted text-decoration-none">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-top pt-3 text-center text-muted">
            &copy; 2024 SmartLearn Staff Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
