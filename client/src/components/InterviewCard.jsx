import React from "react";

function InterviewCard({
  question,
  answer,
  setAnswer,
  onSubmit,
  loading
}) {

  return (
    <div className="interview-card">

      <div className="question-label">
        AI INTERVIEW QUESTION
      </div>

      <h2>
        {question}
      </h2>

      <textarea
        value={answer}
        onChange={(e) =>
          setAnswer(e.target.value)
        }
        placeholder="Type your answer here..."
      />

      <div className="answer-actions">

        <button
          className="submit-button"
          onClick={onSubmit}
          disabled={loading}
        >

          {loading
            ? "Evaluating..."
            : "Submit Answer →"}

        </button>

      </div>

    </div>
  );
}

export default InterviewCard;