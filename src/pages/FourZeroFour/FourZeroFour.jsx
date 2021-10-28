import React from "react";
import { Link } from "react-router-dom";
/******************* 
@Purpose : Used for page not found view
@Parameter : {}
@Author : INIC
******************/
function FourZeroFour() {
  return (
    <div className="error-page">
      <div className="error-middle">
        <h2>Oops! Page not Found</h2>
        <h1>
          <span className="first-char">4</span>
          <span>0</span>
          <span className="last-char">4</span>
        </h1>
        <p>We can't find the page you're looking for.</p>
        <div className="back-home">
          <Link className="btn btn-primary" href="/project/404">
            Go to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FourZeroFour;
