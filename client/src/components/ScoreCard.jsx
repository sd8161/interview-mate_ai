import React from "react";

function ScoreCard({
  title,
  score,
  description
}) {

  return (
    <div className="score-card">

      <div className="score-circle">

        <strong>
          {score}
        </strong>

        <span>
          /100
        </span>

      </div>

      <div>

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>

    </div>
  );
}

export default ScoreCard;