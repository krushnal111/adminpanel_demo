import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { callApi } from "../../api"; // Used for api call
import errorMessages from "../../utils/ErrorMessages"; // Error Messages
import { validatePassword, showModalNotification } from "../../utils/Functions"; // Utility functions
import API from "../../api/Routes";
/******************* 
@Purpose : Used for manage password 
@Parameter : props
@Author : INIC
******************/
function PasswordPage(props) {
  var [errors, setErrors] = useState({ password: "" });
  const [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  const [, setIsFormValid] = useState(true);
  /******************* 
  @Purpose : Used for form validate
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    let isFormValid = true;
    // for password
    if (!password.trim()) {
      errors.password = errorMessages.PROVIDE_PASSWORD;
    } else if (!validatePassword(password)) {
      errors.password = errorMessages.PROVIDE_VALID_PASSWORD;
    } else {
      errors.password = "";
    }
    if (errors.password !== "") {
      isFormValid = false;
    }
    setErrors(errors);
    setIsFormValid(isFormValid);
    return isFormValid;
  };
  /******************* 
  @Purpose : Used for forgot password
  @Parameter : e
  @Author : INIC
  ******************/
  const sendPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    var body = {
      emailId: localStorage.getItem("emailId"),
      password: password,
    };
    try {
      if (validateForm()) {
        const response = await props.callApi(API.LOGIN, body, "post");
        setLoading(false);
        if (response.status === 1) {
          showModalNotification(response.message, "success");
          setPassword("");
          setErrors("");
          props.history.push("/dashboard");
        }
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  return (
    <div className="App">
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
                          <h4 className="mb-2 mt-2">Password?</h4>
                        </div>
                      </div>
                      <div className="card-content">
                        <div className="card-body">
                          <form onSubmit={(evt) => sendPassword(evt)}>
                            <div className="form-group mb-2">
                              <label for="EmailAddress">
                                Password<sup className="text-danger">*</sup>
                              </label>
                              <input
                                type="password"
                                className={
                                  errors.password
                                    ? "form-control input-error"
                                    : "form-control"
                                }
                                id="EmailAddress"
                                aria-describedby="emailHelp"
                                placeholder="Enter password "
                                value={password}
                                name={password}
                                onChange={(e) => {
                                  setPassword(e.target.value);
                                  errors = Object.assign(errors, {
                                    password: "",
                                  });
                                  setErrors(errors);
                                }}
                              />
                              <span
                                className="error-msg"
                                style={{ color: "red" }}
                              >
                                {errors.password}
                              </span>
                            </div>
                            <Button
                              type="button"
                              className="btn btn-primary glow position-relative btn-block"
                              onClick={(evt) => sendPassword(evt)}
                            >
                              {loading ? "Loading..." : "Send password"}
                              <i className="icon-arrow bx bx-right-arrow-alt"></i>
                            </Button>
                          </form>
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
export default connect(null, { callApi })(PasswordPage);
