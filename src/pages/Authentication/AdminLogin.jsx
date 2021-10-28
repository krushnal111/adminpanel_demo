import React, { useState } from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { changeResize, changeTheme } from "../../store/Actions"; // Redux actions
import { callApi } from "../../api"; // Used for api call
import errorMessages from "../../utils/ErrorMessages"; // Error Messages
import { validatePassword, setItem, showMessageNotification } from "./../../utils/Functions"; // Utility functions
import API from "../../api/Routes";
import Theme from "../../components/Layout/Theme";
import Swal from "sweetalert2";
import { ADMIN_URL, API_URL, AUTH_URL } from "../../config";
/******************* 
@Purpose : Used for admin login view
@Parameter : props
@Author : INIC
******************/
function Login(props) {
  const [emailId, setEmailId] = useState(localStorage.getItem("emailId"));
  const [, setIsFormValid] = useState(true);
  var [errors, setErrors] = useState({ emailId: "", password: "" });
  const [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [hidden, setHidden] = useState(true);
  /******************* 
  @Purpose : Used for validate form data
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    var mailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|(^\d{10}$)+$/;
    let tempErrors = { emailId: "", password: "" };
    let isFormValid = true;
    //for Email
    if (!emailId)
      tempErrors.emailId = "*Please enter your email  or phone number";
    else if (!mailFormat.test(emailId))
      tempErrors.emailId = "Please enter vaild email or phone number";
    else tempErrors.emailId = "";

    // for password
    if (!password.trim()) tempErrors.password = errorMessages.PROVIDE_PASSWORD;
    else if (!validatePassword(password))
      tempErrors.password = errorMessages.PROVIDE_VALID_PASSWORD;
    else tempErrors.password = "";

    if (tempErrors.emailId !== "" || tempErrors.password !== "")
      isFormValid = false;

    setErrors(tempErrors);
    setIsFormValid(isFormValid);
    return isFormValid;
  };
  /******************* 
  @Purpose : Used for rander tooltip data
  @Parameter : passwordProps
  @Author : INIC
  ******************/
  const renderTooltip = (passwordProps) =>
    !hidden ? (
      <Tooltip id="button-tooltip" {...passwordProps}>
        Hide Password
      </Tooltip>
    ) : (
      <Tooltip id="button-tooltip" {...passwordProps}>
        Show Password
      </Tooltip>
    );
  /******************* 
  @Purpose : Used for login action
  @Parameter : passwordProps
  @Author : INIC
  ******************/
  const adminLogin = async (event) => {
    event.preventDefault();
      if (validateForm()) {
        setLoading(true);
        try {
          let body = {
            authName: emailId,
            password: password,
            role:"admin"
          };

          const data = await props.callApi(
            API.LOGIN,
            body,
            "post",
            "ADMIN_LOGIN",
           false,
            false,
            AUTH_URL
          );
          setLoading(false);
          if (data.status === 1) {
            if (data.data.theme == "Dark") {
              document.body.classList.add("dark");
              document.body.classList.remove("light");
              props.changeTheme(true);
            } else {
              document.body.classList.add("light");
              document.body.classList.remove("dark");
              props.changeTheme(false);
            }

            if (data.data.menuAlignment == "horizontal") {
              document.body.classList.add("Horizontal");
              document.body.classList.remove("vertical");
              props.changeResize(true);
            } else {
              document.body.classList.add("vertical");
              document.body.classList.remove("Horizontal");
              props.changeResize(false);
            }

            if (data.message == "Logged in successfully.") {
              showMessageNotification(data.message, "success")
              setItem("accessToken", data.access_token);
              props.history.push("/dashboard");
            } else {
              Swal.fire({
                title: data.message,
                input: "text",
                inputPlaceholder: "Enter your email ",
                inputValue: emailId.match(/^\d{10}$/) ? "" : emailId,
                inputValidator: function (value) {
                  if (value === "") {
                    return !value && "*Please enter email";
                  }
                  var mailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                  if (!mailFormat.test(value)) {
                    return "Please enter valid email ";
                  }
                },

                inputAttributes: {
                  autocapitalize: "off",
                },
                showCancelButton: true,
                confirmButtonText: "Verify email",
                showLoaderOnConfirm: true,
                preConfirm: (email) => {
                  if (validateForm()) {
                    return fetch(`${ADMIN_URL}${API.VERIFY_EMAIL}`, {
                      method: "POST", // or 'PUT'
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        emailId: email,
                      }),
                    })
                      .then((response) => {
                        if (!response) {
                          throw new Error(response.json());
                        }
                        return response.json();
                      })
                      .catch((error) => {
                        Swal.showValidationMessage(`Request failed: ${error}`);
                      });
                  } else {
                    Swal.showValidationMessage("First input missing");
                  }
                },

                allowOutsideClick: () => !Swal.isLoading(),
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: `${result.value.message}`,
                  });
                }
              });
            }
          }
        } catch (error) {
          setLoading(false);
          throw error;
        }
      }
  };

  return (
    <div className="App">
      <header className="App-header"></header>
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
                          <h4 className="mb-2">Welcome</h4>
                        </div>
                      </div>
                      <div className="card-content">
                        <div className="card-body">
                          <form onSubmit={(evt) => adminLogin(evt)}>
                            <div className="form-group mb-2">
                              <label for="EmailAddress">
                                Email or Phone{" "}
                                <sup className="text-danger">*</sup>
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                id="EmailAddress"
                                aria-describedby="emailHelp"
                                placeholder="Enter email"
                                type="text"
                                className={
                                  errors.emailId
                                    ? "form-control input-error"
                                    : "form-control"
                                }
                                name="emailId"
                                value={emailId}
                                id="email"
                                placeholder="Enter email or phone"
                                onChange={(e) => {
                                  setEmailId(e.target.value);
                                  localStorage.setItem(
                                    "emailId",
                                    e.target.value
                                  );
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
                            <div className="form-group mb-2 position-relative">
                              <label for="Password">
                                Password<sup className="text-danger">*</sup>
                              </label>
                              <input
                                className={
                                  errors.password
                                    ? "form-control input-error"
                                    : "form-control"
                                }
                                name="password"
                                value={password}
                                id="password"
                                type={hidden ? "password" : "text"}
                                placeholder=" Enter Password"
                                onChange={(e) => {
                                  setPassword(e.target.value);
                                  errors = Object.assign(errors, {
                                    password: "",
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
                                  onClick={() => setHidden(!hidden)}
                                  toggle="#password-field"
                                  className={
                                    hidden
                                      ? "bx bx-hide field-icon toggle-password"
                                      : "bx bx-show field-icon toggle-password"
                                  }
                                ></span>
                              </OverlayTrigger>
                              <em className="fa fa-lock" aria-hidden="true" />
                              <span
                                className="error-msg"
                                style={{ color: "red" }}
                              >
                                {errors.password}
                              </span>
                            </div>
                            <div className="form-group d-flex flex-md-row flex-column justify-content-between align-items-center mb-3">
                              <div className="text-left"></div>
                              <div className="text-right">
                                <Link
                                  to="/forgotpassword"
                                  className="card-link"
                                >
                                  Forgot password?
                                </Link>
                              </div>
                            </div>
                            <Button
                              type="button"
                              className="btn btn-primary glow position-relative btn-block"
                              type="submit"
                              onClick={(evt) => adminLogin(evt)}
                            >
                              {loading ? "Loading..." : "Login"}
                              <i className="icon-arrow bx bx-right-arrow-alt"></i>
                            </Button>
                          </form>
                          <div className="text-center common-small-text mt-3 mb-4">
                            <small>
                              Don’t have an account?{" "}
                              <Link to="/register">Sign up</Link>
                            </small>
                          </div>
                          <div className="divider">
                            <div className="divider-text text-uppercase text-muted">
                              <small>or login with</small>
                            </div>
                          </div>
                          <div className="d-flex flex-md-row flex-column justify-content-around">
                            <Link
                              to="https://mail.google.com/"
                              rel="noopener noreferrer"
                              target="_blank"
                              className="btn btn-social btn-google btn-block mr-0 mr-md-3 mb-md-0 mb-2"
                            >
                              <i className="bx bxl-google btn-icon"></i>
                              <span className="pl-50 d-block text-center">
                                Google
                              </span>
                            </Link>
                            <Link
                              to="https://www.facebook.com/"
                              rel="noopener noreferrer"
                              target="_blank"
                              className="btn btn-social btn-block mt-0 btn-facebook"
                            >
                              <i className="bx bxl-facebook-square btn-icon"></i>
                              <span className="pl-50 d-block text-center">
                                Facebook
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 d-md-block d-none text-center align-self-center p-7">
                    <div class="card-content">
                      <img
                        class="img-fluid"
                        src="../assets/images/login.png"
                        alt="login"
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
export default connect(null, { callApi, changeTheme, changeResize })(
  withRouter(Login)
);
