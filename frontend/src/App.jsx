import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/DashboardPage";
import Courses from "./pages/CoursePage";
import Instructors from "./pages/InstructorPage";
import Assignments from "./pages/AssignmentsPage";
import Contact from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage.jsx";
import StaffLayout from "./components/StaffLayout";
import Layout from "./components/Layout.jsx";
import Loginpage from "./Entrypages/Loginpage";
import Signuppage from "./Entrypages/Registerpage";
import VideoCoursePage from "./pages/CourseDetails";
import QuizPage from "./pages/AssignmentQuiz";
import StaffHomePage from "./Staffpages/StaffHomePage";
import AdminLayout from "./components/AdminLayout.jsx"
import StaffProfile from "./Staffpages/StaffProfilePage.jsx";
import StaffProgress from "./Staffpages/TrackProgressPage.jsx";

// ✅ New admin-specific pages
import AdminCoursePage from "./Adminpages/AdminCourses.jsx";


// --- Auth helpers ---
const isAuthenticated = () => !!localStorage.getItem("token");
const getRole = () => localStorage.getItem("role");

// --- Protected Route ---
const ProtectedRoute = ({ children, roles }) => {
  const role = getRole();
  if (!isAuthenticated()) return <Navigate to="/login" />;
  if (roles && !roles.includes(role)) return <Navigate to="/unauthorized" />;
  return children;
};

// --- Public Route ---
const PublicRoute = ({ children }) =>
  isAuthenticated() ? (
    <Navigate
      to={`/${
        getRole() === "staff"
          ? "staff/home"
          : getRole() === "admin"
          ? "admin/home"
          : "home"
      }`}
    />
  ) : (
    children
  );

// --- App ---
const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><Loginpage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signuppage /></PublicRoute>} />
      <Route path="/" element={<Navigate to="/login" />} />

      {/* USER ROUTES */}
      <Route
        path="/home"
        element={
          <ProtectedRoute roles={["user"]}>
            <Layout><HomePage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute roles={["user"]}>
            <Layout><Courses /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute roles={["user"]}>
            <Layout><VideoCoursePage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute roles={["user"]}>
            <Layout><ProfilePage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructors"
        element={
          <ProtectedRoute roles={["user"]}>
            <Layout><Instructors /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assignments"
        element={
          <ProtectedRoute roles={["user"]}>
            <Layout><Assignments /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz"
        element={
          <ProtectedRoute roles={["user"]}>
            <QuizPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <ProtectedRoute roles={["user"]}>
            <Layout><Contact /></Layout>
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin/home"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminLayout><HomePage /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminLayout><AdminCoursePage /></AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminLayout><ProfilePage /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/instructors"
        element={
          <ProtectedRoute roles={["admin"]}>
           <AdminLayout><Instructors /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/assignments"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminLayout><Assignments /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/contact"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminLayout><Contact /></AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* STAFF ROUTES */}
      <Route
        path="/staff/home"
        element={
          <ProtectedRoute roles={["staff"]}>
            <StaffLayout><StaffHomePage /></StaffLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/profile"
        element={
          <ProtectedRoute roles={["staff"]}>
            <StaffLayout><StaffProfile /></StaffLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/progress"
        element={
          <ProtectedRoute roles={["staff"]}>
            <StaffLayout><StaffProgress /></StaffLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
