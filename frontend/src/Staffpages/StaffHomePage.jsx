import React from 'react';
import { Link } from 'react-router-dom';
import StaffLayout from '../components/StaffLayout';
import { Users, BookOpen, TrendingUp, Shield, Star } from 'lucide-react';

const StaffHomePage = () => {
  const trackedStudents = [
    {
      id: 1,
      name: "John Doe",
      progress: 85,
      course: "Python for Beginners",
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Emily Smith",
      progress: 72,
      course: "React Fundamentals",
      lastActive: "Yesterday"
    },
    {
      id: 3,
      name: "Mark Wilson",
      progress: 90,
      course: "Data Science Basics",
      lastActive: "3 hours ago"
    }
  ];

  return (
    <>

{/* Hero Section */}
<section className="position-relative py-5 overflow-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
  
  <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
    <div className="position-absolute bg-primary rounded-circle opacity-25"
      style={{ width: '24rem', height: '24rem', top: '1rem', right: '2rem', animation: 'float 6s ease-in-out infinite' }} />

    <div className="position-absolute bg-primary rounded-circle opacity-25"
      style={{ width: '12rem', height: '12rem', bottom: '1rem', right: '4rem', animation: 'float 8s ease-in-out infinite', animationDelay: '3s' }} />

    <div className="d-none d-lg-block position-absolute bg-primary rounded-circle opacity-25"
      style={{ width: '8rem', height: '8rem', top: '33%', left: '25%', animation: 'float 6s ease-in-out infinite', animationDelay: '2s' }} />

    <div className="d-none d-lg-block position-absolute bg-primary rounded-circle opacity-25"
      style={{ width: '16rem', height: '16rem', top: '10rem', right: '8rem', animation: 'float 7s ease-in-out infinite', animationDelay: '1s' }} />

    <div className="d-none d-lg-block position-absolute bg-primary rounded-circle opacity-25"
      style={{ width: '6rem', height: '6rem', bottom: '33%', left: '5rem', animation: 'float 7s ease-in-out infinite', animationDelay: '4s' }} />

    <div className="d-none d-lg-block position-absolute bg-primary rounded-circle opacity-25"
      style={{ width: '4rem', height: '4rem', top: '20%', left: '33%', animation: 'float 6s ease-in-out infinite', animationDelay: '1.5s' }} />

    <div className="d-none d-lg-block position-absolute bg-primary rounded-circle opacity-25"
      style={{ width: '5rem', height: '5rem', top: '76%', right: '33%', animation: 'float 8s ease-in-out infinite', animationDelay: '2.5s' }} />

    <div className="d-none d-lg-block position-absolute bg-primary rounded-circle opacity-25"
      style={{ width: '3rem', height: '3rem', bottom: '4%', left: '50%', animation: 'float 7s ease-in-out infinite', animationDelay: '3.5s' }} />
  </div>

  {/* Hero Content */}
  <div className="container position-relative z-1">
    <div className="row align-items-center">
      <div className="col-lg-6 text-start">
        <h1 className="display-4 fw-bold mb-3">
          Welcome, <span className="text-primary">Educator</span> 👋
        </h1>
        <h2 className="h5 fw-semibold mb-3 text-secondary">
          Empower Students with Your Knowledge
        </h2>
        <p className="lead text-muted">
          Manage your students’ progress, create engaging lessons, and guide learners to success with our all-in-one teaching platform.
        </p>

        <div className="d-flex gap-3 mt-4">
          <Link to="/staff/profile" className="btn btn-primary px-4 py-2 rounded-pill shadow-sm">
            View Profile
          </Link>
          
        </div>
      </div>

      <div className="col-lg-6 d-none d-lg-block text-end">
        <img
          src="/assets/heroman.png"
          alt="Staff Teaching"
          className="img-fluid rounded-4 shadow"
          style={{
            maxWidth: "550px",
            marginLeft: "auto"
          }}
        />
      </div>
    </div>
  </div>
</section>


      {/* Staff Description */}
      <section className="py-5 bg-light" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="container text-center">
          <h2 className="fw-bold mb-3">About Your Role</h2>
          <p className="text-muted mb-4">
            As a dedicated educator, you play a vital role in shaping the minds of students. 
            Monitor student performance, assign courses, and provide personalized feedback 
            to ensure every learner achieves their goals.
          </p>

          <div className="row justify-content-center">
            <div className="col-md-4 mb-4">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100">
                <Shield className="text-primary mb-3" size={32} />
                <h5 className="fw-bold mb-2">Trusted Mentor</h5>
                <p className="text-muted">Guide your students with expert insights and track their progress effectively.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100">
                <BookOpen className="text-primary mb-3" size={32} />
                <h5 className="fw-bold mb-2">Curriculum Designer</h5>
                <p className="text-muted">Easily create and manage study materials tailored to your students’ needs.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100">
                <Star className="text-primary mb-3" size={32} />
                <h5 className="fw-bold mb-2">Performance Evaluator</h5>
                <p className="text-muted">Evaluate students’ growth and celebrate their achievements with accurate analytics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Tracking Section */}
      <section className="py-5 bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Student Progress Tracking</h2>
            <p className="text-muted">Monitor the performance and engagement of your students in real time.</p>
          </div>

          <div className="row">
            {trackedStudents.map((student) => (
              <div key={student.id} className="col-md-4 mb-4">
                <div className="card shadow-sm rounded-4 border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: 48, height: 48 }}
                      >
                        <Users size={24} />
                      </div>
                      <div>
                        <h5 className="card-title fw-bold mb-1">{student.name}</h5>
                        <p className="text-muted mb-0 small">{student.course}</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link to="/staff/progress" className="btn btn-primary rounded-pill px-4 py-2">
              View All Students
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 text-center text-white rounded-4 mx-3 my-4" style={{ background: 'linear-gradient(to right, #60a5fa, #3b82f6)', fontFamily: 'Poppins, sans-serif' }}>
        <div className="container">
          <h2 className="fw-bold mb-3">Ready to Inspire More Learners?</h2>
          <p className="mb-4">Continue guiding your students and help them achieve their dreams.</p>
          <Link to="/staff/progress" className="btn btn-light text-primary fw-semibold rounded-pill">
            Manage Students
          </Link>
        </div>
      </section>
    </>
  );
};

export default StaffHomePage;
