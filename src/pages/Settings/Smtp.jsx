import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { connect } from "react-redux";
import { callApi } from "../../api"; // Used for api call
import { validateHostName , validatePort, validateIDSecret, validateEmail,showMessageNotification} from "./../../utils/Functions"; // Utility functions
import { Link } from "react-router-dom";
import errorMessages from "../../utils/ErrorMessages";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import API from "../../api/Routes";
import { ADMIN_URL } from "../../config";
/******************* 
@Purpose : Used for SMTP settings
@Parameter : props
@Author : INIC
******************/
function SMTPSettings(props) {
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("");
  const [encryption, setEncryption] = useState("");
  const [smtpUsername, setSmtpUsername] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [fromName, setFromName] = useState("");
  const [fromEmailId, setFromEmailId] = useState("");
  const [smsUserName, setSmsUserName] = useState("");
  const [smsPassword, setSmsPassword] = useState("");
  const [appId, setAppId] = useState("");
  const [hiddenNewPassword, setHiddenNewPassword] = useState(true);
  const [hiddenConfirmPassword, setHiddenConfirmPassword] = useState(true);
  const [, setIsFormValid] = useState(true);
  var [errors, setErrors] = useState({});

  useEffect(() => {
    getSMTPSettings();
  }, []);

  /******************* 
  @Purpose : Used for get SMTP details
  @Parameter : {}
  @Author : INIC
  ******************/
  const getSMTPSettings = async () => {
    const response = await props.callApi(API.GET_SMTP, "", "get", null, true,
    false,
    ADMIN_URL);
    if (response.status === 1 && response.data.smtp) {
      let {
        encryption,
        fromEmailId,
        fromName,
        host,
        port,
        smtpPassword,
        smtpUserName,
      } = response.data.smtp;
      let { appId, smsPassword, smsUserName } = response.data.sms;
      setEncryption(encryption);
      setFromEmailId(fromEmailId);
      setFromName(fromName);
      setSmtpHost(host);
      setSmtpPort(port);
      setSmtpPassword(smtpPassword);
      setSmtpUsername(smtpUserName);
      setAppId(appId);
      setSmsPassword(smsPassword);
      setSmsUserName(smsUserName);
    }
  };
  /******************* 
  @Purpose : Used for validate SMTP Form
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    let errors = {
      smtpHost: "",
      smtpPort: "",
      smtpUsername: "",
      encryption: "",
      smtpPassword: "",
      fromName: "",
      fromEmailId: "",
      smsUserName: "",
      smsPassword: "",
      appId: "",
    };
    let isFormValid = true;

    if (!smtpHost.trim()) errors.smtpHost = errorMessages.PROVIDE_HOST;
    else if (!validateHostName(smtpHost))
      errors.smtpHost = errorMessages.PROVIDE_VALID_HOST;
    else errors.smtpHost = "";

    if (!smtpPort) errors.smtpPort = errorMessages.PROVIDE_PORT;
    else if (!validatePort(smtpPort))
      errors.smtpPort = errorMessages.PROVIDE_VALID_PORT;
    else errors.smtpPort = "";

    if (!encryption.trim())
      errors.encryption = errorMessages.PROVIDE_ENCRYPTION;
    else if (encryption.length < 3)
      errors.encryption = errorMessages.PROVIDE_VALID_ENCRYPTION;
    else errors.encryption = "";

    if (!smtpUsername.trim())
      errors.smtpUsername = errorMessages.PROVIDE_SMTP_USER_NAME;
    else if (!validateIDSecret(smtpUsername))
      errors.smtpUsername = errorMessages.PROVIDE_VALID_SMTP_USER_NAME;
    // else if () errors.smtpUsername = errorMessages.PROVIDE_VALID_SMTP_USER_NAME;
    else errors.smtpUsername = "";

    if (!smtpPassword.trim())
      errors.smtpPassword = errorMessages.PROVIDE_SMTP_PASSWORD;
    else if (smtpPassword.length < 4)
      errors.smtpPassword = errorMessages.PROVIDE_SMTP_PASSWORD;
    else errors.smtpPassword = "";

    if (!fromEmailId.trim())
      errors.fromEmailId = errorMessages.PROVIDE_FROM_EMAIL;
    else if (!validateEmail(fromEmailId))
      errors.fromEmailId = errorMessages.PROVIDE_VALID_FROM_EMAIL;
    else errors.fromEmailId = "";

    if (!fromName.trim()) errors.fromName = errorMessages.PROVIDE_FROMNAME;
    else if (fromName.length < 5)
      errors.fromName = errorMessages.PROVIDE_VALID_FROMNAME;
    else errors.fromName = "";

    if (!smsUserName.trim())
      errors.smsUserName = errorMessages.PROVIDE_SMTP_USER_NAME;
    else if (!validateIDSecret(smsUserName))
      errors.smsUserName = errorMessages.PROVIDE_VALID_SMTP_USER_NAME;
    else errors.smsUserName = "";

    if (!smsPassword.trim())
      errors.smsPassword = errorMessages.PROVIDE_SMS_PASSWORD;
    else if (smsPassword.length < 5)
      errors.smsPassword = errorMessages.PROVIDE_VALID_SMS_PASSWORD;
    else errors.smsPassword = "";

    if (!appId.trim()) errors.appId = errorMessages.PROVIDE_APPID;
    else if (appId < 5) errors.appId = errorMessages.PROVIDE_VALID_APPID;
    else errors.appId = "";

    if (
      errors.smtpHost !== "" ||
      errors.smtpPort !== "" ||
      errors.encryption !== "" ||
      errors.smtpUsername !== "" ||
      errors.smtpPassword !== "" ||
      errors.fromEmailId !== "" ||
      errors.fromName !== "" ||
      errors.smsUserName !== "" ||
      errors.smsPassword !== "" ||
      errors.appId !== ""
    )
      isFormValid = false;
    else isFormValid = true;

    setErrors(errors);
    setIsFormValid(isFormValid);

    return isFormValid;
  };
  /******************* 
  @Purpose : Used for Add SMTP/SMS details
  @Parameter : {}
  @Author : INIC
  ******************/
  const addSmtpAndSmsSettings = async () => {
    if (validateForm()) {
      var body = {
        host: smtpHost,
        port: smtpPort,
        encryption: encryption,
        smtpUserName: smtpUsername,
        smtpPassword: smtpPassword,
        fromEmailId: fromEmailId,
        fromName: fromName,
        smsUserName: smsUserName,
        smsPassword: smsPassword,
        appId: appId,
      };

      const response = await props.callApi(
        API.ADD_SMTP,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("SMTP Settings Added successfully", "success")
      }
    }
  };
  /******************* 
  @Purpose : Used for render tooltip
  @Parameter : props
  @Author : INIC
  ******************/
  const renderTooltip = (props) =>
    !hiddenConfirmPassword ? (
      <Tooltip id="button-tooltip" {...props}>
        Hide Password
      </Tooltip>
    ) : (
      <Tooltip id="button-tooltip" {...props}>
        Show Password
      </Tooltip>
    );
  /******************* 
  @Purpose : Used for render tooltip
  @Parameter : props
  @Author : INIC
  ******************/
  const renderTooltip1 = (props) =>
    !hiddenNewPassword ? (
      <Tooltip id="button-tooltip" {...props}>
        Hide Password
      </Tooltip>
    ) : (
      <Tooltip id="button-tooltip" {...props}>
        Show Password
      </Tooltip>
    );
  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="content-header-title">SMTP / SMS Detail</li>
                <li className="breadcrumb-item">
                  <Link onClick={() => props.history.push("/dashboard")}>
                    <i className="bx bx-home-alt" />
                  </Link>
                </li>
                <li className="breadcrumb-item">Settings</li>
                <li className="breadcrumb-item active" aria-current="page">
                  SMTP / SMS Detail
                </li>
              </ol>
            </nav>
            <div className="card notification-card">
              <div className="notification-title d-flex align-items-center text-uppercase mb-md-3 mb-2">
                <div className="icon d-flex align-items-center justify-content-center mr-1">
                  <i className="bx bx-mail-send" />
                </div>
                <div className="text">
                  <h5 className="mb-0 text Uppercase">Smtp</h5>
                </div>
              </div>
              <form action="#">
                <div className="row">
                  <div className="form-group col-md-6 mb-md-5 mb-3">
                    <label htmlFor="HostName">
                      Host Name<sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="smtpHost"
                      name="smtpHost"
                      placeholder="smtp.example.net"
                      value={smtpHost}
                      onChange={(e) => {
                        setSmtpHost(e.target.value);
                        errors = Object.assign(errors, { smtpHost: "" });
                        setErrors(errors);
                      }}
                    />
                    <span className="error-msg" style={{ color: "red" }}>
                      {errors.smtpHost}
                    </span>
                  </div>
                  <div className="form-group col-md-3 mb-md-5 mb-3">
                    <label htmlFor="Port">
                      Port<sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="smtpPort"
                      name="smtpPort"
                      placeholder={510}
                      value={smtpPort}
                      onChange={(e) => {
                        setSmtpPort(e.target.value);
                        errors = Object.assign(errors, { smtpPort: "" });
                        setErrors(errors);
                      }}
                    />
                    <span className="error-msg" style={{ color: "red" }}>
                      {errors.smtpPort}
                    </span>
                  </div>
                  <div className="form-group col-md-3 mb-md-5 mb-3">
                    <label htmlFor="Encryption">
                      Encryption<sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="encryption"
                      name="encryption"
                      placeholder="SSL"
                      value={encryption}
                      onChange={(e) => {
                        setEncryption(e.target.value);
                        errors = Object.assign(errors, { encryption: "" });
                        setErrors(errors);
                      }}
                    />
                    <span className="error-msg" style={{ color: "red" }}>
                      {errors.encryption}
                    </span>
                  </div>
                  <div className="form-group col-md-6 mb-md-5 mb-3">
                    <label htmlFor="UserName">
                      Username<sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="smtpUsername"
                      name="smtpUsername"
                      placeholder="123@example.net"
                      value={smtpUsername}
                      onChange={(e) => {
                        setSmtpUsername(e.target.value);
                        errors = Object.assign(errors, { smtpUsername: "" });
                        setErrors(errors);
                      }}
                    />
                    <span className="error-msg" style={{ color: "red" }}>
                      {errors.smtpUsername}
                    </span>
                  </div>
                  <div className="form-group col-md-6 mb-md-5 mb-3">
                    <label htmlFor="Password">
                      Password<sup className="text-danger">*</sup>
                    </label>
                    <input
                      type={hiddenConfirmPassword ? "password" : "text"}
                      className="form-control"
                      id="smtpPassword"
                      name="smtpPassword"
                      placeholder="password"
                      value={smtpPassword}
                      onChange={(e) => {
                        setSmtpPassword(e.target.value);
                        errors = Object.assign(errors, { SmtpPassword: "" });
                        setErrors(errors);
                      }}
                    />
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip}
                    >
                      <span
                        onClick={() =>
                          setHiddenConfirmPassword(!hiddenConfirmPassword)
                        }
                        toggle="#password-field"
                        className={
                          hiddenConfirmPassword
                            ? "bx bx-hide field-icon mr-3 toggle-password"
                            : "bx bx-show field-icon mr-3 toggle-password"
                        }
                      ></span>
                    </OverlayTrigger>
                    <span className="error-msg" style={{ color: "red" }}>
                      {errors.smtpPassword}
                    </span>
                  </div>
                  <div className="form-group col-md-6 mb-md-5 mb-3">
                    <label htmlFor="FromEmail">
                      From Email<sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="fromEmailId"
                      name="fromEmailId"
                      placeholder="hello@example.net"
                      value={fromEmailId}
                      onChange={(e) => {
                        setFromEmailId(e.target.value);
                        errors = Object.assign(errors, { fromEmailId: "" });
                        setErrors(errors);
                      }}
                    />
                    <span className="error-msg" style={{ color: "red" }}>
                      {errors.fromEmailId}
                    </span>
                  </div>
                  <div className="form-group col-md-6 mb-md-5 mb-3">
                    <label htmlFor="FromName">
                      From Name<sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fromName"
                      name="fromName"
                      placeholder="John Doe"
                      value={fromName}
                      onChange={(e) => {
                        setFromName(e.target.value);
                        errors = Object.assign(errors, { fromName: "" });
                        setErrors(errors);
                      }}
                    />
                    <span className="error-msg" style={{ color: "red" }}>
                      {errors.fromName}
                    </span>
                  </div>
                </div>
              </form>
              <div className="notification-title d-flex align-items-center text-uppercase mt-md-5 mt-3 mb-md-3 mb-2">
                <div className="icon d-flex align-items-center justify-content-center mr-1">
                  <i className="bx bx-mail-send" />
                </div>
                <div className="text">
                  <h5 className="mb-0 text Uppercase">Sms</h5>
                </div>
              </div>
              <form action="#">
                <div className="row">
                  <div className="form-group col-md-4 mb-md-5 mb-3">
                    <label htmlFor="UserName1">
                      UserName<sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="smsUserName"
                      name="smsUserName"
                      value={smsUserName}
                      onChange={(e) => {
                        setSmsUserName(e.target.value);
                        errors = Object.assign(errors, { smsUserName: "" });
                        setErrors(errors);
                      }}
                    />
                    <span className="error-msg" style={{ color: "red" }}>
                      {errors.smsUserName}
                    </span>
                  </div>
                  <div className="form-group col-md-4 mb-md-5 mb-3">
                    <label htmlFor="Password1">
                      Password<sup className="text-danger">*</sup>
                    </label>
                    <input
                      type={hiddenNewPassword ? "password" : "text"}
                      className="form-control"
                      id="smsPassword"
                      name="smsPassword"
                      value={smsPassword}
                      onChange={(e) => {
                        setSmsPassword(e.target.value);
                        errors = Object.assign(errors, { smsPassword: "" });
                        setErrors(errors);
                      }}
                    />
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip1}
                    >
                      <span
                        onClick={() => setHiddenNewPassword(!hiddenNewPassword)}
                        toggle="#password-field"
                        className={
                          hiddenNewPassword
                            ? "bx bx-hide field-icon mr-3 toggle-password"
                            : "bx bx-show field-icon mr-3 toggle-password"
                        }
                      ></span>
                    </OverlayTrigger>
                    <span className="error-msg" style={{ color: "red" }}>
                      {errors.smsPassword}
                    </span>
                  </div>
                  <div className="form-group col-md-4 mb-md-5 mb-3">
                    <label htmlFor="AppId">
                      App ID<sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="appId"
                      name="appId"
                      value={appId}
                      onChange={(e) => {
                        setAppId(e.target.value);
                        errors = Object.assign(errors, { appId: "" });
                        setErrors(errors);
                      }}
                    />
                    <span className="error-msg" style={{ color: "red" }}>
                      {errors.appId}
                    </span>
                  </div>
                </div>
              </form>
              <div className="text-right mt-md-5 mt-3">
                <button
                  className="btn btn-primary"
                  onClick={addSmtpAndSmsSettings}
                >
                  Save Changes
                </button>
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
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(null, { callApi })(SMTPSettings);
