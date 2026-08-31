import React, { useEffect, useState } from "react";

import Header from "../components/Header";

import { getAnalytics } from "../services/api";

function Dashboard() {

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadAnalytics = async () => {

      try {

        const response =
          await getAnalytics();

        setData(response.analytics);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    loadAnalytics();

  }, []);


  if (loading) {

    return (
      <div className="loading">
        Loading validation metrics...
      </div>
    );

  }


  return (
    <>
      <Header />

      <main className="dashboard-page">

        <div className="dashboard-heading">

          <span className="section-label">
            PRODUCT VALIDATION
          </span>

          <h1>
            Is InterviewMate useful?
          </h1>

          <p>
            These metrics help us understand
            whether users actually engage with
            the AI interview experience.
          </p>

        </div>


        <div className="metrics-grid">

          <div className="metric-card">

            <span>
              INTERVIEWS STARTED
            </span>

            <strong>
              {data.total_interviews}
            </strong>

          </div>


          <div className="metric-card">

            <span>
              COMPLETED
            </span>

            <strong>
              {data.completed_interviews}
            </strong>

          </div>


          <div className="metric-card">

            <span>
              ANSWERS SUBMITTED
            </span>

            <strong>
              {data.total_answers}
            </strong>

          </div>


          <div className="metric-card">

            <span>
              AVG SCORE
            </span>

            <strong>
              {data.average_score}
            </strong>

          </div>

        </div>


        <section className="validation-section">

          <h2>
            Validation signals
          </h2>

          <div className="validation-grid">

            <div>

              <span>
                COMPLETION RATE
              </span>

              <h3>
                {data.completion_rate}%
              </h3>

              <p>
                Percentage of started interviews
                completed by users.
              </p>

            </div>


            <div>

              <span>
                FEEDBACK RESPONSES
              </span>

              <h3>
                {data.feedback_count}
              </h3>

              <p>
                Users who actively shared their
                opinion about the product.
              </p>

            </div>


            <div>

              <span>
                MEANINGFUL ACTIONS
              </span>

              <h3>
                {data.total_answers}
              </h3>

              <p>
                Interview answers submitted to
                receive personalized feedback.
              </p>

            </div>

          </div>


          <div className="validation-note">

            <strong>
              Initial validation goal
            </strong>

            <p>
              Aim for 20 completed interviews,
              60%+ completion rate, and an average
              user rating of 4/5 during the first
              validation period.
            </p>

          </div>

        </section>

      </main>
    </>
  );
}

export default Dashboard;