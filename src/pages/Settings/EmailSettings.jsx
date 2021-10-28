import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { callApi } from "../../api"; // Used for api call
import API from "../../api/Routes";
import { showMessageNotification } from "./../../utils/Functions"; //Utility functions
import Layout from "../../components/Layout/Layout";
import { ADMIN_URL } from "../../config";
/******************* 
@Purpose : Used for email setting
@Parameter : props
@Author : INIC
******************/
function EmailSettings(props) {
  const [formData, setFormData] = useState({
    payouts: false,
    notificationFailures: false,
    refunds: false,
    chargebacks: false,
    newSale: false,
    receipts: false,
    invoiceShortfall: false,
    failedPayments: false,
    paymentReminders: false,
    subscriptions: false,
    login: false,
    deleteAccount: false,
    signUpNotification: false,
    accountDeactivation: false,
  });
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    getEmailNotifications();
  }, []);
  /******************* 
  @Purpose : Used for get email notification
  @Parameter : props
  @Author : INIC
  ******************/
  const getEmailNotifications = async () => {
    const response = await props.callApi(
      API.GET_EMAIL_NOTIFICATIONS,
      "",
      "get",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1 && response.data.emailNotificationSettings) {
      const {
        payouts,
        notificationFailures,
        refunds,
        chargebacks,
        newSale,
        receipts,
        invoiceShortfall,
        failedPayments,
        paymentReminders,
        subscriptions,
        login,
        deleteAccount,
        signUpNotification,
        accountDeactivation,
      } = response.data.emailNotificationSettings;
      setFormData({
        ...formData,
        payouts,
        notificationFailures,
        refunds,
        chargebacks,
        newSale,
        receipts,
        invoiceShortfall,
        failedPayments,
        paymentReminders,
        subscriptions,
        login,
        deleteAccount,
        signUpNotification,
        accountDeactivation,
      });
    }
  };
  /******************* 
  @Purpose : Used for change handle
  @Parameter : name, status
  @Author : INIC
  ******************/
  const handleChange = (name, status) => {
    setFormData({
      ...formData,
      [name]: !status,
    });
  };
  /******************* 
  @Purpose : Used for add email notifiaction
  @Parameter : {}
  @Author : INIC
  ******************/
  const addEmailnotifications = async () => {
    setLoading(true);
    const {
      payouts,
      notificationFailures,
      refunds,
      chargebacks,
      newSale,
      receipts,
      invoiceShortfall,
      failedPayments,
      paymentReminders,
      subscriptions,
      login,
      deleteAccount,
      signUpNotification,
      accountDeactivation,
    } = formData;

    let body = {
      emailNotificationSettings: {
        payouts,
        notificationFailures,
        refunds,
        chargebacks,
        newSale,
        receipts,
        invoiceShortfall,
        failedPayments,
        paymentReminders,
        subscriptions,
        login,
        deleteAccount,
        signUpNotification,
        accountDeactivation,
      },
    };
    const response = await props.callApi(
      API.ADD_EMAIL_NOTIFICATIONS,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      setLoading(false);
      showMessageNotification("Updated successfully", "success");
    }
  };

  const {
    payouts,
    notificationFailures,
    refunds,
    chargebacks,
    newSale,
    receipts,
    invoiceShortfall,
    failedPayments,
    paymentReminders,
    subscriptions,
    login,
    deleteAccount,
    signUpNotification,
    accountDeactivation,
  } = formData;
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
                    <i className="bx bx-home-alt" />
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
                      <i className="bx bx-envelope" />
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
                        onChange={() => handleChange("payouts", payouts)}
                        checked={payouts ? payouts : false}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="switchCheckbox1"
                      />
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
                        onChange={() =>
                          handleChange(
                            "notificationFailures",
                            notificationFailures
                          )
                        }
                        checked={
                          notificationFailures ? notificationFailures : false
                        }
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="switchCheckbox2"
                      />
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
                        onChange={() => handleChange("refunds", refunds)}
                        checked={refunds ? refunds : false}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="switchCheckbox3"
                      />
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
                        onChange={() =>
                          handleChange("chargebacks", chargebacks)
                        }
                        checked={chargebacks ? chargebacks : false}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="switchCheckbox4"
                      />
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
                        onChange={() => handleChange("newSale", newSale)}
                        checked={newSale ? newSale : false}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="switchCheckbox5"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="notification-title d-flex align-items-start mb-md-5 mb-4 mt-md-5 mt-4">
                    <div className="icon d-flex align-items-center justify-content-center mr-1">
                      <i className="bx bx-user" />
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
                        htmlFor="switchCheckbox6"
                        onChange={() => handleChange("receipts", receipts)}
                        checked={receipts ? receipts : false}
                      />
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
                        onChange={() =>
                          handleChange("failedPayments", failedPayments)
                        }
                        checked={failedPayments ? failedPayments : false}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="switchCheckbox7"
                      />
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
                        onChange={() =>
                          handleChange("subscriptions", subscriptions)
                        }
                        checked={subscriptions ? subscriptions : false}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="switchCheckbox8"
                      />
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
                        onChange={() =>
                          handleChange("invoiceShortfall", invoiceShortfall)
                        }
                        checked={invoiceShortfall ? invoiceShortfall : false}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="switchCheckbox9"
                      />
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
                        onChange={() =>
                          handleChange("paymentReminders", paymentReminders)
                        }
                        checked={paymentReminders ? paymentReminders : false}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="switchCheckbox10"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="notification-title d-flex align-items-start mb-md-5 mb-4 mt-md-5 mt-4">
                    <div className="icon d-flex align-items-center justify-content-center mr-1">
                      <i className="bx bx-user" />
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
                        onChange={() => handleChange("login", login)}
                        checked={login ? login : false}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="switchCheckbox11"
                      />
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
                        onChange={() =>
                          handleChange("signUpNotification", signUpNotification)
                        }
                        checked={
                          signUpNotification ? signUpNotification : false
                        }
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="switchCheckbox12"
                      />
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
                        onChange={() =>
                          handleChange("deleteAccount", deleteAccount)
                        }
                        checked={deleteAccount ? deleteAccount : false}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="switchCheckbox13"
                      />
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
                        onChange={() =>
                          handleChange(
                            "accountDeactivation",
                            accountDeactivation
                          )
                        }
                        checked={
                          accountDeactivation ? accountDeactivation : false
                        }
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="switchCheckbox14"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="text-right mt-2">
                    <button
                      className="btn btn-primary"
                      onClick={addEmailnotifications}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
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
/******************* 
@Purpose : Used for get data from redux
@Parameter : state
@Author : INIC
******************/
const mapStateToProps = (state) => ({});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, { callApi })(EmailSettings);
