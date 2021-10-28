import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { callApi } from "../../api"; // Used for api call
import errorMessages from "../../utils/ErrorMessages"; // Error Messages
import {
  validatePassword,
  showMessageNotification,
} from "./../../utils/Functions"; // Utility functions
import API from "../../api/Routes";
import Theme from "../../components/Layout/Theme";
const queryString = require("query-string");
/******************* 
@Purpose : Used for reset password
@Parameter : props
@Author : INIC
******************/
function ResetPassword(props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [, setIsFormValid] = useState(true);
  let [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  var [errors, setErrors] = useState({ newPassword: "", confirmPassword: "" });
  const [hiddenNewPassword, setHiddenNewPassword] = useState(true);
  const [hiddenConfirmPassword, setHiddenConfirmPassword] = useState(true);
  const url = props.location.search;
  let params = queryString.parse(url);
  useEffect(() => {
    setToken(params && params.token);
  }, []);
  /******************* 
  @Purpose : Used for form field validation
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    let isFormValid = true;
    //for new password
    if (!newPassword.trim()) {
      errors.newPassword = errorMessages.PROVIDE_PASSWORD;
    } else if (!validatePassword(newPassword)) {
      errors.newPassword = errorMessages.PROVIDE_VALID_PASSWORD;
    } else {
      errors.newPassword = "";
    }
    //for confirm password
    if (!confirmPassword.trim()) {
      errors.confirmPassword = errorMessages.PROVIDE_CONFIRM_PASSWORD;
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = errorMessages.PASSWORD_NOT_MATCHED;
    } else {
      errors.confirmPassword = "";
    }
    if (errors.newPassword !== "" || errors.confirmPassword !== "") {
      isFormValid = false;
    }
    setErrors(errors);
    setIsFormValid(isFormValid);
    return isFormValid;
  };
  /******************* 
  @Purpose : Used for reset password validation
  @Parameter : event
  @Author : INIC
  ******************/
  const resetPassword = async (event) => {
    event.preventDefault();
    var body = { password: newPassword, token };
    try {
      if (validateForm()) {
        setLoading(true);
        const response = await props.callApi(API.RESET_PASSWORD, body, "post", null, true,false, "http://localhost:4041/admin");
        setLoading(false);
        if (response.status === 1) {
          showMessageNotification(response.message, "success");
          props.history.push("/");
        }
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  /******************* 
  @Purpose : Used for rander tooltip
  @Parameter : event
  @Author : INIC
  ******************/
  const renderTooltip = (tooltipProps) =>
    !hiddenConfirmPassword ? (
      <Tooltip id="button-tooltip" {...tooltipProps}>
        Hide Password
      </Tooltip>
    ) : (
      <Tooltip id="button-tooltip" {...tooltipProps}>
        Show Password
      </Tooltip>
    );
  /******************* 
  @Purpose : Used for rander tooltip
  @Parameter : event
  @Author : INIC
  ******************/
  const renderTooltip1 = (tooltipProps) =>
    !hiddenNewPassword ? (
      <Tooltip id="button-tooltip" {...tooltipProps}>
        Hide Password
      </Tooltip>
    ) : (
      <Tooltip id="button-tooltip" {...tooltipProps}>
        Show Password
      </Tooltip>
    );

  return (
    <div className="App">
      <header className="App-header">
        <div
          className="login-wrapper"
          style={{
            background:
              "url(assets/images/login-bg.jpg) no-repeat center center",
            backgroundSize: "cover",
          }}
        >
          <div className="login-body">
            <section className="login-container row m-0">
              <div className="col-xl-8 col-11">
                <div className="card bg-login-card">
                  <div className="row m-0">
                    <div className="col-md-6 col-12 pl-0 pr-0">
                      <div className="card rounded-left mb-0 p-4 d-flex justify-content-center h-100">
                        <div className="card-header">
                          <div className="card-title text-center mb-4">
                            <h4 className="mb-2 mt-2">Reset Your Password</h4>
                          </div>
                        </div>
                        <div className="card-content">
                          <div className="card-body">
                            <form autoComplete="off">
                              <div className="form-group position-relative">
                                <label className="label">
                                  New Password
                                  <sup className="text-danger">*</sup>
                                </label>
                                <input
                                  className="form-control"
                                  type={hiddenNewPassword ? "password" : "text"}
                                  placeholder="New Password"
                                  id="newPassword"
                                  name="newPassword"
                                  value={newPassword}
                                  required
                                  onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    errors = Object.assign(errors, {
                                      newPassword: "",
                                    });
                                    setErrors(errors);
                                  }}
                                />
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 250, hide: 400 }}
                                  overlay={renderTooltip1}
                                >
                                  <span
                                    onClick={() =>
                                      setHiddenNewPassword(!hiddenNewPassword)
                                    }
                                    toggle="#password-field"
                                    className={
                                      hiddenNewPassword
                                        ? "bx bx-hide field-icon toggle-password"
                                        : "bx bx-show field-icon toggle-password"
                                    }
                                  ></span>
                                </OverlayTrigger>
                                <span
                                  className="error-msg"
                                  style={{ color: "red" }}
                                >
                                  {errors.newPassword}
                                </span>
                              </div>
                              <div className="form-group position-relative">
                                <label className="label">
                                  Confirm Password:
                                  <sup className="text-danger">*</sup>
                                </label>
                                <input
                                  className="form-control"
                                  type={
                                    hiddenConfirmPassword ? "password" : "text"
                                  }
                                  placeholder="Confirm Password"
                                  id="confirmpassword"
                                  name="confirmPassword"
                                  value={confirmPassword}
                                  onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    errors = Object.assign(errors, {
                                      confirmPassword: "",
                                    });
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
                                      setHiddenConfirmPassword(
                                        !hiddenConfirmPassword
                                      )
                                    }
                                    toggle="#password-field"
                                    className={
                                      hiddenConfirmPassword
                                        ? "bx bx-hide field-icon toggle-password"
                                        : "bx bx-show field-icon toggle-password"
                                    }
                                  ></span>
                                </OverlayTrigger>
                                <span
                                  className="error-msg"
                                  style={{ color: "red" }}
                                >
                                  {errors.confirmPassword}
                                </span>
                              </div>
                              <div className="mt-5 text-center">
                                <button
                                  className="btn btn-primary glow position-relative btn-block"
                                  type="submit"
                                  onClick={resetPassword}
                                >
                                  {" "}
                                  {loading ? "Loading..." : "Reset Password "}
                                  <i class="icon-arrow bx bx-right-arrow-alt"></i>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 d-md-block d-none text-center align-self-center p-7">
                      <div className="card-content">
                        <picture>
                          <source
                            srcSet="assets/images/forgot-password.webp"
                            type="image/webp"
                          />
                          <source
                            srcSet="assets/images/forgot-password.png"
                            type="image/png"
                          />
                          <img
                            className="img-fluid"
                            src="assets/images/forgot-password.png"
                            alt="forgot-password"
                            width={300}
                          />
                        </picture>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </header>
      <Theme />
    </div>
  );
}
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(null, { callApi })(ResetPassword);
