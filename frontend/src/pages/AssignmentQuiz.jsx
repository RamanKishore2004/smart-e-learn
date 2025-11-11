import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AssignmentQuiz = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const subject = query.get("subject");
  const level = query.get("level");

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  // Timer (5 mins default)
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    fetch("../QuestionPage.json")
      .then((res) => res.json())
      .then((data) => {
        const subjectQuestions = data[subject] || [];
        const filtered = subjectQuestions.filter((q) => q.level === level);
        setQuestions(filtered);
      });
  }, [subject, level]);

  // countdown
  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  // 🚀 Save submission in localStorage and backend
  const saveSubmission = async (finalScore) => {
    const submission = {
      subject,
      level,
      score: finalScore,
      total: questions.length,
      date: new Date().toISOString(),
    };

    // ✅ Save locally
    const prev = JSON.parse(localStorage.getItem("submissions") || "[]");
    localStorage.setItem("submissions", JSON.stringify([...prev, submission]));

    // ✅ Also send to backend (with JWT token)
    try {
      const token = localStorage.getItem("token"); // get token
      await fetch(`${import.meta.env.VITE_API_URL}/api/user/save-assignment`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // send token
        },
        body: JSON.stringify(submission),
      });
    } catch (err) {
      console.error("❌ Error saving submission to backend:", err);
    }
  };

  const handleAnswer = () => {
    if (!selected) return;
    let newScore = score;
    if (selected === questions[current].answer) {
      newScore = score + 1;
      setScore(newScore);
    }
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected("");
    } else {
      saveSubmission(newScore);
      setSubmitted(true);
    }
  };

  const handlePrevious = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected("");
    }
  };

  // 🚀 Confirm exit handling
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!submitted) {
        e.preventDefault();
        e.returnValue = ""; // show browser confirm
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [submitted]);

  const confirmExit = () => {
    if (!submitted) {
      setShowConfirmExit(true);
    } else {
      navigate("/assignments");
    }
  };

  const handleConfirmExit = (confirm) => {
    setShowConfirmExit(false);
    if (confirm) {
      saveSubmission(score);
      setSubmitted(true);
    }
  };

  if (!questions.length) {
    return (
      <div
        className="d-flex align-items-center justify-content-center vh-100"
        style={{ backgroundColor: "#81D4FA" }}
      >
        <p className="text-center text-muted fs-5">
          No questions found for {subject} ({level})
        </p>
      </div>
    );
  }

  if (submitted || timeLeft <= 0) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div
        className="d-flex align-items-center justify-content-center vh-100"
        style={{ backgroundColor: "#cae9ff" }}
      >
        <div
          className="card shadow-lg text-center"
          style={{
            maxWidth: "900px",
            width: "100%",
            borderRadius: "20px",
            padding: "2rem",
          }}
        >
          <div
            className="card-header text-white fw-bold"
            style={{ backgroundColor: "#00b4d8", fontSize: "1.3rem" }}
          >
            Quiz Completed
          </div>
          <div className="card-body">
            <h2 className="text-success mb-3 fs-2">🎉 Well Done!</h2>
            <p className="fs-4">
              Your Score: <b>{score}</b> / {questions.length}
            </p>
            <p className="fs-4">
              Percentage: <b>{percent}%</b>
            </p>
            <p
              className={`fs-3 fw-bold ${
                percent >= 50 ? "text-success" : "text-danger"
              }`}
            >
              {percent >= 50 ? "✅ Passed" : "❌ Failed"}
            </p>

            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate("/assignments")}
            >
              Back to Assignments
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format timer
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundColor: "#caf0f8" }}
    >
      <div
        className="card shadow-lg"
        style={{
          maxWidth: "900px",
          width: "100%",
          borderRadius: "20px",
          padding: "2rem",
        }}
      >
        {/* Header */}
        <div
          className="card-header text-white d-flex justify-content-between align-items-center"
          style={{ backgroundColor: "#0077b6", fontSize: "1.3rem", padding: "1rem" }}
        >
          <span className="fw-bold">
            {subject} - {level}
          </span>
          <span>Total Questions: {questions.length}</span>
          <button
            className="btn btn-sm btn-danger ms-3"
            onClick={confirmExit}
          >
            Exit
          </button>
        </div>

        <div className="card-body">
          {/* Timer */}
          <div className="text-end text-danger fw-bold mb-3 fs-5">
            ⏳ {minutes}:{seconds}
          </div>

          {/* Question */}
          <h4 className="mb-4 fw-bold">
            {current + 1}. {questions[current].question}
          </h4>

          {/* Options */}
          <div className="list-group fs-5">
            {questions[current].options.map((option, idx) => (
              <label
                key={idx}
                className={`list-group-item list-group-item-action ${
                  selected === option ? "active" : ""
                }`}
                style={{ padding: "1rem" }}
              >
                <input
                  type="radio"
                  value={option}
                  checked={selected === option}
                  onChange={(e) => setSelected(e.target.value)}
                  className="form-check-input me-2"
                />
                {option}
              </label>
            ))}
          </div>

          {/* Navigation */}
          <div className="d-flex justify-content-between mt-4">
            <button
              onClick={handlePrevious}
              disabled={current === 0}
              className="btn btn-outline-secondary btn-lg px-4"
            >
              Previous
            </button>
            <button
              onClick={handleAnswer}
              className="btn btn-success btn-lg px-4"
            >
              {current === questions.length - 1 ? "Submit Quiz" : "Next"}
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 Confirm Exit Popup */}
      {showConfirmExit && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <h5>Exit Quiz?</h5>
            <p>Do you want to end test and submit your answers?</p>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <button
                className="btn btn-danger"
                onClick={() => handleConfirmExit(true)}
              >
                Yes, Submit
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleConfirmExit(false)}
              >
                No, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentQuiz;
