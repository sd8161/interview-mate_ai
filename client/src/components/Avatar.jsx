import React from "react";

function Avatar({ speaking = false }) {

  return (
    <div
      className={`avatar-container ${
        speaking ? "speaking" : ""
      }`}
    >

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
            INTERVIEW AI
          </div>

        </div>

      </div>

      <div className="avatar-status">

        <span className="status-dot"></span>

        {speaking
          ? "AI interviewer is thinking..."
          : "AI interviewer is ready"}

      </div>

    </div>
  );
}

export default Avatar;