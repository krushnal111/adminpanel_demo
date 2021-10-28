import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { callApi } from "../../api"; // Used for api call
import API from "../../api/Routes";
import OtpInput from "react-otp-input";
import { showMessageNotification , getItem, removeItem} from "../../utils/Functions"; // Utility functions
/******************* 
@Purpose : Used for OTP varifications
@Parameter : props
@Author : INIC
******************/
function OtpPage(props) {
  const [otp, setOTP] = useState("");
  const [errors, setErrors] = useState({ otp: "" });
  let [, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(330);
  const [, setDone] = useState(false);
  const foo = useRef();

  useEffect(() => {
    function tick() {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }
    foo.current = setInterval(() => tick(), 1000);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      clearInterval(foo.current);
      setDone(true);
    }
  }, [seconds]);

  useEffect(() => {
    showMessageNotification(getItem("otp"), "success", 10000);
  }, []);

  /******************* 
  @Purpose : Used for verify OTP
  @Parameter : {}
  @Author : INIC
  ******************/
  const handleVerifyOTP = async () => {
    validateOtp();
    let body = {
      mobile: getItem("mobileNo"),
      otpType: "NewAdmin",
      otp: otp,
    };
    try {
      if (validateOtp()) {
        const data = await props.callApi(
          API.VERIFY_OTP,
          body,
          "post",
          null,
          true,
          false,
          "http://localhost:4041/admin"
        );
        // const data = await props.callApi(API.VERIFY_OTP, body, "post", false, false, "http://localhost:4041/admin");
        if (data.status === 1) {
          showMessageNotification(data.message, "success");
          props.history.push("/");
        }
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  /******************* 
  @Purpose : Used for validate OTP
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateOtp = () => {
    if (otp.length !== 6) {
      errors.otp = "Please enter 6-digit OTP";
      setErrors(errors);
      return false;
    } else return true;
  };
  /******************* 
  @Purpose : Used for resend OTP
  @Parameter : {}
  @Author : INIC
  ******************/
  const handleResendOtp = async (e) => {
    let body = {
      mobile: getItem("mobileNo"),
      otpType: "NewAdmin",
    };
    const response = await props.callApi(API.SENDOTP, body, "post");
    if (response.status === 1) {
      showMessageNotification(response.message, "success");
      removeItem("otp");
      showMessageNotification(response.otp, "success", 10000);
    }
  };
  /******************* 
  @Purpose : Used for OTP expiry time
  @Parameter : {}
  @Author : INIC
  ******************/
  let display = () => {
    const format = (val) => `0${Math.floor(val)}`.slice(-2);
    const minutes = (seconds % 3600) / 60;
    return [minutes, seconds % 60].map(format).join(":");
  };
  /******************* 
  @Purpose : Used for change OTP
  @Parameter : {}
  @Author : INIC
  ******************/
  const handleChangeOTP = (newOtp) => {
    let data = Object.assign(errors, { otp: "" });
    setOTP(newOtp);
    setErrors(data);
  };

  return (
    <div
      className="login-wrapper"
      style={{
        background: "url(assets/images/login-bg.jpg) no-repeat center center",
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
                    <a className="back d-flex align-items-center">
                      <i className="bx bxs-chevron-left" />
                      <span className="d-block">
                        <Link to="/register">Back</Link>
                      </span>
                    </a>
                    <div className="card-header">
                      <div className="card-title text-center mb-4">
                        <h4 className="mb-2 mt-2">Verify your Mobile Number</h4>
                        <h3>
                          <span id="countdown"></span>
                        </h3>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="card-body">
                        <div className="text-center mb-4">
                          <small className="d-block common-small-text">
                            A 6-digit code has been sent to
                            <span className="d-block text-primary">
                              {getItem("mobileNo")}
                            </span>
                          </small>
                        </div>
                        <form
                          method="get"
                          className="digit-group pt-2 pb-2"
                          data-group-name="digits"
                          data-autosubmit="false"
                          autoComplete="off"
                        >
                          <OtpInput
                            value={otp}
                            onChange={(newOtp) => handleChangeOTP(newOtp)}
                            numInputs={6}
                            isInputNum={true}
                            hasErrored={true}
                            separator={<span>-</span>}
                            inputStyle="form-control"
                          />
                        </form>
                        <span
                          className="error-msg text-center d-block"
                          id="otpError"
                          style={{ color: "red" }}
                        >
                          {errors.otp}
                        </span>
                        <span className="text-danger error-msg"></span>
                        <div className="text-center common-small-text mt-4 mb-2">
                          <small>The OTP will be expired in</small>{" "}
                          <small className="text-primary">
                            <span>{display()}</span>
                          </small>
                        </div>
                        <div className="text-center common-small-text mt-2 mb-5">
                          <small>Didn’t receive the code?</small>{" "}
                          <a onClick={handleResendOtp}>
                            <small>Resend</small>
                          </a>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary glow position-relative btn-block"
                          onClick={handleVerifyOTP}
                        >
                          Verify OTP
                          <i className="icon-arrow bx bx-right-arrow-alt" />
                        </button>
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
                        alt="forgot password"
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
  );
}
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(null, { callApi })(OtpPage);
