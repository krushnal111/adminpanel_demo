import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { callApi } from "../../api"; // Used for api call
import { validateIDSecret , showMessageNotification} from "./../../utils/Functions"; // Utility functions
import { Card, Accordion, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import errorMessages from "../../utils/ErrorMessages";
import API from "../../api/Routes";
import { ADMIN_URL } from "../../config";

/******************* 
@Purpose : Used for payment
@Parameter : props
@Author : INIC
******************/
function PaymentGateWay(props) {
  const [stripeStatus, setStripeStatus] = useState(false);
  const [stripeEnvironment, setStripeEnvironment] = useState("");
  const [publicAPILoginId, setPublicAPILoginId] = useState("");
  const [testTransactionKey, setTestTransactionKey] = useState("");
  const [publicTransactionKey, setPublicTransactionKey] = useState("");
  const [
    publicTransactionKeyDisable,
    setPublicTransactionKeyDisable,
  ] = useState(false);
  const [testTransactionKeyDisable, setTestTransactionKeyDisable] = useState(
    false
  );
  const [radioFlagStripeTest, setRadioFlagStripeTest] = useState(false);
  const [radioFlagStripePublic, setRadioFlagStripePublic] = useState(false);
  const [paypalStatus, setPaypalStatus] = useState(false);
  const [paypalEnvironment, setPaypalEnvironment] = useState("");
  const [ppPublicAPILoginId, setPpPublicAPILoginId] = useState("");
  const [ppTestTransactionKey, setPpTestTransactionKey] = useState("");
  const [ppPublicTransactionKey, setPpPublicTransactionKey] = useState("");
  const [
    ppPublicTransactionKeyDisable,
    setPpPublicTransactionKeyDisable,
  ] = useState(false);
  const [
    pptestTransactionKeyDisable,
    setPpTestTransactionKeyDisable,
  ] = useState(false);
  const [ppRadioFlagTest, setPpRadioFlagTest] = useState(false);
  const [ppRadioFlagPublic, setPpRadioFlagPublic] = useState(false);
  const [, setIsFormValid] = useState(true);
  let [menuToggleStripe, setMenuToggleStripe] = useState(false);
  let [menuTogglePaypal, setMenuTogglePaypal] = useState(false);
  let [errors, setErrors] = useState({});

  useEffect(() => {
    getpaymentDetailsStripe();
    getpaymentDetailsPaypal();
  }, []);
  /******************* 
  @Purpose : Used for get stripe payment
  @Parameter : {}
  @Author : INIC
  ******************/
  const getpaymentDetailsStripe = async () => {
    const response = await props.callApi(
      API.GET_PAYMENT_DETAILS,
      "",
      "get",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      let {
        status,
        environment,
        publicAPILoginId,
        testTransactionKey,
        publicTransactionKey,
        activeTransactionKey,
      } = response.data && response.data.stripe;
      setStripeStatus(status);
      setStripeEnvironment(environment);
      setPublicAPILoginId(publicAPILoginId);
      if (activeTransactionKey === "Test") {
        setRadioFlagStripeTest(true);
        setRadioFlagStripePublic(false);
        setTestTransactionKeyDisable(false);
        setPublicTransactionKeyDisable(true);
        setTestTransactionKey(testTransactionKey);
        setPublicTransactionKey("");
      } else if (activeTransactionKey === "Public") {
        setRadioFlagStripeTest(false);
        setRadioFlagStripePublic(true);
        setTestTransactionKeyDisable(true);
        setPublicTransactionKeyDisable(false);
        setTestTransactionKey("");
        setPublicTransactionKey(publicTransactionKey);
      }
    }
  };
  /******************* 
  @Purpose : Used for get paypal payment
  @Parameter : {}
  @Author : INIC
  ******************/
  const getpaymentDetailsPaypal = async () => {
    const response = await props.callApi(
      API.GET_PAYMENT_DETAILS,
      "",
      "get",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      let {
        status,
        environment,
        publicAPILoginId,
        testTransactionKey,
        publicTransactionKey,
        activeTransactionKey,
      } = response.data && response.data.paypal;
      setPaypalStatus(status);
      setPaypalEnvironment(environment);
      setPpPublicAPILoginId(publicAPILoginId);
      if (activeTransactionKey === "Test") {
        setPpRadioFlagTest(true);
        setPpRadioFlagPublic(false);
        setPpPublicTransactionKeyDisable(true);
        setPpTestTransactionKeyDisable(false);
        setPpTestTransactionKey(testTransactionKey);
        setPpPublicTransactionKey("");
      } else if (activeTransactionKey === "Public") {
        setPpRadioFlagTest(false);
        setPpRadioFlagPublic(true);
        setPpPublicTransactionKeyDisable(false);
        setPpTestTransactionKeyDisable(true);
        setPpTestTransactionKey("");
        setPpPublicTransactionKey(publicTransactionKey);
      }
    }
  };
  /******************* 
  @Purpose : Used for validate payment form
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    let errors = {
      stripeEnvironment: "",
      publicAPILoginId: "",
      testTransactionKey: "",
      publicTransactionKey: "",
      paypalEnvironment: "",
      ppPublicAPILoginId: "",
      ppPublicTransactionKey: "",
      ppTestTransactionKey: "",
    };
    let isFormValid = true;

    //For stripe
    if (!stripeEnvironment.trim())
      errors.stripeEnvironment = errorMessages.PROVIDE_ENVIRONMENT;
    else if (!validateIDSecret(stripeEnvironment))
      errors.stripeEnvironment = errorMessages.PROVIDE_VALID_ENVIRONMENT;
    else errors.stripeEnvironment = "";

    if (!publicAPILoginId.trim())
      errors.publicAPILoginId = errorMessages.PROVIDE_PUBLIC_API_ID;
    else if (!validateIDSecret(publicAPILoginId))
      errors.publicAPILoginId = errorMessages.PROVIDE_VALID_API_ID;
    else errors.publicAPILoginId = "";

    if (!testTransactionKeyDisable) {
      if (!testTransactionKey.trim())
        errors.testTransactionKey = errorMessages.PROVIDE_TEST_TRANSACTION_KEY;
      else if (!validateIDSecret(testTransactionKey))
        errors.testTransactionKey =
          errorMessages.PROVIDE_VALID_TEST_TRANSACTION_KEY;
      else errors.testTransactionKey = "";
      errors.publicTransactionKey = "";
    }

    if (!publicTransactionKeyDisable) {
      if (!publicTransactionKey.trim())
        errors.publicTransactionKey =
          errorMessages.PROVIDE_PUBLIC_TRANSACTION_KEY;
      else if (!validateIDSecret(publicTransactionKey))
        errors.publicTransactionKey =
          errorMessages.PROVIDE_VALID_PUBLIC_TRANSACTION_KEY;
      else errors.publicTransactionKey = "";
      errors.testTransactionKey = "";
    }

    // For paypal

    if (!paypalEnvironment.trim())
      errors.paypalEnvironment = errorMessages.PROVIDE_ENVIRONMENT;
    else if (!validateIDSecret(paypalEnvironment))
      errors.paypalEnvironment = errorMessages.PROVIDE_VALID_ENVIRONMENT;
    else errors.paypalEnvironment = "";

    if (!ppPublicAPILoginId.trim())
      errors.ppPublicAPILoginId = errorMessages.PROVIDE_PUBLIC_API_ID;
    else if (!validateIDSecret(ppPublicAPILoginId))
      errors.ppPublicAPILoginId = errorMessages.PROVIDE_VALID_API_ID;
    else errors.ppPublicAPILoginId = "";

    if (!pptestTransactionKeyDisable) {
      if (!ppTestTransactionKey.trim())
        errors.ppTestTransactionKey =
          errorMessages.PROVIDE_TEST_TRANSACTION_KEY;
      else if (!validateIDSecret(ppTestTransactionKey))
        errors.ppTestTransactionKey =
          errorMessages.PROVIDE_VALID_TEST_TRANSACTION_KEY;
      else errors.ppTestTransactionKey = "";
    }

    if (!ppPublicTransactionKeyDisable) {
      if (!ppPublicTransactionKey.trim())
        errors.ppPublicTransactionKey =
          errorMessages.PROVIDE_PUBLIC_TRANSACTION_KEY;
      else if (!validateIDSecret(ppPublicTransactionKey))
        errors.ppPublicTransactionKey =
          errorMessages.PROVIDE_VALID_PUBLIC_TRANSACTION_KEY;
      else errors.ppPublicTransactionKey = "";
    }

    if (
      errors.stripeEnvironment !== "" ||
      errors.publicAPILoginId !== "" ||
      errors.testTransactionKey !== "" ||
      errors.publicTransactionKey !== "" ||
      errors.paypalEnvironment !== "" ||
      errors.ppPublicAPILoginId !== "" ||
      errors.ppTestTransactionKey !== "" ||
      errors.ppPublicTransactionKey !== ""
    )
      isFormValid = false;
    else isFormValid = true;

    setErrors(errors);
    setIsFormValid(isFormValid);
    return isFormValid;
  };
  /******************* 
  @Purpose : Used for save payment details
  @Parameter : {}
  @Author : INIC
  ******************/
  const savePaymentDetails = async () => {
    if (validateForm()) {
      let bodyStripe, bodyPaypal, body;
      if (testTransactionKeyDisable) {
        bodyStripe = {
          stripe: {
            status: stripeStatus,
            environment: stripeEnvironment,
            publicAPILoginId: publicAPILoginId,
            publicTransactionKey: publicTransactionKey,
            activeTransactionKey: "Public",
          },
        };
      } else {
        bodyStripe = {
          stripe: {
            status: stripeStatus,
            environment: stripeEnvironment,
            publicAPILoginId: publicAPILoginId,
            testTransactionKey: testTransactionKey,
            activeTransactionKey: "Test",
          },
        };
      }

      if (pptestTransactionKeyDisable) {
        bodyPaypal = {
          paypal: {
            status: paypalStatus,
            environment: paypalEnvironment,
            publicAPILoginId: ppPublicAPILoginId,
            testTransactionKey: ppTestTransactionKey,
            publicTransactionKey: ppPublicTransactionKey,
            activeTransactionKey: "Public",
          },
        };
      } else {
        bodyPaypal = {
          paypal: {
            status: paypalStatus,
            environment: paypalEnvironment,
            publicAPILoginId: ppPublicAPILoginId,
            testTransactionKey: ppTestTransactionKey,
            publicTransactionKey: ppPublicTransactionKey,
            activeTransactionKey: "Test",
          },
        };
      }
      body = { ...bodyStripe, ...bodyPaypal };

      const response = await props.callApi(
        API.ADD_PAYEMENT_DETAILS,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Details added  successfully", "success")
        getpaymentDetailsStripe();
        getpaymentDetailsPaypal();
      }
    }
  };
  /******************* 
  @Purpose : Used for set test transection 
  @Parameter : {}
  @Author : INIC
  ******************/
  const setTestTransactionHandler = () => {
    setPublicTransactionKeyDisable(true);
    setTestTransactionKeyDisable(false);
    setPublicTransactionKey("");
    setRadioFlagStripeTest(true);
    setRadioFlagStripePublic(false);
  };
  /******************* 
  @Purpose : Used for set public transection
  @Parameter : {}
  @Author : INIC
  ******************/
  const setPublicTransactionHandler = () => {
    setTestTransactionKeyDisable(true);
    setPublicTransactionKeyDisable(false);
    setTestTransactionKey("");
    setRadioFlagStripeTest(false);
    setRadioFlagStripePublic(true);
  };
  /******************* 
  @Purpose : Used for set PP test transection 
  @Parameter : {}
  @Author : INIC
  ******************/
  const setPPTestTransactionHandler = () => {
    setPpPublicTransactionKeyDisable(true);
    setPpTestTransactionKeyDisable(false);
    setPpPublicTransactionKey("");
    setPpRadioFlagTest(true);
    setPpRadioFlagPublic(false);
  };
  /******************* 
  @Purpose : Used for set PP public transection 
  @Parameter : {}
  @Author : INIC
  ******************/
  const setPPPublicTransactionHandler = () => {
    setPpTestTransactionKeyDisable(true);
    setPpPublicTransactionKeyDisable(false);
    setPpTestTransactionKey("");
    setPpRadioFlagTest(false);
    setPpRadioFlagPublic(true);
  };
  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="content-header-title">Payment Gateway</li>
                <li className="breadcrumb-item">
                  <Link onClick={() => props.history.push("/dashboard")}>
                    <i className="bx bx-home-alt" />
                  </Link>
                </li>

                <li className="breadcrumb-item">Settings</li>
                <li className="breadcrumb-item active" aria-current="page">
                  Payment Gateway
                </li>
              </ol>
            </nav>
            <div className="card notification-card">
              <Accordion defaultActiveKey="">
                <Card className="custom-accordian">
                  <Card.Header>
                    <div className="collapse-title d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="mr-md-6 mr-3">
                          <img src="assets/images/stripe.svg" alt="logo" />
                        </div>
                        <div>
                          <h5 className="mb-1">Stripe</h5>
                          <h6 className="mb-0">Stripe - Settings</h6>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="custom-control custom-switch light">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="stripeStatus"
                              checked={stripeStatus}
                              onChange={(e) => setStripeStatus(!stripeStatus)}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="stripeStatus"
                            />
                          </div>
                          <label className="text-primary mt-1 mb-0">
                            Enabled
                          </label>
                        </div>
                        <Accordion.Toggle
                          as={Button}
                          variant="link"
                          eventKey="0"
                          onClick={() => setMenuToggleStripe(!menuToggleStripe)}
                          className={
                            menuToggleStripe ? "arrow-down" : "arrow-up"
                          }
                        >
                          <div
                            className="collapse-arrow"
                            data-toggle="collapse"
                            data-target="#collapseOne"
                            aria-expanded="true"
                            aria-controls="collapseOne"
                          >
                            <div className="arrow"></div>
                          </div>
                        </Accordion.Toggle>
                      </div>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <form action="#">
                        <div className="row">
                          <div className="form-group col-md-6 mb-5">
                            <label htmlFor="StripeEnvironment">
                              Stripe Environment
                              <sup className="text-danger">*</sup>
                            </label>
                            <input
                              type="text"
                              id="stripeEnvironment"
                              name="stripeEnvironment"
                              className="form-control"
                              placeholder="Enter here"
                              value={stripeEnvironment}
                              onChange={(e) => {
                                setStripeEnvironment(e.target.value);
                                errors = Object.assign(errors, {
                                  stripeEnvironment: "",
                                });
                                setErrors(errors);
                              }}
                            />
                            <span
                              className="error-msg"
                              style={{ color: "red" }}
                            >
                              {errors.stripeEnvironment}
                            </span>
                          </div>
                          <div className="form-group col-md-6 mb-5">
                            <label htmlFor="PublicApi">
                              Public API Login ID
                              <sup className="text-danger">*</sup>
                            </label>
                            <input
                              type="text"
                              id="publicAPILoginId"
                              name="publicAPILoginId"
                              className="form-control"
                              placeholder="Enter here"
                              value={publicAPILoginId}
                              onChange={(e) => {
                                setPublicAPILoginId(e.target.value);
                                errors = Object.assign(errors, {
                                  publicAPILoginId: "",
                                });
                                setErrors(errors);
                              }}
                            />
                            <span
                              className="error-msg"
                              style={{ color: "red" }}
                            >
                              {errors.publicAPILoginId}
                            </span>
                          </div>
                          <div className="col-md-6">
                            <div className="custom-radio">
                              <label
                                htmlFor="StripeTest"
                                className="w-100 d-flex align-items-center pl-5 mb-0"
                              >
                                <input
                                  type="radio"
                                  name="cssradio"
                                  id="StripeTest"
                                  autoComplete="off"
                                  onClick={() => setTestTransactionHandler()}
                                  checked={radioFlagStripeTest ? true : false}
                                />
                                <span />
                                <div className="form-group w-100">
                                  <label
                                    htmlFor="TestTransactionKey"
                                    className="p-0 mb-1 text-uppercase"
                                  >
                                    Stripe Test Transaction Key
                                    {radioFlagStripeTest ? (
                                      <sup className="text-danger">*</sup>
                                    ) : null}
                                  </label>
                                  <input
                                    type="text"
                                    id="testTransactionKey"
                                    name="testTransactionKey"
                                    className="form-control"
                                    placeholder="Enter here"
                                    disabled={
                                      testTransactionKeyDisable ? true : false
                                    }
                                    value={testTransactionKey}
                                    onChange={(e) => {
                                      setTestTransactionKey(e.target.value);
                                      errors = Object.assign(errors, {
                                        testTransactionKey: "",
                                      });
                                      setErrors(errors);
                                    }}
                                  />
                                  <span
                                    className="error-msg"
                                    style={{ color: "red" }}
                                  >
                                    {errors.testTransactionKey}
                                  </span>
                                </div>
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="custom-radio">
                              <label
                                htmlFor="StripePublic"
                                className="w-100 d-flex align-items-center pl-5 mb-0"
                              >
                                <input
                                  type="radio"
                                  name="cssradio"
                                  id="StripePublic"
                                  autoComplete="off"
                                  onClick={() => setPublicTransactionHandler()}
                                  checked={radioFlagStripePublic ? true : false}
                                />
                                <span />
                                <div className="form-group w-100">
                                  <label
                                    htmlFor="StripePublic"
                                    className="p-0 mb-1 text-uppercase"
                                  >
                                    Stripe Public Transaction Key
                                    {radioFlagStripePublic ? (
                                      <sup className="text-danger">*</sup>
                                    ) : null}
                                  </label>
                                  <input
                                    type="text"
                                    id="publicTransactionKey"
                                    name="publicTransactionKey"
                                    className="form-control"
                                    placeholder="Enter here"
                                    disabled={
                                      publicTransactionKeyDisable ? true : false
                                    }
                                    value={publicTransactionKey}
                                    onChange={(e) => {
                                      setPublicTransactionKey(e.target.value);
                                      errors = Object.assign(errors, {
                                        publicTransactionKey: "",
                                      });
                                      setErrors(errors);
                                    }}
                                  />
                                  <span
                                    className="error-msg"
                                    style={{ color: "red" }}
                                  >
                                    {errors.publicTransactionKey}
                                  </span>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </form>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card className="custom-accordian">
                  <Card.Header>
                    <div className="collapse-title d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="mr-md-6 mr-3">
                          <img src="assets/images/paypal.svg" alt="logo" />
                        </div>
                        <div>
                          <h5 className="mb-1">PayPal</h5>
                          <h6 className="mb-0">PayPal - Settings</h6>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="custom-control custom-switch light">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="paypalStatus"
                              checked={paypalStatus}
                              onChange={() => setPaypalStatus(!paypalStatus)}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="paypalStatus"
                            />
                          </div>
                          <label className="text-primary mt-1 mb-0">
                            Enabled
                          </label>
                        </div>
                        <Accordion.Toggle
                          as={Button}
                          variant="link"
                          eventKey="1"
                          onClick={() => setMenuTogglePaypal(!menuTogglePaypal)}
                          className={
                            menuTogglePaypal ? "arrow-down" : "arrow-up"
                          }
                        >
                          <div
                            className="collapse-arrow"
                            data-toggle="collapse"
                            data-target="#collapseTwo"
                            aria-expanded="false"
                            aria-controls="collapseTwo"
                          >
                            <div className="arrow"></div>
                          </div>
                        </Accordion.Toggle>
                      </div>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>
                      <form action="#">
                        <div className="row">
                          <div className="form-group col-md-6 mb-5">
                            <label htmlFor="StripeEnvironment">
                              Paypal Environment
                              <sup className="text-danger">*</sup>
                            </label>
                            <input
                              type="text"
                              id="paypalEnvironment"
                              name="paypalEnvironment"
                              className="form-control"
                              placeholder="Enter here"
                              value={paypalEnvironment}
                              onChange={(e) => {
                                setPaypalEnvironment(e.target.value);
                                errors = Object.assign(errors, {
                                  paypalEnvironment: "",
                                });
                                setErrors(errors);
                              }}
                            />
                            <span
                              className="error-msg"
                              style={{ color: "red" }}
                            >
                              {errors.paypalEnvironment}
                            </span>
                          </div>
                          <div className="form-group col-md-6 mb-5">
                            <label htmlFor="PublicApi">
                              Public API Login ID
                              <sup className="text-danger">*</sup>
                            </label>
                            <input
                              type="text"
                              id="ppPublicAPILoginId"
                              name="ppPublicAPILoginId"
                              className="form-control"
                              placeholder="Enter here"
                              value={ppPublicAPILoginId}
                              onChange={(e) => {
                                setPpPublicAPILoginId(e.target.value);
                                errors = Object.assign(errors, {
                                  ppPublicAPILoginId: "",
                                });
                                setErrors(errors);
                              }}
                            />
                            <span
                              className="error-msg"
                              style={{ color: "red" }}
                            >
                              {errors.ppPublicAPILoginId}
                            </span>
                          </div>
                          <div className="col-md-6">
                            <div className="custom-radio">
                              <label
                                htmlFor="PaypalTest"
                                className="w-100 d-flex align-items-center pl-5 mb-0"
                              >
                                <input
                                  type="radio"
                                  name="cssradio"
                                  id="PaypalTest"
                                  autoComplete="off"
                                  onClick={() => setPPTestTransactionHandler()}
                                  checked={ppRadioFlagTest ? true : false}
                                />
                                <span />
                                <div className="form-group w-100">
                                  <label
                                    htmlFor="StripeTest"
                                    className="p-0 mb-1 text-uppercase"
                                  >
                                    Paypal Test Transaction Key
                                    {ppRadioFlagTest ? (
                                      <sup className="text-danger">*</sup>
                                    ) : null}
                                  </label>
                                  <input
                                    type="text"
                                    id="ppTestTransactionKey"
                                    name="ppTestTransactionKey"
                                    className="form-control"
                                    placeholder="Enter here"
                                    disabled={
                                      pptestTransactionKeyDisable ? true : false
                                    }
                                    value={ppTestTransactionKey}
                                    onChange={(e) => {
                                      setPpTestTransactionKey(e.target.value);
                                      errors = Object.assign(errors, {
                                        ppTestTransactionKey: "",
                                      });
                                      setErrors(errors);
                                    }}
                                  />
                                  <span
                                    className="error-msg"
                                    style={{ color: "red" }}
                                  >
                                    {errors.ppTestTransactionKey}
                                  </span>
                                </div>
                              </label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="custom-radio">
                              <label
                                htmlFor="PaypalPublic"
                                className="w-100 d-flex align-items-center pl-5 mb-0"
                              >
                                <input
                                  type="radio"
                                  name="cssradio"
                                  id="PaypalPublic"
                                  autoComplete="off"
                                  onClick={() =>
                                    setPPPublicTransactionHandler()
                                  }
                                  checked={ppRadioFlagPublic ? true : false}
                                />
                                <span />
                                <div className="form-group w-100">
                                  <label
                                    htmlFor="StripePublic"
                                    className="p-0 mb-1 text-uppercase"
                                  >
                                    Paypal Public Transaction Key
                                    {ppRadioFlagPublic ? (
                                      <sup className="text-danger">*</sup>
                                    ) : null}
                                  </label>
                                  <input
                                    type="text"
                                    id="ppPublicTransactionKey"
                                    name="ppPublicTransactionKey"
                                    className="form-control"
                                    placeholder="Enter here"
                                    disabled={
                                      ppPublicTransactionKeyDisable
                                        ? true
                                        : false
                                    }
                                    value={ppPublicTransactionKey}
                                    onChange={(e) => {
                                      setPpPublicTransactionKey(e.target.value);
                                      errors = Object.assign(errors, {
                                        ppPublicTransactionKey: "",
                                      });
                                      setErrors(errors);
                                    }}
                                  />
                                  <span
                                    className="error-msg"
                                    style={{ color: "red" }}
                                  >
                                    {errors.ppPublicTransactionKey}
                                  </span>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </form>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              <div className="text-right mt-2">
                <button
                  className="btn btn-primary"
                  onClick={savePaymentDetails}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
          <footer className="mt-4">
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
export default connect(null, { callApi })(PaymentGateWay);
