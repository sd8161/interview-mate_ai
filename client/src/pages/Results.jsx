import React, { useEffect, useState } from "react";

import {
  Link,
  useParams
} from "react-router-dom";

import Header from "../components/Header";
import ScoreCard from "../components/ScoreCard";
import FeedbackForm from "../components/FeedbackForm";

import { getInterview } from "../services/api";

function Results() {

  const { interviewId } = useParams();

  const [interview, setInterview] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadResults = async () => {

      try {

        const data =
          await getInterview(interviewId);

        setInterview(data.interview);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    loadResults();

  }, [interviewId]);


  if (loading) {

    return (
      <div className="loading">
        Preparing your results...
      </div>
    );

  }


  if (!interview) {

    return (
      <div className="error-page">
        Results not found.
      </div>
    );

  }


  const answers = interview.answers || [];

  const average = answers.length
    ? Math.round(
        answers.reduce(
          (sum, item) =>
            sum + item.score,
          0
        ) / answers.length
      )
    : 0;

  const communication = answers.length
    ? Math.round(
        answers.reduce(
          (sum, item) =>
            sum + item.communication,
          0
        ) / answers.length
      )
    : 0;

  const technical = answers.length
    ? Math.round(
        answers.reduce(
          (sum, item) =>
            sum + item.technical,
          0
        ) / answers.length
      )
    : 0;

  const relevance = answers.length
    ? Math.round(
        answers.reduce(
          (sum, item) =>
            sum + item.relevance,
          0
        ) / answers.length
      )
    : 0;


  return (
    <>
      <Header />

      <main className="results-page">

        <div className="results-heading">

          <span className="section-label">
            INTERVIEW COMPLETE
          </span>

          <h1>
            Here's how you performed.
          </h1>

          <p>
            Your AI interviewer analyzed your
            responses across communication,
            technical quality, and relevance.
          </p>

        </div>


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


        <div className="results-section">

          <h2>
            AI Interviewer Feedback
          </h2>

          <ul>

            {answers.map((item, index) => (

              <li key={index}>
                <strong>
                  Q{index + 1}:
                </strong>{" "}
                {item.feedback}
              </li>

            ))}

          </ul>

        </div>


        <FeedbackForm />


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