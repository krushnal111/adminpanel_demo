import React from "react";
import Layout from "../../components/Layout/Layout";

/******************* 
@Purpose : Used for dashboard view
@Parameter : {}
@Author : INIC
******************/
function Dashboard() {
  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block">
            <div className="comming-soon">
              <h2>Coming Soon</h2>
            </div>
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

export default Dashboard;
