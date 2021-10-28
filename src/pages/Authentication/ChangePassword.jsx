import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { callApi } from "../../api"; // Used for api call
import errorMessages from "../../utils/ErrorMessages"; // Error Messages
import { validatePassword, setItem, showMessageNotification } from "../../utils/Functions"; // Utility functions
import API from "../../api/Routes";
import Layout from "../../components/Layout/Layout";
const queryString = require("query-string");
/******************* 
@Purpose : Used for change password
@Parameter : props
@Author : INIC
******************/
function ChangePassword(props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [, setIsFormValid] = useState(true);
  let [changeLoading, setChangeLoading] = useState(false);
  const [, setToken] = useState("");
  let [hidden] = useState(true);
  var [changeErrors, setChangeErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    let url = props.location.search;
    let params = queryString.parse(url);
    setToken(params.token);
  }, []);
  /******************* 
  @Purpose : Used for form validation
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    let changeError = { newPassword: "", confirmPassword: "" };
    let isFormValid = true;

    //for new password
    if (!newPassword.trim())
      changeError.newPassword = errorMessages.PROVIDE_PASSWORD;
    else if (!validatePassword(newPassword))
      changeError.newPassword = errorMessages.PROVIDE_VALID_PASSWORD;
    else changeError.newPassword = "";

    //for confirm password
    if (!confirmPassword.trim())
      changeError.confirmPassword = errorMessages.PROVIDE_PASSWORD;
    else if (!validatePassword(confirmPassword))
      changeError.confirmPassword = errorMessages.PROVIDE_VALID_PASSWORD;
    else changeError.confirmPassword = "";

    if (changeError.newPassword !== "" || changeError.confirmPassword !== "")
      isFormValid = false;

    setChangeErrors(changeError);
    setIsFormValid(isFormValid);
    return isFormValid;
  };
  /******************* 
  @Purpose : Used for reset password
  @Parameter : event
  @Author : INIC
  ******************/
  const resetPassword = async (event) => {
    event.preventDefault();
    var body = {
      oldPassword: newPassword,
      newPassword: confirmPassword,
    };
    try {
      if (validateForm()) {
        setChangeLoading(true);
        const response = await props.callApi(
          API.CHNAGE_PASSWORD,
          body,
          "post",
          "",
          true
        );
        setChangeLoading(false);
        if (response.status === 1) {
          showMessageNotification(response.message, "success");
          setItem("accessToken", "");
          props.history.push("/");
        }
      }
    } catch (error) {
      setChangeLoading(false);
      throw error;
    }
  };

  return (
    <Layout>
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
                              <h4 className="mb-2 mt-2">Change Password</h4>
                            </div>
                          </div>
                          <div className="card-content">
                            <div className="card-body">
                              <form autoComplete="off">
                                <div className="form-group mb-2">
                                  <label className="col-form-label label">
                                    old Password
                                  </label>
                                  <div className="col-md-12">
                                    <input
                                      className="form-control"
                                      type="password"
                                      placeholder="old Password"
                                      name="newPassword"
                                      value={newPassword}
                                      onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        changeErrors = Object.assign(
                                          changeErrors,
                                          { newPassword: "" }
                                        );
                                        setChangeErrors(changeErrors);
                                      }}
                                    />
                                    <span
                                      className="error-msg"
                                      style={{ color: "red" }}
                                    >
                                      {changeErrors.newPassword}
                                    </span>
                                  </div>
                                </div>
                                <div className="form-group mb-2 position-relative">
                                  <label className="col-form-label label">
                                    New Password:
                                  </label>
                                  <div className="col-md-12">
                                    <input
                                      className="form-control"
                                      type={hidden ? "password" : "text"}
                                      placeholder="New Password"
                                      id="confirmpassword"
                                      name="confirmPassword"
                                      value={confirmPassword}
                                      required
                                      onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        changeErrors = Object.assign(
                                          changeErrors,
                                          { confirmPassword: "" }
                                        );
                                        setChangeErrors(changeErrors);
                                      }}
                                    />
                                    <em
                                      className="fa fa-lock"
                                      aria-hidden="true"
                                    />
                                    <span
                                      className="error-msg"
                                      style={{ color: "red" }}
                                    >
                                      {changeErrors.confirmPassword}
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-5 text-center">
                                  <button
                                    className="btn btn-primary mr-2"
                                    type="submit"
                                    onClick={resetPassword}
                                  >
                                    {" "}
                                    {changeLoading
                                      ? "Loading..."
                                      : "Change Password "}
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
      </div>
    </Layout>
  );
}
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(null, { callApi })(ChangePassword);
