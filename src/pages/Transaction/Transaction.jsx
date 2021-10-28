import React from "react";
import Layout from "../../components/Layout/Layout";
/******************* 
@Purpose : Used for transaction page view
@Parameter : {}
@Author : INIC
******************/
function Transaction() {
  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block">
            <img
              className="round"
              src="assets/images/coming-soon.png"
              alt="avatar"
            />
          </div>
          <footer>
            <div className="footer-text d-flex align-items-centerf justify-content-between">
              <span className="d-block">2020 © IndiaNIC</span>
            </div>
          </footer>
        </div>
      </div>
    </Layout>
  );
}

export default Transaction;
