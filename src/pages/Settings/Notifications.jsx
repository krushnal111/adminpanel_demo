import React from "react";
import Layout from "../../components/Layout/Layout";
/******************* 
@Purpose : Used for notification
@Parameter : {}
@Author : INIC
******************/
function Notifications() {
  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="content-header-title">Email Notification</li>
                <li className="breadcrumb-item">
                  <a href="dashboard.html">
                    <i className="bx bx-home-alt"></i>
                  </a>
                </li>
                <li className="breadcrumb-item">Settings</li>
                <li className="breadcrumb-item active" aria-current="page">
                  Email Notification
                </li>
              </ol>
            </nav>
            <div className="card notification-card">
              <div className="row">
                <div className="col-md-12">
                  <div className="notification-title d-flex align-items-start mb-md-5 mb-4">
                    <div className="icon d-flex align-items-center justify-content-center mr-1">
                      <i className="bx bx-envelope"></i>
                    </div>
                    <div className="text">
                      <h5 className="mb-0">General Notifications</h5>
                      <span className="common-small-text d-block">
                        Notification emails that you would like to receive
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-lg-6">
                  <div className="d-flex align-items-center justify-content-between mb-md-5 mb-4">
                    <div>
                      <h6 className="mb-0">Payouts</h6>
                      <span className="common-small-text d-block">
                        Receive payout notification updates
                      </span>
                    </div>
                    <div className="custom-control custom-switch light">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="switchCheckbox1"
                        checked
                      />
                      <label
                        className="custom-control-label"
                        for="switchCheckbox1"
                      ></label>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-md-5 mb-4">
                    <div>
                      <h6 className="mb-0">Notification Failures</h6>
                      <span className="common-small-text d-block">
                        Get notify if an IPN is failing
                      </span>
                    </div>
                    <div className="custom-control custom-switch light">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="switchCheckbox2"
                      />
                      <label
                        className="custom-control-label"
                        for="switchCheckbox2"
                      ></label>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-md-5 mb-4">
                    <div>
                      <h6 className="mb-0">Refunds</h6>
                      <span className="common-small-text d-block">
                        When a payment gets refunded
                      </span>
                    </div>
                    <div className="custom-control custom-switch light">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="switchCheckbox3"
                        checked
                      />
                      <label
                        className="custom-control-label"
                        for="switchCheckbox3"
                      ></label>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-lg-6">
                  <div className="d-flex align-items-center justify-content-between mb-md-5 mb-4">
                    <div>
                      <h6 className="mb-0">Chargebacks</h6>
                      <span className="common-small-text d-block">
                        New chrgeback and dispute status update
                      </span>
                    </div>
                    <div className="custom-control custom-switch light">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="switchCheckbox4"
                      />
                      <label
                        className="custom-control-label"
                        for="switchCheckbox4"
                      ></label>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-md-5 mb-4">
                    <div>
                      <h6 className="mb-0">New Sale</h6>
                      <span className="common-small-text d-block">
                        for every new sale
                      </span>
                    </div>
                    <div className="custom-control custom-switch light">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="switchCheckbox5"
                        checked
                      />
                      <label
                        className="custom-control-label"
                        for="switchCheckbox5"
                      ></label>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="notification-title d-flex align-items-start mb-md-5 mb-4 mt-md-5 mt-4">
                    <div className="icon d-flex align-items-center justify-content-center mr-1">
                      <i className="bx bx-user"></i>
                    </div>
                    <div className="text">
                      <h5 className="mb-0">Customer Emails</h5>
                      <span className="common-small-text d-block">
                        Notification emails that get sent to your customers
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-lg-6">
                  <div className="d-flex align-items-center justify-content-between mb-md-5 mb-4">
                    <div>
                      <h6 className="mb-0">Receipts</h6>
                      <span className="common-small-text d-block">
                        Cutomers' transaction receipts after each transaction
                      </span>
                    </div>
                    <div className="custom-control custom-switch light">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="switchCheckbox6"
                      />
                      <label
                        className="custom-control-label"
                        for="switchCheckbox6"
                      ></label>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-md-5 mb-4">
                    <div>
                      <h6 className="mb-0">PayPal Failed Payments</h6>
                      <span className="common-small-text d-block">
                        If a PayPal transaction fails
                      </span>
                    </div>
                    <div className="custom-control custom-switch light">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="switchCheckbox7"
                        checked
                      />
                      <label
                        className="custom-control-label"
                        for="switchCheckbox7"
                      ></label>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-md-5 mb-4">
                    <div>
                      <h6 className="mb-0">Subscriptions</h6>
                      <span className="common-small-text d-block">
                        For failed recurring payment attempts or cancellation
                      </span>
                    </div>
                    <div className="custom-control custom-switch light">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="switchCheckbox8"
                        checked
                      />
                      <label
                        className="custom-control-label"
                        for="switchCheckbox8"
                      ></label>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-lg-6">
                  <div className="d-flex align-items-center justify-content-between mb-md-5 mb-4">
                    <div>
                      <h6 className="mb-0">Invoice Shortfall</h6>
                      <span className="common-small-text d-block">
                        If a customer makes a payment in an incorrect amount
                      </span>
                    </div>
                    <div className="custom-control custom-switch light">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="switchCheckbox9"
                        checked
                      />
                      <label
                        className="custom-control-label"
                        for="switchCheckbox9"
                      ></label>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-md-5 mb-4">
                    <div>
                      <h6 className="mb-0">Payment Reminders</h6>
                      <span className="common-small-text d-block">
                        Email customers SEPA / Bank Transfer payment reminders
                      </span>
                    </div>
                    <div className="custom-control custom-switch light">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="switchCheckbox10"
                        checked
                      />
                      <label
                        className="custom-control-label"
                        for="switchCheckbox10"
                      ></label>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="notification-title d-flex align-items-start mb-md-5 mb-4 mt-md-5 mt-4">
                    <div className="icon d-flex align-items-center justify-content-center mr-1">
                      <i className="bx bx-user"></i>
                    </div>
                    <div className="text">
                      <h5 className="mb-0">User Emails</h5>
                      <span className="common-small-text d-block">
                        Notification emails that get sent to your customers
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-lg-6">
                  <div className="d-flex align-items-center justify-content-between mb-md-5 mb-4">
                    <div>
                      <h6 className="mb-0">Login</h6>
                      <span className="common-small-text d-block">
                        Cutomers' transaction receipts after each transaction
                      </span>
                    </div>
                    <div className="custom-control custom-switch light">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="switchCheckbox11"
                      />
                      <label
                        className="custom-control-label"
                        for="switchCheckbox11"
                      ></label>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-md-5 mb-4">
                    <div>
                      <h6 className="mb-0">Signup Notification</h6>
                      <span className="common-small-text d-block">
                        If a PayPal transaction fails
                      </span>
                    </div>
                    <div className="custom-control custom-switch light">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="switchCheckbox12"
                        checked
                      />
                      <label
                        className="custom-control-label"
                        for="switchCheckbox12"
                      ></label>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-lg-6">
                  <div className="d-flex align-items-center justify-content-between mb-md-5 mb-4">
                    <div>
                      <h6 className="mb-0">Delete Account</h6>
                      <span className="common-small-text d-block">
                        If a customer makes a payment in an incorrect amount
                      </span>
                    </div>
                    <div className="custom-control custom-switch light">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="switchCheckbox13"
                        checked
                      />
                      <label
                        className="custom-control-label"
                        for="switchCheckbox13"
                      ></label>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-md-5 mb-4">
                    <div>
                      <h6 className="mb-0">Account Deactivation</h6>
                      <span className="common-small-text d-block">
                        For failed recurring payment attempts or cancellation
                      </span>
                    </div>
                    <div className="custom-control custom-switch light">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="switchCheckbox14"
                        checked
                      />
                      <label
                        className="custom-control-label"
                        for="switchCheckbox14"
                      ></label>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="text-right mt-2">
                    <button className="btn btn-primary">Save Changes</button>
                  </div>
                </div>
              </div>
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

export default Notifications;
