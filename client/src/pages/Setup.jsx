import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createInterview } from "../services/api";

export default function Setup() {
  const navigate = useNavigate();

  const [role, setRole] = useState(
    "Software Engineer"
  );

  const [difficulty, setDifficulty] =
    useState("Beginner");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleStartInterview = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      console.log("Creating interview...");
      console.log("Role:", role);
      console.log("Difficulty:", difficulty);

      // Flask function expects TWO arguments
      const data = await createInterview(
        role,
        difficulty
      );

      console.log(
        "Flask response:",
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

      const interview =
        data?.interview;

      const interviewId =
        interview?.id;

      console.log(
        "Interview ID:",
        interviewId
      );

      if (!interviewId) {
        throw new Error(
          "Flask did not return an interview ID."
        );
      }

      // Save interview ID
      localStorage.setItem(
        "interviewId",
        interviewId
      );

      // Go to interview page
      navigate(
        `/interview/${interviewId}`
      );

    } catch (err) {
      console.error(
        "Create interview error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Could not create interview."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-page">

      <div className="setup-container">

        <div className="setup-heading">

          <div className="section-label">
            INTERVIEW SETUP
          </div>

          <h1>
            Configure your interview
          </h1>

          <p>
            Choose your role and difficulty.
            Your AI interviewer will ask
            questions and evaluate your
            responses.
          </p>

        </div>

        <div className="setup-card">

          <form
            onSubmit={
              handleStartInterview
            }
          >

            <label>
              Job Role

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
              >

                <option value="Software Engineer">
                  Software Engineer
                </option>

                <option value="Data Scientist">
                  Data Scientist
                </option>

                <option value="Frontend Developer">
                  Frontend Developer
                </option>

              </select>

            </label>

            <label>
              Difficulty

              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(
                    e.target.value
                  )
                }
              >

                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>

              </select>

            </label>

            <div className="ai-notice">

              <strong>
                🤖 AI Interviewer
              </strong>

              <p>
                Your AI interviewer will
                ask role-specific questions
                and speak each question
                aloud using your browser's
                built-in voice technology.
              </p>

            </div>

            {error && (
              <div
                style={{
                  padding: "12px",
                  marginBottom: "20px",
                  borderRadius: "8px",
                  background: "#fee4e2",
                  color: "#b42318",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="primary-button full-width"
              disabled={loading}
            >
              {loading
                ? "Creating Interview..."
                : "Start AI Interview →"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}