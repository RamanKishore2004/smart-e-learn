import React, { useEffect, useState } from 'react';
import {
  BookOpen, Clock, CheckCircle, Calendar, Play
} from 'lucide-react';
import {
  ResponsiveContainer, CartesianGrid, Tooltip, XAxis, YAxis, BarChart, Bar
} from 'recharts';

const Dashboard = () => {
  const allCourses = [
    { id: 1, title: 'Python for Beginners', instructor: 'Dr. James Wilson', nextLesson: 'Loops & Conditions', dueDate: 'Aug 18, 2025', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=64&h=64&fit=crop' },
    { id: 2, title: 'React Complete Course', instructor: 'Sarah Johnson', nextLesson: 'Hooks & Context', dueDate: 'Aug 20, 2025', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=64&h=64&fit=crop' },
    { id: 3, title: 'Data Science Fundamentals', instructor: 'Alan Smith', nextLesson: 'Data Cleaning', dueDate: 'Aug 22, 2025', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=64&h=64&fit=crop' },
    { id: 4, title: 'UI/UX Design Masterclass', instructor: 'Laura Green', nextLesson: 'Prototyping', dueDate: 'Aug 25, 2025', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=64&h=64&fit=crop' },
    { id: 5, title: 'Digital Marketing Strategy', instructor: 'Tom Brown', nextLesson: 'SEO Basics', dueDate: 'Aug 27, 2025', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=64&h=64&fit=crop' },
    { id: 6, title: 'Node.js Backend Development', instructor: 'Emily White', nextLesson: 'Express.js Routing', dueDate: 'Aug 30, 2025', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=64&h=64&fit=crop' }
  ];

  const upcomingAssignments = [
    { id: 1, title: 'Python Mini Project', course: 'Python for Beginners', dueDate: 'Aug 22, 2025', priority: 'high' },
    { id: 2, title: 'React API Integration', course: 'React Complete Course', dueDate: 'Aug 25, 2025', priority: 'medium' }
  ];

  const [completedCourses, setCompletedCourses] = useState([]);

  // ✅ Load completed courses from localStorage
  useEffect(() => {
    const completed = allCourses.filter(course =>
      localStorage.getItem(`course_${course.id}_completed`) === "true"
    ).map(c => c.id);
    setCompletedCourses(completed);
  }, []);


  const stats = [
    { icon: BookOpen, label: 'Courses', value: allCourses.length, color: 'primary' },
    { icon: CheckCircle, label: 'Completed Courses', value: completedCourses.length, color: 'success' },
    { icon: Clock, label: 'Study Hours', value: completedCourses.length * 3, color: 'info' }
  ];



  // ✅ Completed Assignments = courses completed
  const completedAssignments = allCourses
    .filter(course => completedCourses.includes(course.id))
    .map((c, idx) => ({
      id: idx + 100,
      title: `${c.title} Final Assignment`,
      course: c.title,
      dueDate: "Completed",
      priority: "success"
    }));

  // ✅ Performance Data (Bar Graph)
  const performanceData = allCourses.map(course => ({
    course: course.title,
    progress: completedCourses.includes(course.id) ? 80 : 0
  }));

  return (
      <div className="container py-5">
        <div className="mb-4">
          <h1 className="display-6 fw-bold">Welcome back 👋</h1>
          <p className="text-muted">Here's your learning progress and performance</p>
        </div>

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
                  <div className={`d-flex align-items-center justify-content-center rounded-circle text-white bg-${stat.color} p-3`}>
                    <stat.icon size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Courses & Assignments */}
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card shadow-sm rounded-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">My Courses</h5>
                </div>
                {allCourses.map(course => {
                  const isCompleted = completedCourses.includes(course.id);
                  return (
                    <div className="mb-4" key={course.id}>
                      <div className="d-flex">
                        <img src={course.image} alt={course.title} className="rounded me-3" width="64" height="64" />
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{course.title}</div>
                          <div className="small text-muted mb-1">by {course.instructor}</div>
                          <div className="small d-flex justify-content-between">
                            <span>{isCompleted ? "80%" : "0%"} Complete</span>
                            <span className="text-muted">Due: {course.dueDate}</span>
                          </div>
                          <div className="progress mt-1 rounded-pill" style={{ height: '6px' }}>
                            <div className={`progress-bar ${isCompleted ? "bg-success" : "bg-primary"} rounded-pill`} style={{ width: `${isCompleted ? 80 : 0}%` }}></div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <span className="small text-muted">Next: {course.nextLesson}</span>
                            <button className="btn btn-sm btn-gradient d-flex align-items-center rounded-pill">
                              <Play size={14} className="me-1" /> {isCompleted ? "Review" : "Continue"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Assignments */}
          <div className="col-lg-6">
            <div className="card shadow-sm rounded-3 mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Upcoming Assignments</h5>
                {upcomingAssignments.map(assign => (
                  <div className="mb-3" key={assign.id}>
                    <div className="border rounded-3 p-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="fw-semibold">{assign.title}</div>
                        <span className={`badge bg-${assign.priority === 'high' ? 'danger' : assign.priority === 'medium' ? 'warning' : 'success'}`}>
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

            {/* Completed Assignments */}
            <div className="card shadow-sm rounded-3">
              <div className="card-body">
                <h5 className="card-title mb-3">Completed Courses</h5>
                {completedAssignments.length === 0 && <p className="text-muted">No assignments completed yet.</p>}
                {completedAssignments.map(assign => (
                  <div className="mb-3" key={assign.id}>
                    <div className="border rounded-3 p-3 bg-light">
                      <div className="fw-semibold">{assign.title}</div>
                      <div className="small text-muted">{assign.course}</div>
                      <span className="badge bg-success">Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Graph */}
        <div className="card shadow-sm mt-4 rounded-3">
          <div className="card-body">
            <h5 className="card-title mb-3">Performance Overview</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" />
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

export default Dashboard;
