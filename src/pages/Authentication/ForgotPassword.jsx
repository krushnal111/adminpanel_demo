import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { callApi } from "../../api"; // Used for api call
import errorMessages from "../../utils/ErrorMessages"; // Error Messages
import { validateEmail, showMessageNotification } from "../../utils/Functions"; // Utility functions
import { Link } from "react-router-dom";
import API from "../../api/Routes";
import Theme from "../../components/Layout/Theme";
/******************* 
@Purpose : Used for forgot password
@Parameter : props
@Author : INIC
******************/
function ForgotPassword(props) {
  var [errors, setErrors] = useState({ emailId: "" });
  const [emailId, setEmailId] = useState("");
  const [, setIsFormValid] = useState(true);
  let [loading, setLoading] = useState(false);
  /******************* 
  @Purpose : Used for form validation
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    let error = { emailId: "" };
    let isFormValid = true;

    // for emailId
    if (!emailId.trim()) error.emailId = errorMessages.PROVIDE_EMAIL;
    else if (!validateEmail(emailId))
      error.emailId = errorMessages.PROVIDE_VALID_EMAIL;
    // else error.emailId = true;

    if (error.emailId) isFormValid = false;

    setErrors(error);
    setIsFormValid(isFormValid);
    return isFormValid;
  };

  /******************* 
  @Purpose : Used for forgot password actions
  @Parameter : e
  @Author : INIC
  ******************/
  const forgotPassword = async (e) => {
    e.preventDefault();
    var body = { emailId: emailId };
    try {
      if (validateForm()) {
        setLoading(true);
        const response = await props.callApi(
          API.FORGOT,
          body,
          "post",
          null,
          true,
          false,
          "http://localhost:4041/admin"
        );
        // const response = await props.callApi(API.FORGOT, body, "post");
        setLoading(false);
        if (response.status === 1) {
          showMessageNotification(response.message, "success");
          setEmailId("");
          setErrors("");
          props.history.push("/");
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      throw error;
    }
  };

  return (
    <div className="App">
      <Theme />
      <div
        className="login-wrapper"
        style={{
          background:
            "url(../assets/images/login-bg.jpg) no-repeat center center",
        }}
      >
        <div className="login-body">
          <div className="login-container row m-0">
            <div className="col-xl-8 col-11">
              <div className="card bg-login-card">
                <div className="row m-0">
                  <div className="col-md-6 col-12 pl-0 pr-0">
                    <div className="card rounded-left mb-0 p-4 d-flex justify-content-center h-100">
                      <div className="card-header">
                        <div className="card-title text-center mb-4">
                          <h4 className="mb-2 mt-2">Forgot Password?</h4>
                        </div>
                        <div className="text-center">
                          <p className="common-small-text">
                            <small>
                              Enter the email you used when you joined and we
                              will send you temporary password
                            </small>
                          </p>
                        </div>
                      </div>
                      <div className="card-content">
                        <div className="card-body">
                          <form onSubmit={(evt) => forgotPassword(evt)}>
                            <div className="form-group mb-4">
                              <label for="EmailAddress">
                                Email<sup className="text-danger">*</sup>
                              </label>
                              <input
                                type="email"
                                className={
                                  errors.emailId
                                    ? "form-control input-error"
                                    : "form-control"
                                }
                                id="EmailAddress"
                                aria-describedby="emailHelp"
                                placeholder="Enter Email "
                                value={emailId}
                                onChange={(e) => {
                                  setEmailId(e.target.value);
                                  errors = Object.assign(errors, {
                                    emailId: "",
                                  });
                                  setErrors(errors);
                                }}
                              />
                              <span
                                className="error-msg"
                                style={{ color: "red" }}
                              >
                                {errors.emailId}
                              </span>
                            </div>
                            <Button
                              type="button"
                              className="btn btn-primary glow position-relative btn-block"
                              onClick={(evt) => forgotPassword(evt)}
                            >
                              {loading ? "Loading" : "Send Email"}
                              <i className="icon-arrow bx bx-right-arrow-alt"></i>
                            </Button>
                          </form>
                          <div className=" d-flex flex-md-row flex-column justify-content-between align-items-center mt-4 mb-3">
                            <div className="text-left common-small-text">
                              <small>
                                {" "}
                                <Link to="/">Sign in</Link>
                              </small>
                            </div>
                            <div className="text-right common-small-text">
                              <small>
                                Don’t have an account?{" "}
                                <Link to="/register">Sign Up</Link>
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 d-md-block d-none text-center align-self-center p-7">
                    <div className="card-content">
                      <img
                        className="img-fluid"
                        src="../assets/images/register.png"
                        alt="sign up"
                        width="300"
                      ></img>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(null, { callApi })(ForgotPassword);
