import React from "react";

function ProgressBar({
  current,
  total
}) {

  const percentage =
    (current / total) * 100;

  return (
    <div className="progress-wrapper">

      <div className="progress-info">

        <span>
          Question {current} of {total}
        </span>

        <span>
          {Math.round(percentage)}%
        </span>

      </div>

      <div className="progress-track">

        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`
          }}
        />

      </div>

    </div>
  );
}

export default ProgressBar;