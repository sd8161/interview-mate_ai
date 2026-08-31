import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">

      <Link
        to="/"
        className="logo"
      >

        <div className="logo-icon">
          AI
        </div>

        <span>
          InterviewMate
        </span>

      </Link>

      <nav>

        <Link to="/">
          Home
        </Link>

        <Link to="/setup">
          Practice
        </Link>

        <Link to="/dashboard">
          Validation
        </Link>

      </nav>

    </header>
  );
}

export default Header;