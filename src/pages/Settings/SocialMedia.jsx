import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { Tab, Tabs, Tooltip, OverlayTrigger } from "react-bootstrap";
import { isEmpty } from "lodash";
import { callApi } from "../../api"; // Used for api call
import {
  validateIDSecret,
  showMessageNotification,
} from "./../../utils/Functions"; // Utility functions
import { connect } from "react-redux";
import errorMessages from "../../utils/ErrorMessages";
import API from "../../api/Routes";
import { Link } from "react-router-dom";
import { ADMIN_URL } from "../../config";
/******************* 
@Purpose : Used for social media view
@Parameter : props
@Author : INIC
******************/
function SocialMedia(props) {
  const [facebookAppId, setFacebookAppId] = useState("");
  const [facebookAppSecret, setFacebookAppSecret] = useState("");
  const [facebookStatus, setFacebookStatus] = useState(false);
  const [twitterAppId, setTwitterAppId] = useState("");
  const [twitterAppSecret, setTwitterAppSecret] = useState("");
  const [twitterStatus, setTwitterStatus] = useState(false);
  const [linkedInAppId, setLinkedInAppId] = useState("");
  const [linkedInAppSecret, setLinkedInAppSecret] = useState("");
  const [linkedInStatus, setLinkedInStatus] = useState(false);
  const [fbUrl, setFbUrl] = useState("");
  const [, setEventKeys] = useState("country");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [pinterestUrl, setPinterestUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [, setIsFormValid] = useState(true);
  const [fbAppSecretHidden, setFbAppSecretHidden] = useState(true);
  const [TwAppSecretHidden, setTwAppSecretHidden] = useState(true);
  const [LkdnAppSecretHidden, setLkdnAppSecretHidden] = useState(true);
  var [errors, setErrors] = useState({});

  useEffect(() => {
    getSocialMediaSDK();
    getSocialMediaLinks();
  }, []);
  /******************* 
  @Purpose : Used for get social media SDK
  @Parameter : {}
  @Author : INIC
  ******************/
  const getSocialMediaSDK = async () => {
    const response = await props.callApi(
      API.GET_SOCIAL_SDK,
      "",
      "get",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      let { facebook, twitter, linkedIn } =
        response.data && response.data.socialMediaSDK;
      setFacebookAppId(facebook.appId);
      setFacebookAppSecret(facebook.appSecret);
      setLinkedInAppId(linkedIn.appId);
      setLinkedInAppSecret(linkedIn.appSecret);
      setTwitterAppId(twitter.appId);
      setTwitterAppSecret(twitter.appSecret);
    }
  };
  /******************* 
  @Purpose : Used for get social link details
  @Parameter : {}
  @Author : INIC
  ******************/
  const getSocialMediaLinks = async () => {
    const response = await props.callApi(
      API.GET_SOCIAL_LINKS,
      "",
      "get",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      let { fbUrl, instagramUrl, linkedInUrl, pinterestUrl, twitterUrl } =
        response.data && response.data.socialMediaLinks;
      setFbUrl(fbUrl);
      setInstagramUrl(instagramUrl);
      setPinterestUrl(pinterestUrl);
      setLinkedInUrl(linkedInUrl);
      setTwitterUrl(twitterUrl);
    }
  };
  /******************* 
  @Purpose : Used for save social details
  @Parameter : tab
  @Author : INIC
  ******************/
  const saveSocialSDK = async (tab) => {
    if (validateForm(tab) && tab === "sdk") {
      var body = {
        facebookAppId,
        facebookAppSecret,
        facebookStatus,
        linkedInAppId,
        linkedInAppSecret,
        linkedInStatus,
        twitterAppId,
        twitterAppSecret,
        twitterStatus,
      };
      const response = await props.callApi(
        API.ADD_SOCIAL_SDK,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Details added successfully", "success");
        getSocialMediaSDK();
      }
    }
  };
  /******************* 
  @Purpose : Used for save social links
  @Parameter : tab
  @Author : INIC
  ******************/
  const saveSocialLinks = async (tab) => {
    if (validateForm(tab) && tab === "links") {
      var body = {
        fbUrl: fbUrl,
        twitterUrl: twitterUrl,
        linkedInUrl: linkedInUrl,
        instagramUrl: instagramUrl,
        pinterestUrl: pinterestUrl,
      };
      const response = await props.callApi(
        API.ADD_SOCIAL_LINKS,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Details added successfully", "success");
        getSocialMediaLinks();
      }
    }
  };
  /******************* 
  @Purpose : Used for validate form
  @Parameter : tab
  @Author : INIC
  ******************/
  const validateForm = (tab) => {
    let isFormValid = true;
    if (tab === "sdk") {
      let errors = {
        facebookAppId,
        facebookAppSecret,
        twitterAppId,
        twitterAppSecret,
        linkedInAppId,
        linkedInAppSecret,
      };

      if (!facebookAppId.trim())
        errors.facebookAppId = errorMessages.PROVIDE_FBAPPID;
      else if (!validateIDSecret(facebookAppId))
        errors.facebookAppId = errorMessages.PROVIDE_VALID_FBAPPID;
      else errors.facebookAppId = "";

      if (!twitterAppId.trim())
        errors.twitterAppId = errorMessages.PROVIDE_TWITTERAPID;
      else if (!validateIDSecret(twitterAppId))
        errors.twitterAppId = errorMessages.PROVIDE_VALID_TWITTERAPID;
      else errors.twitterAppId = "";

      if (!linkedInAppId.trim())
        errors.linkedInAppId = errorMessages.PROVIDE_LINKEDINAPID;
      else if (!validateIDSecret(linkedInAppId))
        errors.linkedInAppId = errorMessages.PROVIDE_VALID_LINKEDINAPID;
      else errors.linkedInAppId = "";

      if (!facebookAppSecret)
        errors.facebookAppSecret = errorMessages.PROVIDE_FBAPPSECRET;
      else if (!validateIDSecret(facebookAppSecret))
        errors.facebookAppSecret = errorMessages.PROVIDE_VALID_FBAPPSECRET;
      else errors.facebookAppSecret = "";

      if (!twitterAppSecret)
        errors.twitterAppSecret = errorMessages.PROVIDE_TWITTERAPSECRET;
      else if (!validateIDSecret(twitterAppSecret))
        errors.twitterAppSecret = errorMessages.PROVIDE_VALID_TWITTERAPSECRET;
      else errors.twitterAppSecret = "";

      if (!linkedInAppSecret)
        errors.linkedInAppSecret = errorMessages.PROVIDE_LINKEDINAPSECRET;
      else if (!validateIDSecret(linkedInAppSecret))
        errors.linkedInAppSecret = errorMessages.PROVIDE_VALID_LINKEDINAPSECRET;
      else errors.linkedInAppSecret = "";

      if (
        errors.facebookAppId !== "" ||
        errors.twitterAppId !== "" ||
        errors.linkedInAppId !== "" ||
        errors.facebookAppSecret !== "" ||
        errors.twitterAppSecret !== "" ||
        errors.linkedInAppSecret !== ""
      )
        isFormValid = false;
      else isFormValid = true;
      setErrors(errors);
      setIsFormValid(isFormValid);
      return isFormValid;
    } else if (tab === "links") {
      let errors = {
        fbUrl,
        instagramUrl,
        linkedInUrl,
        pinterestUrl,
        twitterUrl,
      };

      let lowerFbUrl = fbUrl.toLowerCase();
      if (!isEmpty(lowerFbUrl)) {
        if (
          lowerFbUrl.indexOf(" ") <= 0 &&
          lowerFbUrl.includes("https://www.facebook.com") &&
          !lowerFbUrl.includes("..") &&
          !lowerFbUrl.includes("///")
        )
          errors.fbUrl = "";
        else errors.fbUrl = errorMessages.PROVIDE_FBURL;
      } else {
        errors.fbUrl = "";
      }

      let lowerInstagramUrl = instagramUrl.toLowerCase();
      if (!isEmpty(lowerInstagramUrl)) {
        if (
          lowerInstagramUrl.indexOf(" ") <= 0 &&
          lowerInstagramUrl.includes("https://www.instagram.com") &&
          !lowerInstagramUrl.includes("..") &&
          !lowerInstagramUrl.includes("///")
        )
          errors.instagramUrl = "";
        else errors.instagramUrl = errorMessages.PROVIDE_INSTAGRAM;
      } else {
        errors.instagramUrl = "";
      }

      let lowerLinkedInUrl = linkedInUrl.toLowerCase();
      if (!isEmpty(lowerLinkedInUrl)) {
        if (
          lowerLinkedInUrl.indexOf(" ") <= 0 &&
          lowerLinkedInUrl.includes("https://www.linkedin.com") &&
          !lowerLinkedInUrl.includes("..") &&
          !lowerLinkedInUrl.includes("///")
        )
          errors.linkedInUrl = "";
        else errors.linkedInUrl = errorMessages.PROVIDE_LINKEDINURL;
      } else {
        errors.linkedInUrl = "";
      }

      let lowerPinterestUrl = pinterestUrl.toLowerCase();
      if (!isEmpty(lowerPinterestUrl)) {
        if (
          lowerPinterestUrl.indexOf(" ") <= 0 &&
          lowerPinterestUrl.includes("https://www.pinterest.com") &&
          !lowerPinterestUrl.includes("..") &&
          !lowerPinterestUrl.includes("///")
        )
          errors.pinterestUrl = "";
        else errors.pinterestUrl = errorMessages.PROVIDE_PINTERESTURL;
      } else {
        errors.pinterestUrl = "";
      }

      let lowerTwitterUrl = twitterUrl.toLowerCase();
      if (!isEmpty(lowerTwitterUrl)) {
        if (
          lowerTwitterUrl.indexOf(" ") <= 0 &&
          lowerTwitterUrl.includes("https://www.twitter.com") &&
          !lowerTwitterUrl.includes("..") &&
          !lowerTwitterUrl.includes("///")
        )
          errors.twitterUrl = "";
        else errors.twitterUrl = errorMessages.PROVIDE_TWITTER;
      } else {
        errors.twitterUrl = "";
      }

      if (
        errors.fbUrl !== "" ||
        errors.instagramUrl !== "" ||
        errors.linkedInUrl !== "" ||
        errors.pinterestUrl !== "" ||
        errors.twitterUrl !== ""
      )
        isFormValid = false;
      else isFormValid = true;
      setErrors(errors);
      setIsFormValid(isFormValid);
      return isFormValid;
    }
  };
  /******************* 
  @Purpose : Used for rander facebook tooltip 
  @Parameter : props
  @Author : INIC
  ******************/
  const renderTooltipFb = (props) =>
    !fbAppSecretHidden ? (
      <Tooltip id="button-tooltip" {...props}>
        Hide Password
      </Tooltip>
    ) : (
      <Tooltip id="button-tooltip" {...props}>
        Show Password
      </Tooltip>
    );
  /******************* 
  @Purpose : Used for rander Twitter tooltip 
  @Parameter : props
  @Author : INIC
  ******************/
  const renderTooltipTw = (props) =>
    !TwAppSecretHidden ? (
      <Tooltip id="button-tooltip" {...props}>
        Hide Password
      </Tooltip>
    ) : (
      <Tooltip id="button-tooltip" {...props}>
        Show Password
      </Tooltip>
    );
  /******************* 
  @Purpose : Used for rander linkdin tooltip 
  @Parameter : props
  @Author : INIC
  ******************/
  const renderTooltipLkdn = (props) =>
    !LkdnAppSecretHidden ? (
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
                <li className="content-header-title">Social Media</li>
                <li className="breadcrumb-item">
                  <Link onClick={() => props.history.push("/dashboard")}>
                    <i className="bx bx-home-alt" />
                  </Link>
                </li>
                <li className="breadcrumb-item">Settings</li>
                <li className="breadcrumb-item active" aria-current="page">
                  Social Media
                </li>
              </ol>
            </nav>
            <div className="card notification-card tabs-block p-0">
              <Tabs
                defaultActiveKey="socialdetails"
                id="uncontrolled-tab-example"
                className="pl-5 pt-3"
                onSelect={(eventKey) => setEventKeys(eventKey)}
              >
                <Tab eventKey="socialdetails" title="Social Media SDK Details">
                  <div className="card-body content">
                    <div className="notification-title d-flex align-items-center justify-content-between mb-md-4 mb-3">
                      <div className="d-flex align-items-center">
                        <div className="icon d-flex align-items-center justify-content-center mr-1">
                          <i className="bx bxl-facebook" />
                        </div>
                        <div className="text">
                          <h5 className="mb-0">Facebook</h5>
                        </div>
                      </div>
                      <div class="custom-control custom-switch light">
                        <input
                          type="checkbox"
                          class="custom-control-input"
                          id="facebookStatus"
                          checked={facebookStatus}
                          onChange={(e) => {
                            setFacebookStatus(!facebookStatus);
                          }}
                        />
                        <label
                          class="custom-control-label"
                          for="facebookStatus"
                        ></label>
                      </div>
                    </div>
                    <form action="#">
                      <div className="row">
                        <div className="form-group col-md-6 mb-md-5 mb-3">
                          <label htmlFor="facebookAppId">
                            Facebook App ID
                            <sup className="text-danger">*</sup>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="facebookAppId"
                            name="facebookAppId"
                            placeholder="Code here"
                            value={facebookAppId}
                            onChange={(e) => {
                              setFacebookAppId(e.target.value);
                              errors = Object.assign(errors, {
                                facebookAppId: "",
                              });
                              setErrors(errors);
                            }}
                          />
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.facebookAppId}
                          </span>
                        </div>
                        <div className="form-group col-md-6 mb-md-5 mb-3">
                          <label htmlFor="facebookAppSecret">
                            Facebook App Secret
                            <sup className="text-danger">*</sup>
                          </label>
                          <input
                            type={fbAppSecretHidden ? "password" : "text"}
                            className="form-control"
                            id="facebookAppSecret"
                            name="facebookAppSecret"
                            placeholder="Code here"
                            value={facebookAppSecret}
                            onChange={(e) => {
                              setFacebookAppSecret(e.target.value);
                              errors = Object.assign(errors, {
                                facebookAppSecret: "",
                              });
                              setErrors(errors);
                            }}
                          />
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltipFb}
                          >
                            <span
                              onClick={() =>
                                setFbAppSecretHidden(!fbAppSecretHidden)
                              }
                              toggle="#password-field"
                              className={
                                fbAppSecretHidden
                                  ? "bx bx-hide field-icon toggle-password  mr-3"
                                  : "bx bx-show field-icon toggle-password  mr-3"
                              }
                            ></span>
                          </OverlayTrigger>
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.facebookAppSecret}
                          </span>
                        </div>
                      </div>
                    </form>
                    <div className="notification-title d-flex align-items-center justify-content-between mb-md-4 mb-3 mt-md-5 mt-3">
                      <div className="d-flex align-items-center">
                        <div className="icon d-flex align-items-center justify-content-center mr-1">
                          <i className="bx bxl-twitter" />
                        </div>
                        <div className="text">
                          <h5 className="mb-0">Twitter</h5>
                        </div>
                      </div>
                      <div className="custom-control custom-switch light">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="twitterStatus"
                          checked={twitterStatus}
                          onChange={(e) => {
                            setTwitterStatus(!twitterStatus);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="twitterStatus"
                        />
                      </div>
                    </div>
                    <form action="#">
                      <div className="row">
                        <div className="form-group col-md-6 mb-md-5 mb-3">
                          <label htmlFor="twitterAppId">
                            Twitter App ID<sup className="text-danger">*</sup>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="twitterAppId"
                            name="twitterAppId"
                            placeholder="Code here"
                            value={twitterAppId}
                            onChange={(e) => {
                              setTwitterAppId(e.target.value);
                              errors = Object.assign(errors, {
                                twitterAppId: "",
                              });
                              setErrors(errors);
                            }}
                          />
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.twitterAppId}
                          </span>
                        </div>
                        <div className="form-group col-md-6 mb-md-5 mb-3">
                          <label htmlFor="twitterAppSecret">
                            Twitter App Secret
                            <sup className="text-danger">*</sup>
                          </label>
                          <input
                            type={TwAppSecretHidden ? "password" : "text"}
                            className="form-control"
                            id="twitterAppSecret"
                            name="twitterAppSecret"
                            placeholder="Code here"
                            value={twitterAppSecret}
                            onChange={(e) => {
                              setTwitterAppSecret(e.target.value);
                              errors = Object.assign(errors, {
                                twitterAppSecret: "",
                              });
                              setErrors(errors);
                            }}
                          />
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltipTw}
                          >
                            <span
                              onClick={() =>
                                setTwAppSecretHidden(!TwAppSecretHidden)
                              }
                              toggle="#password-field"
                              className={
                                TwAppSecretHidden
                                  ? "bx bx-hide field-icon toggle-password mr-3"
                                  : "bx bx-show field-icon toggle-password mr-3"
                              }
                            ></span>
                          </OverlayTrigger>
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.twitterAppSecret}
                          </span>
                        </div>
                      </div>
                    </form>
                    <div className="notification-title d-flex align-items-center justify-content-between mb-md-4 mb-3 mt-md-5 mt-3">
                      <div className="d-flex align-items-center">
                        <div className="icon d-flex align-items-center justify-content-center mr-1">
                          <i className="bx bxl-linkedin-square" />
                        </div>
                        <div className="text">
                          <h5 className="mb-0">LinkedIn</h5>
                        </div>
                      </div>
                      <div className="custom-control custom-switch light">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="linkedInStatus"
                          checked={linkedInStatus}
                          onChange={(e) => {
                            setLinkedInStatus(!linkedInStatus);
                          }}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="linkedInStatus"
                        />
                      </div>
                    </div>
                    <form action="#">
                      <div className="row">
                        <div className="form-group col-md-6 mb-md-5 mb-3">
                          <label htmlFor="linkedInAppId">
                            LinkedIn App ID
                            <sup className="text-danger">*</sup>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="linkedInAppId"
                            name="linkedInAppId"
                            placeholder="Code here"
                            value={linkedInAppId}
                            onChange={(e) => {
                              setLinkedInAppId(e.target.value);
                              errors = Object.assign(errors, {
                                linkedInAppId: "",
                              });
                              setErrors(errors);
                            }}
                          />
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.linkedInAppId}
                          </span>
                        </div>
                        <div className="form-group col-md-6 mb-md-5 mb-3">
                          <label htmlFor="linkedInAppSecret">
                            LinkedIn App Secret
                            <sup className="text-danger">*</sup>
                          </label>
                          <input
                            type={LkdnAppSecretHidden ? "password" : "text"}
                            className="form-control"
                            id="linkedInAppSecret"
                            name="linkedInAppSecret"
                            placeholder="Code here"
                            value={linkedInAppSecret}
                            onChange={(e) => {
                              setLinkedInAppSecret(e.target.value);
                              errors = Object.assign(errors, {
                                linkedInAppSecret: "",
                              });
                              setErrors(errors);
                            }}
                          />
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltipLkdn}
                          >
                            <span
                              onClick={() =>
                                setLkdnAppSecretHidden(!LkdnAppSecretHidden)
                              }
                              toggle="#password-field"
                              className={
                                LkdnAppSecretHidden
                                  ? "bx bx-hide field-icon toggle-password mr-3"
                                  : "bx bx-show field-icon toggle-password mr-3"
                              }
                            ></span>
                          </OverlayTrigger>
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.linkedInAppSecret}
                          </span>
                        </div>
                      </div>
                    </form>
                    <div className="text-right mt-2 pr-5 pb-5">
                      <button
                        className="btn btn-primary"
                        onClick={() => saveSocialSDK("sdk")}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="sociallinks" title="Social Media Links">
                  <div className="card-body content">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="notification-title d-flex align-items-center mb-md-4 mb-3">
                          <div className="icon d-flex align-items-center justify-content-center mr-1">
                            <i className="bx bxl-facebook" />
                          </div>
                          <div className="text">
                            <h5 className="mb-0">Facebook</h5>
                          </div>
                        </div>
                        <div className="form-group mb-md-5 mb-3">
                          <label htmlFor="FbUrl">Facebook URL</label>
                          <input
                            type="text"
                            className="form-control"
                            id="fbUrl"
                            name="fbUrl"
                            placeholder="https://"
                            value={fbUrl}
                            onChange={(e) => {
                              setFbUrl(e.target.value);
                              errors = Object.assign(errors, { fbUrl: "" });
                              setErrors(errors);
                            }}
                          />
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.fbUrl}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="notification-title d-flex align-items-center mb-md-4 mb-3 mt-md-0 mt-3">
                          <div className="icon d-flex align-items-center justify-content-center mr-1">
                            <i className="bx bxl-instagram" />
                          </div>
                          <div className="text">
                            <h5 className="mb-0">Instagram</h5>
                          </div>
                        </div>
                        <div className="form-group mb-md-5 mb-3">
                          <label htmlFor="InUrl">Instagram URL</label>
                          <input
                            type="text"
                            className="form-control"
                            id="instagramUrl"
                            name="instagramUrl"
                            placeholder="https://"
                            value={instagramUrl}
                            onChange={(e) => {
                              setInstagramUrl(e.target.value);
                              errors = Object.assign(errors, {
                                instagramUrl: "",
                              });
                              setErrors(errors);
                            }}
                          />
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.instagramUrl}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="notification-title d-flex align-items-center mb-md-4 mb-3 mt-md-5 mt-3">
                          <div className="icon d-flex align-items-center justify-content-center mr-1">
                            <i className="bx bxl-twitter" />
                          </div>
                          <div className="text">
                            <h5 className="mb-0">Twitter</h5>
                          </div>
                        </div>
                        <div className="form-group mb-md-5 mb-3">
                          <label htmlFor="TwUrl">TwitterURL</label>
                          <input
                            type="text"
                            className="form-control"
                            id="twitterUrl"
                            name="twitterUrl"
                            placeholder="https://"
                            value={twitterUrl}
                            onChange={(e) => {
                              setTwitterUrl(e.target.value);
                              errors = Object.assign(errors, {
                                twitterUrl: "",
                              });
                              setErrors(errors);
                            }}
                          />
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.twitterUrl}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="notification-title d-flex align-items-center mb-md-4 mb-3 mt-md-5 mt-3">
                          <div className="icon d-flex align-items-center justify-content-center mr-1">
                            <i className="bx bxl-linkedin-square" />
                          </div>
                          <div className="text">
                            <h5 className="mb-0">LinkedIn</h5>
                          </div>
                        </div>
                        <div className="form-group mb-md-5 mb-3">
                          <label htmlFor="LnkUrl">LinkedIn URL</label>
                          <input
                            type="text"
                            className="form-control"
                            id="LnkUrl"
                            placeholder="https://"
                            value={linkedInUrl}
                            onChange={(e) => {
                              setLinkedInUrl(e.target.value);
                              errors = Object.assign(errors, {
                                linkedInUrl: "",
                              });
                              setErrors(errors);
                            }}
                          />
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.linkedInUrl}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="notification-title d-flex align-items-center mb-md-4 mb-3 mt-md-5 mt-3">
                          <div className="icon d-flex align-items-center justify-content-center mr-1">
                            <i className="bx bxl-pinterest-alt" />
                          </div>
                          <div className="text">
                            <h5 className="mb-0">Pinterest</h5>
                          </div>
                        </div>
                        <div className="form-group mb-md-5 mb-3">
                          <label htmlFor="PnUrl">Pinterest URL</label>
                          <input
                            type="text"
                            className="form-control"
                            id="pinterestUrl"
                            name="pinterestUrl"
                            placeholder="https://"
                            value={pinterestUrl}
                            onChange={(e) => {
                              setPinterestUrl(e.target.value);
                              errors = Object.assign(errors, {
                                pinterestUrl: "",
                              });
                              setErrors(errors);
                            }}
                          />
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.pinterestUrl}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right mt-2 pr-5 pb-5">
                      <button
                        className="btn btn-primary"
                        onClick={() => saveSocialLinks("links")}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </Tab>
              </Tabs>
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
export default connect(null, { callApi })(SocialMedia);
