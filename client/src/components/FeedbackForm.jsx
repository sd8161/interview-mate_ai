import React, { useState } from "react";

import { submitFeedback } from "../services/api";

function FeedbackForm() {

  const [rating, setRating] =
    useState(0);

  const [comment, setComment] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!rating) {

      alert(
        "Please select a rating."
      );

      return;
    }

    try {

      await submitFeedback(
        rating,
        comment
      );

      setSubmitted(true);

    } catch (error) {

      console.error(error);

      alert(
        "Could not submit feedback."
      );

    }
  };


  if (submitted) {

    return (
      <div className="feedback-success">

        <strong>
          Thank you for helping us validate
          InterviewMate!
        </strong>

        <p>
          Your feedback will help us decide
          what to improve next.
        </p>

      </div>
    );

  }


  return (
    <form
      className="feedback-form"
      onSubmit={handleSubmit}
    >

      <h2>
        Was this useful?
      </h2>

      <p>
        Your feedback directly helps us validate
        whether AI-avatar interviewing is useful.
      </p>


      <div className="rating-buttons">

        {[1, 2, 3, 4, 5].map((number) => (

          <button
            type="button"
            key={number}
            className={
              `rating ${
                rating === number
                  ? "active"
                  : ""
              }`
            }
            onClick={() =>
              setRating(number)
            }
          >
            {number}
          </button>

        ))}

      </div>


      <textarea
        value={comment}
        onChange={(e) =>
          setComment(e.target.value)
        }
        placeholder="What did you like or dislike?"
      />


      <button
        type="submit"
        className="primary-button"
      >
        Send Feedback
      </button>

    </form>
  );
}

export default FeedbackForm;