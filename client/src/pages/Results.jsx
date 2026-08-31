import React, { useEffect, useState } from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import Header from "../components/Header";
import ScoreCard from "../components/ScoreCard";
import FeedbackForm from "../components/FeedbackForm";

import { getInterview } from "../services/api";

function Results() {
  const { interviewId } = useParams();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "Loading results for interview:",
          interviewId
        );

        if (!interviewId) {
          throw new Error(
            "Interview ID is missing."
          );
        }

        const data = await getInterview(
          interviewId
        );

        console.log(
          "Flask results response:",
          data
        );

        if (
          !data ||
          !data.success ||
          !data.interview
        ) {
          throw new Error(
            data?.message ||
              "Interview results not found."
          );
        }

        setInterview(data.interview);

      } catch (error) {
        console.error(
          "Could not load results:",
          error
        );

        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Could not load interview results."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [interviewId]);

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <div className="loading">
        <h2>
          Preparing your results...
        </h2>
      </div>
    );
  }

  // -----------------------------------------
  // ERROR
  // -----------------------------------------

  if (error || !interview) {
    return (
      <>
        <Header />

        <div className="error-page">
          <div>
            <h2>
              Results not found
            </h2>

            <p
              style={{
                marginTop: "10px",
                color: "#667085",
              }}
            >
              {error ||
                "We could not find this interview."}
            </p>

            <button
              className="primary-button"
              style={{
                marginTop: "20px",
              }}
              onClick={() =>
                window.location.href =
                  "/setup"
              }
            >
              Start New Interview
            </button>
          </div>
        </div>
      </>
    );
  }

  // -----------------------------------------
  // ANSWERS
  // -----------------------------------------

  const answers = interview.answers || [];

  // -----------------------------------------
  // CALCULATE SCORES
  // -----------------------------------------

  const calculateAverage = (field) => {
    if (!answers.length) {
      return 0;
    }

    const total = answers.reduce(
      (sum, item) => {
        return (
          sum +
          Number(item[field] || 0)
        );
      },
      0
    );

    return Math.round(
      total / answers.length
    );
  };

  const average =
    calculateAverage("score");

  const communication =
    calculateAverage("communication");

  const technical =
    calculateAverage("technical");

  const relevance =
    calculateAverage("relevance");

  // -----------------------------------------
  // PAGE
  // -----------------------------------------

  return (
    <>
      <Header />

      <main className="results-page">

        {/* HEADING */}

        <div className="results-heading">

          <span className="section-label">
            INTERVIEW COMPLETE
          </span>

          <h1>
            Here's how you performed.
          </h1>

          <p>
            Your AI interviewer analyzed
            your responses across
            communication, technical
            quality, and relevance.
          </p>

        </div>

        {/* OVERALL SCORE */}

        <div className="overall-score">

          <div className="big-score">
            {average}
            <span>/100</span>
          </div>

          <div>

            <h2>
              Overall Interview Score
            </h2>

            <p>
              {average >= 80
                ? "Excellent performance. You are showing strong interview readiness."
                : average >= 65
                ? "Good foundation. A little more structured practice can improve your confidence."
                : "Keep practicing. Focus on giving detailed examples and explaining your reasoning."}
            </p>

          </div>

        </div>

        {/* SCORE CARDS */}

        <div className="score-grid">

          <ScoreCard
            title="Communication"
            score={communication}
            description="Clarity and structure of your answers."
          />

          <ScoreCard
            title="Technical"
            score={technical}
            description="Depth and quality of your technical response."
          />

          <ScoreCard
            title="Relevance"
            score={relevance}
            description="How directly your answer addressed the question."
          />

          <ScoreCard
            title="Consistency"
            score={average}
            description="Overall consistency across the interview."
          />

        </div>

        {/* FEEDBACK */}

        <div className="results-section">

          <h2>
            AI Interviewer Feedback
          </h2>

          {answers.length === 0 ? (

            <p
              style={{
                color: "#667085",
              }}
            >
              No answers were recorded
              for this interview.
            </p>

          ) : (

            <ul>

              {answers.map(
                (item, index) => (

                  <li key={index}>

                    <strong>
                      Q{index + 1}:
                    </strong>{" "}

                    {item.feedback ||
                      "No feedback available."}

                  </li>

                )
              )}

            </ul>

          )}

        </div>

        {/* FEEDBACK FORM */}

        <FeedbackForm />

        {/* ACTIONS */}

        <div className="results-actions">

          <Link
            to="/setup"
            className="primary-button"
          >
            Practice Again
          </Link>

          <Link
            to="/dashboard"
            className="secondary-button"
          >
            View Validation Metrics
          </Link>

        </div>

      </main>
    </>
  );
}

export default Results;