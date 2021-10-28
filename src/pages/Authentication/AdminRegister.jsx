import React, { useState } from "react";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import errorMessages from "../../utils/ErrorMessages"; // Error Messages
import { callApi } from "../../api"; // Used for api call
import { validateName, validatePassword , validateEmail, showMessageNotification} from "../../utils/Functions"; // Utility functions
import API from "../../api/Routes";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Theme from "../../components/Layout/Theme";
import { ADMIN_URL } from "../../config";
/******************* 
@Purpose : Used for admin registration
@Parameter : props
@Author : INIC
******************/
function Register(props) {
  let [firstName, setfirstName] = useState("");
  let [lastName, setlastName] = useState("");
  let [emailId, setEmailId] = useState("");
  let [password, setPassword] = useState("");
  const [, setIsFormValid] = useState(true);
  let [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    phoneNo: "",
    password: "",
    mobile: "",
  });
  let [loading, setLoading] = useState(false);
  let [hidden, setHidden] = useState(true);
  let [mobile, setMobile] = useState("");
  let [, setDialcode] = useState("");
  let [, setdisablePhoneinput] = useState(false);

  /******************* 
  @Purpose : Used for change input data value
  @Parameter : value, data
  @Author : INIC
  ******************/
  const handleOnChanges = (value, data) => {
    setdisablePhoneinput(false);
    let dialnums = data.dialCode;
    let mobilenums = value.slice(data.dialCode.length);
    setDialcode(dialnums);
    setMobile(mobilenums);
    if (mobilenums.length >= 10) {
      setdisablePhoneinput(true);
    }
  };
  /******************* 
  @Purpose : Used for form validation
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    let formErrors = {
      emailId: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNo: "",
      mobile: "",
    };
    var mailFormat = /^\d{10}$/;
    let isFormValid = true;

    //validating FirstName
    if (!firstName.trim())
      formErrors.firstName = errorMessages.PROVIDE_FIRST_NAME;
    else if (!validateName(firstName))
      formErrors.firstName = "*Please enter valid first name";
    else if (firstName.length >= 13)
      formErrors.firstName =
        "*First name shouldn't be more than 13 characters.";
    else formErrors.firstName = "";

    //validating LastName
    if (!lastName.trim()) formErrors.lastName = errorMessages.PROVIDE_LAST_NAME;
    else if (!validateName(lastName))
      formErrors.lastName = "*Please enter valid last name";
    else if (lastName.length >= 13)
      formErrors.lastName =
        "*Last name shouldn't be more than than 13 characters.";
    else formErrors.lastName = "";

    //validating password
    if (!password.trim()) formErrors.password = errorMessages.PROVIDE_PASSWORD;
    else if (!validatePassword(password))
      formErrors.password = errorMessages.PROVIDE_VALID_PASSWORD;
    else formErrors.password = "";

    //validating Email
    if (!emailId.trim()) formErrors.emailId = errorMessages.PROVIDE_EMAIL;
    else if (!validateEmail(emailId))
      formErrors.emailId = errorMessages.PROVIDE_VALID_EMAIL;
    else if (emailId.length > 320)
      formErrors.emailId = "*Such long emailId isn't acceptible";
    else formErrors.emailId = "";

    if (mobile.length) {
      if (!mailFormat.test(mobile))
        formErrors.mobile = "Please enter vaild phone number";
      else formErrors.mobile = "";
    }

    if (
      formErrors.emailId !== "" ||
      formErrors.password !== "" ||
      formErrors.firstName !== "" ||
      formErrors.lastName !== "" ||
      formErrors.mobile !== ""
    ) {
      isFormValid = false;
    }

    setErrors(formErrors);
    setIsFormValid(isFormValid);
    return isFormValid;
  };
  /******************* 
  @Purpose : Used for admin register
  @Parameter : event
  @Author : INIC
  ******************/
  const adminRegister = async (event) => {
    event.preventDefault();
    try {
      if (validateForm()) {
        setLoading(true);
        let phone = "";
        if (mobile) {
          phone = mobile.replace(/[^0-9]/g, "");
        }
        let bodyWithMobile = {
          emailId,
          password,
          firstname: firstName,
          lastname: lastName,
          mobile: `+91-${phone}`,
        };

        let body = {
          emailId,
          password,
          firstname: firstName,
          lastname: lastName,
          // mobile: ""
        };
        localStorage.setItem("mobileNo", bodyWithMobile.mobile);
        if (mobile === "") {
          const data = await props.callApi(
            API.REGISTER,
            body,
            "post",
            "ADMIN_LOGIN",
            false,
            false,
            ADMIN_URL
          );
          setLoading(false);
          if (data.status === 1) {
            showMessageNotification(data.message,'success')
            props.history.push("/");
          }
        } else if (mobile.length && mobile !== "") {
          const data = await props.callApi(
            API.REGISTER,
            bodyWithMobile,
            "post",
            "ADMIN_LOGIN",
            false,
            false,
            ADMIN_URL
          );
          setLoading(false);
          if (data.status === 1) {
            showMessageNotification(data.message,'success')
            props.history.push("/otp");
            localStorage.setItem("otp", data.otp);
          }
        }
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  /******************* 
  @Purpose : Used for render tooltip
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
                          <h4 className="mb-2 mt-2">Sign Up</h4>
                        </div>
                        <div className="text-center">
                          <p className="common-small-text">
                            <small>
                              Please enter your details to sign up and be part
                              of our great community
                            </small>
                          </p>
                        </div>
                      </div>
                      <div className="card-content">
                        <div className="card-body">
                          <form
                            autoComplete="off"
                            onSubmit={(evt) => adminRegister(evt)}
                          >
                            <div className="row">
                              <div className="form-group col-md-6">
                                <label for="firstName">
                                  First Name<sup className="text-danger">*</sup>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="firstName"
                                  placeholder="First Name"
                                  value={firstName}
                                  onChange={(e) => {
                                    setfirstName(e.target.value);
                                    errors = Object.assign(errors, {
                                      firstName: "",
                                    });
                                    setErrors(errors);
                                  }}
                                />
                                <span
                                  className="error-msg"
                                  style={{ color: "red" }}
                                >
                                  {errors.firstName}
                                </span>
                              </div>
                              <div className="form-group col-md-6">
                                <label for="lastName">
                                  Last Name<sup className="text-danger">*</sup>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="lastName"
                                  placeholder="Last Name"
                                  value={lastName}
                                  name={lastName}
                                  onChange={(e) => {
                                    setlastName(e.target.value);
                                    errors = Object.assign(errors, {
                                      lastName: "",
                                    });
                                    setErrors(errors);
                                  }}
                                />
                                <span
                                  className="error-msg"
                                  style={{ color: "red" }}
                                >
                                  {errors.lastName}
                                </span>
                              </div>
                            </div>
                            <div className="form-group mb-5">
                              <label className="mb-0" for="PhoneNumber">
                                Phone Number
                              </label>
                              <div className="input-group">
                                <PhoneInput
                                  className="form-control"
                                  name="phone"
                                  country={"in"}
                                  masks={""}
                                  countryCodeEditable={false}
                                  onChange={handleOnChanges}
                                />
                              </div>
                              <span
                                className="error-msg"
                                style={{ color: "red" }}
                              >
                                {errors.mobile}
                              </span>
                            </div>

                            <div className="form-group mb-2">
                              <label for="EmailAddress">
                                Email address
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
                                placeholder="Enter Email"
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
                            <div className="form-group mb-4 position-relative">
                              <label for="password-field">
                                Password<sup className="text-danger">*</sup>
                              </label>
                              <input
                                id="password"
                                type={hidden ? "password" : "text"}
                                className="form-control"
                                name="password"
                                placeholder="Password"
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
                              <span
                                className="error-msg"
                                style={{ color: "red" }}
                              >
                                {errors.password}
                              </span>
                            </div>
                            <Button
                              type="button"
                              type="submit"
                              className="btn btn-primary glow position-relative btn-block"
                              onClick={(evt) => adminRegister(evt)}
                            >
                              {loading ? "Loading..." : "	Sign Up"}

                              <i className="icon-arrow bx bx-right-arrow-alt"></i>
                            </Button>
                          </form>
                          <div className="text-center common-small-text mt-3 mb-4">
                            <small>
                              Already have an account?{" "}
                              <Link to="/">Sign in</Link>
                            </small>
                          </div>
                          <div className="divider">
                            <div className="divider-text text-uppercase text-muted">
                              <small>or Sign Up with</small>
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
export default connect(null, { callApi })(Register);
