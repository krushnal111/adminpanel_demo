import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { callApi } from "../../api"; // Used for api call
import {
  validateEmail,
  showMessageNotification,
} from "./../../utils/Functions"; // Utility functions
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import { Select as Aselect } from 'antd'
import { isEmpty } from "lodash";
import PhoneInput from "react-phone-input-2";
import { connect } from "react-redux";
import OtpInput from "react-otp-input";
import errorMessages from "../../utils/ErrorMessages";
import countryList from "react-select-country-list";
import API from "../../api/Routes";
import CropImagesProfile from "../../components/CropImages/CropImagesProfile";
import { ADMIN_URL, IMG_URL } from "../../config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Layout from "../../components/Layout/Layout";
var { Option } = Aselect;
/******************* 
@Purpose : Used for profile view
@Parameter : props
@Author : INIC
******************/
function Profile(props) {
  const options = countryList().getData();
  const [photo, setPhoto] = useState("");
  const [lang] = useTranslation("language");
  const [birthday, setBirthday] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    gender: "Male",
    dob: "",
    photo: "",
    website: "",
    mobile: "",
    address: "",
    country: "",
    twitterLink: "",
    fbLink: "",
    instagramLink: "",
    gitHubLink: "",
    codePen: "",
    slack: "",
    errors: {},
  });
  let [loading, setLoading] = useState(false);
  let [, setdisablePhoneinput] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOTP] = useState("");
  const [otpError, setOTPError] = useState({ otp: "" });
  const [seconds, setSeconds] = useState(330);
  const [timezoneArray, setTimezoneArray] = useState([]);
  const [timeZone, setTimeZone] = useState("");
  const [, setDone] = useState(false);
  const [dateFormat, setDateFormat] = useState("");
  const [timeFormat, setTimeFormat] = useState("");
  const [currencyArray, setCurrencyArray] = useState([]);
  const [currency, setCurrency] = useState("");
  const [toUsd,setUsd] = useState(0);
  const [usdTo,setUsdTo] = useState(0)

  const foo = useRef();
  let {
    firstname,
    lastname,
    email,
    website,
    mobile,
    gender,
    address,
    country,
    twitterLink,
    fbLink,
    instagramLink,
    gitHubLink,
    codePen,
    errors,
  } = formData;
  const genderOption = [
    { value: "Female", label: "Female" },
    { value: "Male", label: "Male" },
  ];


  useEffect(() => {
    getAdminProfile();
  }, []);

  useEffect(() => {
    if (showOTPModal) {
      clearInterval(foo.current);
      setOTP("");
      setSeconds(330);
      function tick() {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }
      foo.current = setInterval(() => tick(), 1000);
    }
  }, [showOTPModal]);

  useEffect(() => {
    if (seconds === 0) {
      clearInterval(foo.current);
      setDone(true);
    }

    if (!showOTPModal) {
      clearInterval(foo.current);
    }
  }, [seconds]);

  /******************* 
  @Purpose : Used for validate form field
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    // for firstName
    if (formData.hasOwnProperty("firstname")) {
      if (isEmpty(firstname))
        errors.firstname = errorMessages.PROVIDE_FIRST_NAME;
      else delete errors.firstname;
    }
    //for lastName
    if (formData.hasOwnProperty("lastname")) {
      if (isEmpty(lastname)) errors.lastname = errorMessages.PROVIDE_LAST_NAME;
      else delete errors.lastname;
    }
    // for email
    if (formData.hasOwnProperty("email")) {
      if (isEmpty(email)) errors.email = errorMessages.PROVIDE_EMAIL;
      else if (!validateEmail(email))
        errors.email = errorMessages.PROVIDE_VALID_EMAIL;
      else delete errors.email;
    }
    //for address
    if (formData.hasOwnProperty("address")) {
      if (!isEmpty(address)) {
        if (address.length > 35) {
          errors.address = "Address shouldn't be more than 35 characters";
        }
      } else delete errors.address;
    } else delete errors.address;
    //for website
    let lowerWebsite = website && website.toLowerCase();
    if (formData.hasOwnProperty("website")) {
      if (!isEmpty(lowerWebsite)) {
        if (
          lowerWebsite.indexOf(" ") <= 0 &&
          lowerWebsite.includes("https://www.") &&
          !lowerWebsite.includes("..") &&
          !lowerWebsite.includes("///")
        )
          delete errors.website;
        else errors.website = errorMessages.PROVIDE_WEBSITE;
      } else {
        delete errors.website;
      }
    }
    //for twitterLink
    let lowerTwitterlink = twitterLink && twitterLink.toLowerCase();
    if (formData.hasOwnProperty("twitterLink")) {
      if (!isEmpty(lowerTwitterlink)) {
        if (
          lowerTwitterlink.indexOf(" ") <= 0 &&
          lowerTwitterlink.includes("https://www.twitter.com") &&
          !lowerTwitterlink.includes("..") &&
          !lowerTwitterlink.includes("///")
        )
          delete errors.twitterLink;
        else errors.twitterLink = errorMessages.PROVIDE_TWITTER;
      } else {
        delete errors.twitterLink;
      }
    }
    //for fbLink
    let lowerFbLink = fbLink && fbLink.toLowerCase();
    if (formData.hasOwnProperty("fbLink")) {
      if (!isEmpty(lowerFbLink)) {
        if (
          lowerFbLink.indexOf(" ") <= 0 &&
          lowerFbLink.includes("https://www.facebook.com") &&
          !lowerFbLink.includes("..") &&
          !lowerFbLink.includes("///")
        )
          delete errors.fbLink;
        else errors.fbLink = errorMessages.PROVIDE_FBURL;
      } else {
        delete errors.fbLink;
      }
    }
    //for instagramLink
    let lowerInstagramLink = instagramLink && instagramLink.toLowerCase();
    if (formData.hasOwnProperty("instagramLink")) {
      if (!isEmpty(lowerInstagramLink)) {
        if (
          lowerInstagramLink.indexOf(" ") <= 0 &&
          lowerInstagramLink.includes("https://www.instagram.com") &&
          !lowerInstagramLink.includes("..") &&
          !lowerInstagramLink.includes("///")
        )
          delete errors.instagramLink;
        else errors.instagramLink = errorMessages.PROVIDE_INSTAGRAM;
      } else {
        delete errors.instagramLink;
      }
    }
    //for gitHubLink
    let lowerGithubLink = gitHubLink && gitHubLink.toLowerCase();
    if (formData.hasOwnProperty("gitHubLink")) {
      if (!isEmpty(lowerGithubLink)) {
        if (
          lowerGithubLink.indexOf(" ") <= 0 &&
          lowerGithubLink.includes("https://www.github.com") &&
          !lowerGithubLink.includes("..") &&
          !lowerGithubLink.includes("///")
        )
          delete errors.gitHubLink;
        else errors.gitHubLink = errorMessages.PROVIDE_GITHUB;
      } else {
        delete errors.gitHubLink;
      }
    }
    //for codepen
    let lowerCodepen = codePen && codePen.toLowerCase();
    if (formData.hasOwnProperty("codePen")) {
      if (!isEmpty(lowerCodepen)) {
        if (
          lowerCodepen.indexOf(" ") <= 0 &&
          lowerCodepen.includes("https://www.codepen.com") &&
          !lowerCodepen.includes("..") &&
          !lowerCodepen.includes("///")
        )
          delete errors.codePen;
        else errors.codePen = errorMessages.PROVIDE_CODEPEN;
      } else {
        delete errors.codePen;
      }
    }
    delete errors.gender;
    const isFormvalid = Object.keys(errors).length !== 0 ? false : true;
    setFormData({
      ...formData,
      errors: errors,
    });
    return isFormvalid;
  };
  /******************* 
  @Purpose : Used for form data change
  @Parameter : e
  @Author : INIC
  ******************/
  const handleChange = (e) => {
    if (e.target.value) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        errors: Object.assign(formData.errors, { [e.target.name]: "" }),
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: "",
      });
    }
  };
  /******************* 
  @Purpose : Used for form data change
  @Parameter : value, data
  @Author : INIC
  ******************/
  const handleOnChanges = (value, data) => {
    setdisablePhoneinput(false);
    let dialnums = data.dialCode;
    let mobilenums = value.slice(data.dialCode.length);
    mobile = `+${dialnums}-${mobilenums}`;
    if (mobile.length >= 10) {
      setdisablePhoneinput(true);
    }
    setFormData({
      ...formData,
      mobile: mobile,
    });
  };
  /******************* 
  @Purpose : Used for select country
  @Parameter : val
  @Author : INIC
  ******************/
  const handleCountrySelector = (val) => {
    country = val;
    setFormData({
      ...formData,
      country: country,
    });
  };
  /******************* 
  @Purpose : Used for edit admin profile
  @Parameter : e
  @Author : INIC
  ******************/
  const editAdminProfile = async (e) => {
    e.preventDefault();
    let body = Object.assign({}, formData);
    body.dob = birthday;
    body.username = firstname + lastname;
    body.country = body.country && body.country.label && body.country.label;
    body.gender = body.gender && body.gender.label;
    body = Object.assign(body, { timeZone, timeFormat, dateFormat, currency })
    delete body.errors;
    if (validateForm()) {
      setLoading(true);
      const response = await props.callApi(
        API.UPDATE_PROFILE,
        body,
        "post",
        "EDITADMIN_PROFILE",
        true,
        false,
        ADMIN_URL
      );
      setLoading(false);
      if (response.status === 1) {
        showMessageNotification("Details updated successfully", "success");
      }
    }
  };
  /******************* 
  @Purpose : Used for get admin profile data
  @Parameter : {}
  @Author : INIC
  ******************/
  const getAdminProfile = async () => {
    const response = await props.callApi(
      API.GET_PROFILE,
      "",
      "get",
      "ADMIN_PROFILE",
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      let { data } = response,
        {
          firstname,
          lastname,
          emailId,
          mobile,
          photo,
          dob,
          gender,
          website,
          address,
          country,
          fbLink,
          twitterLink,
          instagramLink,
          gitHubLink,
          slack,
          codePen,
          timeZone,
          timeFormat,
          dateFormat,
          currency,
          usdTo,
          toUsd
        } = data;
      setFormData({
        ...formData,
        firstname,
        lastname,
        email: emailId,
        gender: {
          label: gender,
          value: gender,
        },
        photo,
        website,
        mobile,
        address,
        country: {
          label: country,
          value: country,
        },
        twitterLink,
        fbLink,
        instagramLink,
        gitHubLink,
        codePen,
        slack,
      });
      setBirthday(dob);
      setPhoto(photo);
      setTimeFormat(timeFormat);
      setTimeZone(timeZone);
      setDateFormat(dateFormat);
      setCurrency(currency);
      setUsd(toUsd)
      setUsdTo(usdTo)
    }
  };
  /******************* 
  @Purpose : Used for remove photos
  @Parameter : e
  @Author : INIC
  ******************/
  const removePhoto = async (e) => {
    e.preventDefault();
    var body = {
      emailId: email,
      firstname: firstname,
      lastname: lastname,
      mobile: mobile,
      photo: "",
    };
    const response = await props.callApi(
      API.UPDATE_PROFILE,
      body,
      "post",
      "EDITADMIN_PROFILE",
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      showMessageNotification("Details updated successfully", "success");
      getAdminProfile();
    }
  };
  /******************* 
  @Purpose : Used for change gender
  @Parameter : event
  @Author : INIC
  ******************/
  const genderHandler = (event) => {
    if (event.value && event.label) {
      setFormData({
        ...formData,
        gender: event,
      });
    } else {
      setFormData({
        ...formData,
        gender: "",
      });
    }
  };
  /******************* 
  @Purpose : Used for open OTP design modal
  @Parameter : e
  @Author : INIC
  ******************/
  const openOTPModal = () => {
    if (validateMobile()) {
      setShowOTPModal(true);
      handleSendOTP();
    }
  };


  /******************* 
@Purpose : Used for get all currencies
@Parameter : {}
@Author : INIC
******************/
  const GetAllCurrencies = async () => {
    const response = await props.callApi(
      API.GET_CURRENCY_list,
      "",
      "POST",
      null,
      true,
      false,
      ADMIN_URL
    );
    setCurrencyArray(response.data);
  };

  /******************* 
@Purpose : Used for get all timezone
@Parameter : {}
@Author : INIC
******************/
const GetAllTimezone = async () => {
  const response = await props.callApi(
    API.GET_TIMEZONE,
    "",
    "POST",
    null,
    true,
    false,
    ADMIN_URL
  );
  setTimezoneArray(response.data);
};

/******************* 
@Purpose : Used for get currency and rate
@Parameter : {}
@Author : INIC
******************/
const selectCurrency = async (value) => {
  let currency = currencyArray.find(c=>c.currency==value);
  setUsdTo(currency.usdTo);
  setUsd(currency.toUsd);
  setCurrency(value)
};

  /******************* 
  @Purpose : Used for close OTP design modal
  @Parameter : {}
  @Author : INIC
  ******************/
  const closeOTPModal = () => {
    setShowOTPModal(false);
    setOTPError("");
  };
  /******************* 
  @Purpose : Used for time view
  @Parameter : seconds
  @Author : INIC
  ******************/
  let display = (seconds) => {
    const format = (val) => `0${Math.floor(val)}`.slice(-2);
    const minutes = (seconds % 3600) / 60;
    return [minutes, seconds % 60].map(format).join(":");
  };
  /******************* 
  @Purpose : Used for validate mobile number
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateMobile = () => {
    let mobileFormat = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
    if (formData.hasOwnProperty("mobile")) {
      if (isEmpty(mobile.split("-")[1])) {
        errors.mobile = errorMessages.PROVIDE_MOBILE_NUMBER;
      } else if (!mobileFormat.test(mobile.split("-")[1])) {
        errors.mobile = "Please provide 10 digit mobile no";
      } else delete errors.mobile;
    }

    const isFormValid = Object.keys(errors).length !== 0 ? false : true;
    setFormData({
      ...formData,
      errors: errors,
    });
    return isFormValid;
  };

  /******************* 
  @Purpose : Used for resend OTP
  @Parameter : {}
  @Author : INIC
  ******************/
  const handleSendOTP = async () => {
    let body = { mobile: mobile };

    if (validateMobile()) {
      try {
        const response = await props.callApi(
          API.SEND_OTP_MOBILE_CHANGE,
          body,
          "post",
          null,
          true
        );
        if (response.status === 1) {
          setOTP(response.data.otp);
          showMessageNotification(response.data.otp, "success");
        }
      } catch (error) {
        setLoading(false);
        throw error;
      }
    }
  };
  /******************* 
  @Purpose : Used for verify otp
  @Parameter : e
  @Author : INIC
  ******************/
  const handleVerifyOTP = async () => {
    if (validateOtp()) {
      try {
        let body = {
          mobile,
          otp,
        };
        const response = await props.callApi(
          API.VERIFY_OTP_MOBILE_CHANGE,
          body,
          "post",
          null,
          true
        );
        if (response.status === 1) {
          showMessageNotification("Mobile no updated successfully", "success");
          setShowOTPModal(false);
        }
      } catch (error) {
        setLoading(false);
        throw error;
      }
    }
  };
  /******************* 
  @Purpose : Used for change OTP
  @Parameter : e
  @Author : INIC
  ******************/
  const handleChangeOTP = (otp) => {
    setOTP(otp);
    setOTPError("");
  };
  /******************* 
  @Purpose : Used for validate otp
  @Parameter : e
  @Author : INIC
  ******************/
  const validateOtp = () => {
    let errors = { otp: "" };
    if (otp.length !== 6) {
      errors.otp = "Please enter 6-digit OTP";
      setOTPError(errors);
      return false;
    } else return true;
  };

  let imagePreview;
  if (photo) {
    imagePreview = <img src={photo ? ADMIN_URL+ IMG_URL + photo : ""} alt="Icon" />;
  } else {
    imagePreview = <img src={"/assets/images/avatar-s-16.jpg"} alt="Icon" />;
  }
  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block">
            <form className="mb-7">
              <div className="d-flex align-items-center justify-content-between flex-wrap">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="content-header-title">User Profile</li>
                    <li className="breadcrumb-item">
                      <Link onClick={() => props.history.push("/dashboard")}>
                        <i className="bx bx-home-alt" />
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      User Profile
                    </li>
                  </ol>
                </nav>
                <div className="btn-blocks mb-md-0 mb-2">
                  <a
                    className="btn btn-primary glow-primary mr-3"
                    onClick={(e) => editAdminProfile(e)}
                  >
                    <em className="bx bx-revision mr-2" />
                    {loading ? "Updating" : "Update"}
                  </a>
                </div>
              </div>
              <div class="card profile-card mb-5">
                <div className="row">
                  <div className="col-md-2">
                    <div className="edit-image">
                      <div className="user-image">
                        {imagePreview}
                        <label className="img-upload" htmlfor="attach-file">
                          {/* <input type="file" id="attach-file" /> */}
                          <CropImagesProfile
                            getAdminProfile={getAdminProfile}
                          />
                          <em className="bx bxs-edit-alt" />
                        </label>
                      </div>
                    </div>
                    <div className="mt-3 mt-sm-4">
                      {imagePreview.props.src !==
                        "/assets/images/avatar-s-16.jpg" ? (
                        <Button
                          className="btn btn-primary"
                          onClick={(e) => removePhoto(e)}
                        >
                          Remove photo
                        </Button>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-10">
                    <div className="row">
                      <div className="col-lg-12 col-xl-6 mt-3">
                        <div className="user-title-info user-details">
                          <div className="form-group d-flex align-items-center mb-md-5 mb-3">
                            <label
                              className="mb-0 xl-label"
                              htmlFor="firstname"
                            >
                              First Name<sup className="text-danger">*</sup>
                            </label>
                            <div className="w-100">
                              <input
                                type="text"
                                className="form-control"
                                id="firstname"
                                name="firstname"
                                placeholder="Enter first name"
                                disabled
                                value={firstname}
                                onChange={(e) => handleChange(e)}
                              />
                              <span className="text-danger d-block">
                                {errors.firstname}
                              </span>
                            </div>
                          </div>

                          <div className="form-group d-flex align-items-center mb-md-5 mb-3">
                            <label className="mb-0 xl-label" htmlFor="lastname">
                              Last Name<sup className="text-danger">*</sup>
                            </label>
                            <div className="w-100">
                              <input
                                type="text"
                                className="form-control"
                                id="lastname"
                                name="lastname"
                                placeholder="Enter last name"
                                disabled
                                value={lastname}
                                onChange={(e) => handleChange(e)}
                              />

                              <span className="text-danger d-block">
                                {errors.lastname}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-xl-6  mt-3">
                        <div className="user-title-info user-details">
                          <div className="form-group d-flex align-items-center mb-md-5 mb-3">
                            <label className="mb-0 xl-label" htmlFor="Email">
                              Email<sup className="text-danger">*</sup>
                            </label>
                            <div className="w-100">
                              <input
                                className="form-control"
                                id="email"
                                name="email"
                                placeholder="Enter email"
                                disabled
                                type="email"
                                value={email}
                                onChange={(e) => handleChange(e)}
                              />
                              <span className="text-danger d-block">
                                {errors.email}
                              </span>
                            </div>
                          </div>

                          <div className="form-group d-flex align-items-center mb-md-5 mb-3">
                            <label className="mb-0 xl-label" htmlFor="Email">
                              Phone number<sup className="text-danger">*</sup>
                            </label>
                            <div className="w-100 d-flex align-items-center flex-column">
                              <div className="w-100 d-flex align-items-center">
                                <PhoneInput
                                  className="form-control w-100"
                                  name="phone"
                                  country={"in"}
                                  masks={""}
                                  countryCodeEditable={false}
                                  value={mobile}
                                  onChange={handleOnChanges}
                                />
                                <Button
                                  className="btn btn-primary ml-2"
                                  onClick={openOTPModal}
                                >
                                  Send OTP
                                </Button>
                              </div>
                              <span className="text-danger d-block w-100 mt-1">
                                {errors.mobile}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-xl-6  mt-3">
                        <div className="user-title-info user-details">
                          <div className="form-group d-flex align-items-center mb-md-5 mb-3">
                            <label className="mb-0 xl-label" htmlFor="Email">
                              {lang("GeneralSettings.timezone")}
                            </label>
                            <div className="w-100">
                              <Aselect
                                className="d-block custom-input"
                                showSearch
                                onChange={(value) => setTimeZone(value)}
                                value={timeZone}
                                onFocus={GetAllTimezone}
                              >
                                {timezoneArray.map((timezone, timekey) => {
                                  return (
                                    <Option key={timekey} value={timezone.timezone}>
                                      {timezone.timezone}
                                    </Option>
                                  );
                                })}
                              </Aselect>
                            </div>
                          </div>
                          <div className="form-group d-flex align-items-center mb-md-5 mb-3">
                            <label className="mb-0 xl-label" htmlFor="Email">
                              {lang("GeneralSettings.dateformat")}
                            </label>
                            <div className="w-100">
                              <Aselect
                                className="d-block custom-input"
                                onChange={(value) => setDateFormat(value)}
                                value={dateFormat}
                              >
                                <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                                <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                                <Option value="YYYY/MM/DD">YYYY/MM/DD</Option>
                              </Aselect>
                            </div>
                          </div>
                        </div>
                        </div>
                        <div className="col-lg-12 col-xl-6  mt-3">
                          <div className="user-title-info user-details">
                            <div className="form-group d-flex align-items-center mb-md-5 mb-3">
                              <label className="mb-0 xl-label" htmlFor="Email">
                                {lang("GeneralSettings.timeFormat")}
                              </label>
                              <div className="w-100">
                                <Aselect
                                  className="d-block custom-input"
                                  onChange={(value) => setTimeFormat(value)}
                                  value={timeFormat}
                                  onFocus={GetAllTimezone}
                                >
                                  <Option value="12 Hours">12 Hours</Option>
                                  <Option value="24 Hours">24 Hours</Option>
                                </Aselect>
                              </div>
                            </div>

                            <div className="form-group d-flex align-items-center mb-md-5 mb-3">
                              <label className="mb-0 xl-label" htmlFor="Email">
                                {lang("GeneralSettings.currency")}
                              </label>
                              <div className="w-100">
                                <Aselect
                                  className="d-block custom-input"
                                  showSearch
                                  onChange={(value) => selectCurrency(value)}
                                  value={currency}
                                  onFocus={GetAllCurrencies}
                                >
                                  {currencyArray.map((currency, key) => {
                                    return (
                                      <Option key={key} value={currency.currency}>
                                        {currency.currency}
                                      </Option>
                                    );
                                  })}
                                </Aselect>
                              </div>
                              
                            </div>
                              <span>
                                1{currency} = ${usdTo} USD
                              </span>&nbsp;|&nbsp;
                              <span>$1 USD = {toUsd}{currency}</span>
                          </div>
                        </div>
                      

                      <Modal show={showOTPModal} onHide={closeOTPModal}>
                        <Modal.Header>
                          <div class="d-flex align-items-center">
                            <div class="icon mr-2">
                              <span class="bx bxs-plus-circle"></span>
                            </div>
                            <h5 class="modal-title" id="exampleModalLongTitle">
                              OTP
                            </h5>
                          </div>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="card rounded-left mb-0 p-4 d-flex justify-content-center h-100 otp-modal">
                            <div className="card-header border-0">
                              <div className="card-title text-center mb-4">
                                <h4 className="mb-2 mt-2">
                                  Verify your Mobile Number
                                </h4>
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
                                      {mobile}
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
                                    numInputs={6}
                                    isInputNum={true}
                                    hasErrored={true}
                                    separator={<span>-</span>}
                                    inputStyle="form-control"
                                    value={otp}
                                    onChange={(otp) => handleChangeOTP(otp)}
                                  />
                                </form>
                                <span
                                  className="error-msg text-center d-block"
                                  id="otpError"
                                  style={{ color: "red" }}
                                >
                                  {otpError.otp}
                                </span>
                                <span className="text-danger error-msg"></span>
                                <div className="text-center common-small-text mt-4 mb-2">
                                  <small>The OTP will be expired in</small>{" "}
                                  <small className="text-primary">
                                    <span>{display(seconds)}</span>
                                  </small>
                                </div>
                                <div className="text-center common-small-text mt-2 mb-5">
                                  <small>Didn’t receive the code?</small>{" "}
                                  <a onClick={handleSendOTP}>
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
                        </Modal.Body>
                      </Modal>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-5">
                  <div className="card profile-card">
                    <h6 className="d-flex align-items-center title mb-4">
                      <i className="bx bx-user mr-1" />
                      Personal Info
                    </h6>
                    <div className="form-group d-flex align-items-center mb-md-5 mb-3 user-details">
                      <label className="mb-0" htmlFor="BirthDate">
                        Birth Date
                      </label>
                      <fieldset className="position-relative w-100">
                        <DatePicker
                          selected={birthday ? new Date(birthday) : ""}
                          dateFormat="d MMM yyyy"
                          placeholderText="Select Date"
                          className="form-control w-100"
                          onChange={(evt) => {
                            setBirthday(evt);
                            setFormData({
                              ...formData,
                              dob: birthday,
                            });
                          }}
                        />
                        <span className="text-danger d-block">
                          {errors.birthday}
                        </span>
                      </fieldset>
                    </div>
                    <div className="d-flex align-items-center mb-md-5 mb-3 user-details">
                      <label className="mb-0" htmlFor="WebSite">
                        Website
                      </label>
                      <div className="w-100">
                        <input
                          type="text"
                          className="form-control"
                          id="website"
                          name="website"
                          placeholder="Enter your website"
                          value={website}
                          onChange={(e) => handleChange(e)}
                        />
                        <span className="text-danger d-block">
                          {errors.website}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-md-5 mb-3 user-details">
                      <label className="mb-0" htmlFor="gender">
                        Gender
                      </label>
                      <Select
                        className="selectpicker w-100"
                        id="gender"
                        name="gender"
                        value={gender}
                        options={genderOption}
                        onChange={(e) => genderHandler(e)}
                      ></Select>
                    </div>
                    <div className="d-flex align-items-center user-details mb-md-5 mb-3">
                      <label className="mb-0" htmlFor="Address">
                        Address
                      </label>
                      <div className="w-100">
                        <input
                          type="text"
                          id="address"
                          name="address"
                          className="form-control"
                          placeholder="Enter address"
                          value={address}
                          onChange={(e) => handleChange(e)}
                        />
                        <span className="text-danger d-block">
                          {errors.address}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center user-details mb-md-5 mb-3">
                      <label className="mb-0" htmlFor="Country">
                        Country
                      </label>
                      <Select
                        className="selectpicker w-100"
                        data-live-search="true"
                        id="country"
                        name="country"
                        value={country}
                        options={options}
                        onChange={handleCountrySelector}
                      />
                    </div>
                    <span className="text-danger d-block">
                      {errors.country}
                    </span>
                  </div>
                </div>
                <div className="col-md-6 mb-5">
                  <div className="card profile-card">
                    <h6 className="d-flex align-items-center title mb-4">
                      <i className="bx bx-link-alt mr-1" />
                      Social Links
                    </h6>
                    <div className="d-flex align-items-center mb-md-5 mb-3 user-details">
                      <label className="mb-0" htmlFor="Twitter">
                        Twitter
                      </label>
                      <div className="w-100">
                        <input
                          type="text"
                          className="form-control"
                          id="twitterLink"
                          name="twitterLink"
                          placeholder="Enter twitter link"
                          value={twitterLink}
                          onChange={(e) => handleChange(e)}
                        />
                        <span className="text-danger d-block">
                          {errors.twitterLink}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-md-5 mb-3 user-details">
                      <label className="mb-0" htmlFor="Facebook">
                        Facebook
                      </label>
                      <div className="w-100">
                        <input
                          type="text"
                          id="fbLink"
                          name="fbLink"
                          className="form-control"
                          placeholder="Enter facebook link"
                          value={fbLink}
                          onChange={(e) => handleChange(e)}
                        />
                        <span className="text-danger d-block">
                          {errors.fbLink}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-md-5 mb-3 user-details">
                      <label className="mb-0" htmlFor="Instagram">
                        Instagram
                      </label>
                      <div className="w-100">
                        <input
                          type="text"
                          className="form-control"
                          id="instagramLink"
                          name="instagramLink"
                          placeholder="Enter instagram link"
                          value={instagramLink}
                          onChange={(e) => handleChange(e)}
                        />
                        <span className="text-danger d-block">
                          {errors.instagramLink}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center user-details mb-md-5 mb-3">
                      <label className="mb-0" htmlFor="Github">
                        Github
                      </label>
                      <div className="w-100">
                        <input
                          type="text"
                          className="form-control"
                          id="gitHubLink"
                          name="gitHubLink"
                          placeholder="Enter github link"
                          value={gitHubLink}
                          onChange={(e) => handleChange(e)}
                        />
                        <span className="text-danger d-block">
                          {errors.gitHubLink}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-md-5 mb-3 user-details">
                      <label className="mb-0" htmlFor="Codepen">
                        CodePen
                      </label>
                      <div className="w-100">
                        <input
                          type="text"
                          className="form-control"
                          id="codePen"
                          name="codePen"
                          placeholder="Enter codepen link"
                          value={codePen}
                          onChange={(e) => handleChange(e)}
                        />
                        <span className="text-danger d-block">
                          {errors.codePen}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <footer>
            <div className="footer-text d-flex align-items-centerf justify-content-between">
              <span className="d-block">2021 © IndiaNIC</span>
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
export default connect(mapStateToProps, { callApi })(Profile);
