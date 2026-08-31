import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getInterview,
  submitAnswer,
} from "../services/api";

export default function Interview() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [interview, setInterview] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  // ----------------------------------------
  // LOAD INTERVIEW
  // ----------------------------------------

  useEffect(() => {
    const loadInterview = async () => {
      try {
        setLoading(true);
        setError("");

        const interviewId =
          id ||
          localStorage.getItem(
            "interviewId"
          );

        if (!interviewId) {
          throw new Error(
            "Interview ID not found."
          );
        }

        console.log(
          "Loading interview:",
          interviewId
        );

        const data =
          await getInterview(
            interviewId
          );

        console.log(
          "Flask interview response:",
          data
        );

        /*
          Flask returns:

          {
            success: true,
            interview: {
              id: "...",
              role: "...",
              difficulty: "...",
              questions: [...]
            }
          }
        */

        if (
          !data ||
          !data.interview
        ) {
          throw new Error(
            data?.message ||
            "Interview data not found."
          );
        }

        setInterview(
          data.interview
        );

        localStorage.setItem(
          "interviewId",
          data.interview.id
        );

      } catch (err) {
        console.error(
          "Could not load interview:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Could not load interview."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [id]);

  // ----------------------------------------
  // QUESTIONS
  // ----------------------------------------

  const questions =
    interview?.questions || [];

  const currentQuestion =
    questions[questionIndex];

  // ----------------------------------------
  // SPEAKING
  // ----------------------------------------

  const speakQuestion = (text) => {
    if (!text) {
      return;
    }

    if (
      !window.speechSynthesis
    ) {
      alert(
        "Voice mode is not supported by your browser."
      );

      return;
    }

    // Stop previous speech
    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        text
      );

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => {
      setIsSpeaking(true);
    };

    speech.onend = () => {
      setIsSpeaking(false);
    };

    speech.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(
      speech
    );
  };

  // ----------------------------------------
  // AUTOMATICALLY SPEAK QUESTION
  // ----------------------------------------

  useEffect(() => {
    if (!currentQuestion) {
      return;
    }

    const timer = setTimeout(() => {
      speakQuestion(
        currentQuestion
      );
    }, 700);

    return () => {
      clearTimeout(timer);

      if (
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }

      setIsSpeaking(false);
    };
  }, [
    questionIndex,
    currentQuestion,
  ]);

  // ----------------------------------------
  // STOP SPEAKING
  // ----------------------------------------

  const stopSpeaking = () => {
    if (
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };

  // ----------------------------------------
  // SUBMIT ANSWER
  // ----------------------------------------

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      alert(
        "Please enter your answer first."
      );

      return;
    }

    if (!currentQuestion) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const interviewId =
        id ||
        localStorage.getItem(
          "interviewId"
        );

      console.log(
        "Submitting answer..."
      );

      console.log(
        "Interview ID:",
        interviewId
      );

      console.log(
        "Question index:",
        questionIndex
      );

      console.log(
        "Answer:",
        answer
      );

      /*
        Flask expects:

        POST
        /api/interviews/<id>/answer

        {
          question_index: 0,
          answer: "..."
        }
      */

      const result =
        await submitAnswer(
          interviewId,
          questionIndex,
          answer.trim()
        );

      console.log(
        "Evaluation response:",
        result
      );

      stopSpeaking();

      // Move to next question
      if (
        questionIndex <
        questions.length - 1
      ) {
        setQuestionIndex(
          (previous) =>
            previous + 1
        );

        setAnswer("");

      } else {

        // Interview finished
        navigate(
          `/results/${interviewId}`
        );
      }

    } catch (err) {
      console.error(
        "Submit answer error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Could not submit your answer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------------
  // LOADING
  // ----------------------------------------

  if (loading) {
    return (
      <div className="loading">
        <h2>
          Loading your interview...
        </h2>
      </div>
    );
  }

  // ----------------------------------------
  // ERROR
  // ----------------------------------------

  if (error && !interview) {
    return (
      <div className="error-page">

        <div>

          <h2>
            Could not load interview
          </h2>

          <p
            style={{
              marginTop: "10px",
            }}
          >
            {error}
          </p>

          <button
            className="primary-button"
            style={{
              marginTop: "20px",
            }}
            onClick={() =>
              navigate("/setup")
            }
          >
            Back to Setup
          </button>

        </div>

      </div>
    );
  }

  // ----------------------------------------
  // NO QUESTIONS
  // ----------------------------------------

  if (!currentQuestion) {
    return (
      <div className="error-page">

        <div>

          <h2>
            No interview questions found.
          </h2>

          <button
            className="primary-button"
            style={{
              marginTop: "20px",
            }}
            onClick={() =>
              navigate("/setup")
            }
          >
            Create New Interview
          </button>

        </div>

      </div>
    );
  }

  // ----------------------------------------
  // PROGRESS
  // ----------------------------------------

  const totalQuestions =
    questions.length;

  const progress =
    ((questionIndex + 1) /
      totalQuestions) *
    100;

  // ----------------------------------------
  // PAGE
  // ----------------------------------------

  return (
    <div className="interview-page">

      {/* HEADER */}

      <div className="interview-header">

        <div>

          <div className="section-label">
            AI INTERVIEW
          </div>

          <h1>
            {interview.role}
          </h1>

        </div>

        <div className="ai-live">

          <span></span>

          {isSpeaking
            ? "AI Speaking"
            : "AI Interviewer"}

        </div>

      </div>

      {/* PROGRESS */}

      <div className="progress-wrapper">

        <div className="progress-info">

          <span>
            Question{" "}
            {questionIndex + 1}{" "}
            of{" "}
            {totalQuestions}
          </span>

          <span>
            {Math.round(progress)}%
          </span>

        </div>

        <div className="progress-track">

          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          ></div>

        </div>

      </div>

      {/* MAIN INTERVIEW */}

      <div className="interview-layout">

        {/* AI AVATAR */}

        <div
          className={`avatar-panel ${
            isSpeaking
              ? "speaking"
              : ""
          }`}
        >

          <div className="avatar-container">

            <div className="avatar">

              <div className="avatar-head">

                <div className="hair"></div>

                <div className="face">

                  <div className="eyes">

                    <span></span>
                    <span></span>

                  </div>

                  <div className="nose"></div>

                  <div className="mouth">

                    <span></span>

                  </div>

                </div>

              </div>

              <div className="avatar-body">

                <div className="avatar-neck"></div>

                <div className="avatar-shirt">
                  AI
                </div>

              </div>

            </div>

          </div>

          <div className="avatar-info">

            <strong>
              Alex
            </strong>

            <span>
              AI Interviewer
            </span>

            <div className="avatar-status">

              <span className="status-dot"></span>

              {isSpeaking
                ? "Speaking..."
                : "Ready for your answer"}

            </div>

          </div>

        </div>

        {/* QUESTION PANEL */}

        <div className="question-panel">

          <div className="interview-card">

            <div className="question-label">

              QUESTION{" "}
              {questionIndex + 1}

            </div>

            <h2>
              {currentQuestion}
            </h2>

            {/* VOICE */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "15px",
              }}
            >

              <button
                type="button"
                className={`voice-button ${
                  isSpeaking
                    ? "recording"
                    : ""
                }`}
                onClick={() =>
                  speakQuestion(
                    currentQuestion
                  )
                }
              >
                {isSpeaking
                  ? "🔊 Speaking..."
                  : "🔊 Hear Question"}
              </button>

              {isSpeaking && (
                <button
                  type="button"
                  className="voice-button"
                  onClick={
                    stopSpeaking
                  }
                >
                  ⏹ Stop
                </button>
              )}

            </div>

            {/* ANSWER */}

            <textarea
              value={answer}
              onChange={(e) =>
                setAnswer(
                  e.target.value
                )
              }
              placeholder="Type your answer here..."
              disabled={submitting}
            />

            {/* ACTIONS */}

            <div className="answer-actions">

              <span
                style={{
                  fontSize: "12px",
                  color: "#98a2b3",
                }}
              >
                Take your time and
                answer naturally.
              </span>

              <button
                type="button"
                className="submit-button"
                onClick={
                  handleSubmitAnswer
                }
                disabled={submitting}
              >
                {submitting
                  ? "Evaluating..."
                  : questionIndex <
                    totalQuestions - 1
                  ? "Submit & Next →"
                  : "Finish Interview →"}
              </button>

            </div>

            {error && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "12px",
                  background:
                    "#fee4e2",
                  color: "#b42318",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              >
                {error}
              </div>
            )}

          </div>

          <div className="interview-disclaimer">

            Your answers are evaluated
            using the InterviewMate
            evaluation system.

          </div>

        </div>

      </div>

    </div>
  );
}