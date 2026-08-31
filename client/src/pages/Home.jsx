import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

function Home() {
  return (
    <>
      <Header />

      <main>

        <section className="hero">

          <div className="hero-content">

            <span className="badge">
              AI INTERVIEW PRACTICE
            </span>

            <h1>
              Practice interviews
              <br />
              with your
              <span> AI interviewer.</span>
            </h1>

            <p>
              InterviewMate helps students and fresh
              graduates practice realistic interviews,
              receive instant feedback, and understand
              exactly where they can improve.
            </p>

            <div className="hero-actions">

              <Link
                to="/setup"
                className="primary-button"
              >
                Start Free Interview
              </Link>

              <Link
                to="/dashboard"
                className="secondary-button"
              >
                View Validation
              </Link>

            </div>

            <div className="trust-note">
              No API key required • Free MVP • Instant feedback
            </div>

          </div>

          <div className="hero-avatar">

            <div className="hero-card">

              <div className="mini-message">
                Hi! I'm your AI interviewer.
              </div>

              <div className="mini-message user">
                I'm ready for my interview.
              </div>

              <div className="mini-message">
                Great. Tell me about yourself.
              </div>

            </div>

          </div>

        </section>


        <section className="how-section">

          <span className="section-label">
            HOW IT WORKS
          </span>

          <h2>
            From practice to confidence.
          </h2>

          <div className="feature-grid">

            <div className="feature">

              <span>01</span>

              <h3>
                Choose your role
              </h3>

              <p>
                Select the type of interview you want
                to practice.
              </p>

            </div>

            <div className="feature">

              <span>02</span>

              <h3>
                Interview with AI
              </h3>

              <p>
                Your animated AI interviewer asks
                realistic interview questions.
              </p>

            </div>

            <div className="feature">

              <span>03</span>

              <h3>
                Get feedback
              </h3>

              <p>
                Receive scores for communication,
                technical quality, and relevance.
              </p>

            </div>

          </div>

        </section>


        <section className="problem-section">

          <div>

            <span className="section-label">
              THE PROBLEM
            </span>

            <h2>
              Interview preparation
              shouldn't feel like
              talking to yourself.
            </h2>

          </div>

          <div>

            <p>
              Students often prepare interview answers
              alone using static question lists and videos.
            </p>

            <p>
              InterviewMate turns that passive preparation
              into an interactive conversation with an
              AI interviewer.
            </p>

            <p>
              The MVP measures completed interviews,
              answers submitted, scores, and feedback
              so we can validate whether candidates
              actually find the experience useful.
            </p>

          </div>

        </section>

      </main>
    </>
  );
}

export default Home;