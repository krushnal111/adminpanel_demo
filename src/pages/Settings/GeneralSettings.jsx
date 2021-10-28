import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import Layout from "../../components/Layout/Layout";
import { callApi } from "../../api"; // Used for api call
import { Select } from "antd";
import { ADMIN_URL, IMG_URL } from "../../config";
import "react-datepicker/dist/react-datepicker.css";
import errorMessages from "../../utils/ErrorMessages";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import API from "../../api/Routes";
import { Card, Accordion, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "react-image-crop/dist/ReactCrop.css";
import Modal from "react-modal";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import Cropper from "react-cropper";
import { showMessageNotification } from "../../utils/Functions"; //Utility functions
import moment from "moment";
import "cropperjs/dist/cropper.css";
var { Option } = Select;

/******************* 
@Purpose : Used for model style
@Author : INIC
******************/
const customStylesModal = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
/******************* 
@Purpose : Used for globle setting
@Parameter : props
@Author : INIC
******************/
function GeneralSettings(props) {
  const [page] = useState(1);
  const [pagesize] = useState(10);
  const [lang] = useTranslation("language");
  const [currency, setCurrency] = useState("");
  const [dateFormat, setDateFormat] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeyword, setMetaKeyword] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [analyticsSnippet, setAnalyticsSnippet] = useState("");
  const [footerSnippet, setFooterSnippet] = useState("");
  const [headerSnippet, setHeaderSnippet] = useState("");
  const [offlineMessage, setOfflineMessage] = useState("");
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [timeFormat, setTimeFormat] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [currencyArray, setCurrencyArray] = useState([]);
  const [siteName, setSiteName] = useState("");
  const [largeImg, setLargeImg] = useState([]);
  const [smallImg, setSmallImg] = useState([]);
  const [, setSiteUnderMaintainence] = useState({});
  const [timezoneArray, setTimezoneArray] = useState([]);
  const [feviconImg, setFeviconImg] = useState([]);
  const [, setIsFormValid] = useState(true);
  var [errors, setErrors] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [src, setSrc] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  let [menuToggleSite, setMenuToggleSite] = useState(false);
  let [menuToggleMeta, setMenuToggleMeta] = useState(false);
  let [menuToggleAnalytics, setMenuToggleAnalytics] = useState(false);
  const [cropper, setCropper] = useState("");
  const [date] = useState("");
  const metaTitleTrackChanges = useRef(null);
  const metaKeywordTrackChanges = useRef(null);
  const metaDescriptionTrackChanges = useRef(null);

  useEffect(() => {
    GetGlobalSettings();
    getDateTimeFormat();
    setFavIcon()
  }, []);

  /******************* 
  @Purpose : Used for close login modal
  @Parameter : {}
  @Author : INIC
  ******************/
  const closeLoginModal = () => {
    setOpen(false);
    setSrc(null);
  };
  /******************* 
  @Purpose : Used for file upload
  @Parameter : {}
  @Author : INIC
  ******************/
  const fileUploadSubmit = async () => {
    setIsUploading(true);
    let formData = new FormData();
    let b64Data = cropper && cropper.getCroppedCanvas().toDataURL();
    if (b64Data) {
      let type = "image/png";
      var byteString = atob(b64Data.split(",")[1]);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var bb = new Blob([ab], { type: type });
    }
    formData.append("file", bb);
    if (selectedImage === "siteFevicon") {
      setFeviconImg(formData);
      setFavIcon();
    }
    if (selectedImage === "Site Logo Small") {
      setSmallImg(formData);
    }
    if (selectedImage === "Site Logo Large") {
      setLargeImg(formData);
    }
    try {
      const response = await props.callApi(
        API.SETTING_FILE_UPLOAD,
        formData,
        "post",
        null,
        true,
        true,
        ADMIN_URL
      );
      setIsUploading(false);
      if (response.status === 1) {
        if (selectedImage === "siteFevicon") {
          setFeviconImg(response.data.filePath);
          setFavIcon()
          showMessageNotification("Site favicon uploaded successfully", "success")
          setOpen(false);
          setSrc(null);
        }
        if (selectedImage === "Site Logo Small") {
          setSmallImg(response.data.filePath);
          showMessageNotification("Site logo(small) uploaded successfully", "success")
          setOpen(false);
          setSrc(null);
        }
        if (selectedImage === "Site Logo Large") {
          setLargeImg(response.data.filePath);
          showMessageNotification("Site logo(large) uploaded  successfully", "success")
          setOpen(false);
          setSrc(null);
        }
      }
    } catch (error) {
      setIsUploading(false);
      showMessageNotification(error, "error")
      throw error;
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
  @Purpose : Used for select file
  @Parameter : e, tab
  @Author : INIC
  ******************/
  const onSelectFile = (e, tab) => {
    if (e.target.files && e.target.files.length > 0) {
      if (tab === "siteFevicon") {
        errors.feviconImg = "";
      }
      if (tab === "Site Logo Small") {
        errors.smallImg = "";
      }
      if (tab === "Site Logo Large") {
        errors.largeImg = "";
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => setSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setOpen(true);
      setSelectedImage(tab);
    }
  };

  const getFavEl = () => {
      return document.getElementById("favicon");
  }

  const setFavIcon = () => {
      const favicon = getFavEl(); // Accessing favicon element
      if(favicon) {
        favicon.href = ADMIN_URL+IMG_URL + feviconImg;
      }
      
  }
  /******************* 
  @Purpose : Used for get globle setting
  @Parameter : {}
  @Author : INIC
  ******************/
  const GetGlobalSettings = async () => {
    const response = await props.callApi(
      API.GET_GLOBAL_SETTINGS,
      "",
      "get",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      let {
        currency,
        metaDescription,
        metaKeyword,
        metaTitle,
        analyticsSnippet,
        dateFormat,
        footerSnippet,
        siteLogoLarge,
        headerSnippet,
        offlineMessage,
        onlineStatus,
        timeFormat,
        timeZone,
        siteName,
        siteFavicon,
        siteLogoSmall,
        siteUnderMaintainence,
      } = response.data;

      setSiteName(siteName);
      setCurrency(currency);
      setDateFormat(dateFormat);
      setMetaDescription(metaDescription);
      setMetaKeyword(metaKeyword);
      setMetaTitle(metaTitle);
      setAnalyticsSnippet(analyticsSnippet);
      setFooterSnippet(footerSnippet);
      setHeaderSnippet(headerSnippet);
      setOfflineMessage(offlineMessage);
      setOnlineStatus(onlineStatus);
      setTimeFormat(timeFormat);
      setTimeZone(timeZone);
      setFeviconImg(siteFavicon);
      setSmallImg(siteLogoSmall);
      setLargeImg(siteLogoLarge);
      setSiteUnderMaintainence(siteUnderMaintainence);
      setStartDate(siteUnderMaintainence.startDate);
      setEndDate(siteUnderMaintainence.endDate);
      setFavIcon()
    }
  };
  /******************* 
  @Purpose : Used for get date time format
  @Parameter : {}
  @Author : INIC
  ******************/
  const getDateTimeFormat = async () => {
    let body = {
      loginId: localStorage.getItem("accessToken"),
    };

    const responseDate = await props.callApi(
      API.GET_DATE_SETTINGS,
      body,
      "get",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (responseDate.status === 1) {
      let { dateFormat, timeFormat, timeZone } = responseDate.data;
      let timeZones = timeZone.split(" ")[1];
      let mergedDate;

      if (timeFormat === "24 Hours") {
        mergedDate = moment(startDate)
          .tz(`${timeZones}`)
          .format(`${dateFormat} HH:mm `);
      } else {
        mergedDate = moment(startDate)
          .tz(`${timeZones}`)
          .format(`${dateFormat} h:mm A `);
      }
    }
  };
  /******************* 
  @Purpose : Used for add globle settings
  @Parameter : {}
  @Author : INIC
  ******************/
  const addGlobalSettings = async () => {
    if (validateForm()) {
      var body = {
        page: page,
        pagesize: pagesize,
        siteName: siteName,
        siteFavicon: feviconImg,
        siteLogoSmall: smallImg,
        siteLogoLarge: largeImg,
        onlineStatus: onlineStatus,
        offlineMessage: offlineMessage,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
        metaKeyword: metaKeyword,
        currency: currency,
        dateFormat: dateFormat,
        timeFormat: timeFormat,
        timeZone: timeZone,
        footerSnippet: footerSnippet,
        headerSnippet: headerSnippet,
        analyticsSnippet: analyticsSnippet,
        siteUnderMaintainence: {
          startDate: startDate,
          endDate: endDate,
        },
      };
      const response = await props.callApi(
        API.ADD_Global_settings,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Updated successfully", "success")
        GetGlobalSettings();
      }
    }
  };
  /******************* 
  @Purpose : Used for validate form
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    let errors = {
      siteName,
      metaDescription,
      metaKeyword,
      metaTitle,
      analyticsSnippet,
      footerSnippet,
      headerSnippet,
      offlineMessage,
      feviconImg,
      smallImg,
      largeImg,
      date,
    };
    let isFormValid = true;
    if (!siteName.trim()) errors.siteName = errorMessages.PROVIDE_NAME;
    else errors.siteName = "";
    if (!feviconImg) errors.feviconImg = errorMessages.PROVIDE_SITE_FEVICON;
    else errors.feviconImg = "";
    if (!smallImg) errors.smallImg = errorMessages.PROVIDE_SITE_SMALL_LOGO;
    else errors.smallImg = "";
    if (!largeImg) errors.largeImg = errorMessages.PROVIDE_SITE_LARGE_LOGO;
    else errors.largeImg = "";

    if (!offlineMessage.trim())
      errors.offlineMessage = errorMessages.PROVIDE_OOFLINEMSG;
    else if (offlineMessage.length > 50)
      errors.offlineMessage = errorMessages.PROVIDE_LIMITED_OFFLINE_MSG;
    else errors.offlineMessage = "";

    if (!metaTitle.trim()) errors.metaTitle = errorMessages.PROVIDE_METATITLE;
    else if (metaTitle.length > 70)
      errors.metaTitle = errorMessages.PROVIDE_METATITLE_LIMIT;
    else errors.metaTitle = "";

    if (!metaKeyword.trim())
      errors.metaKeyword = errorMessages.PROVIDE_METAKEYWORD;
    else if (metaKeyword.length > 158)
      errors.metaKeyword = errorMessages.PROVIDE_METAKEYWORDS_LIMIT;
    else errors.metaKeyword = "";

    if (!metaDescription.trim())
      errors.metaDescription = errorMessages.PROVIDE_METADESCRIPTION;
    else if (metaDescription.length > 160)
      errors.metaDescription = errorMessages.PROVIDE_METADESCRIPTION_LIMIT;
    else errors.metaDescription = "";

    if (!analyticsSnippet.trim())
      errors.analyticsSnippet = errorMessages.PORVIDE_ANALYTICS;
    else errors.analyticsSnippet = "";

    if (!footerSnippet.trim())
      errors.footerSnippet = errorMessages.PROVIDE_FOOTERSINPPET;
    else errors.footerSnippet = "";

    if (!headerSnippet.trim())
      errors.headerSnippet = errorMessages.PROVIDE_HEADERSINPPET;
    else errors.headerSnippet = "";

    if (Date.parse(startDate) < Date.parse(new Date()))
      errors.date = errorMessages.START_LESS_THAN_CURRENT;
    else if (Date.parse(endDate) < Date.parse(new Date()))
      errors.date = errorMessages.END_LESS_THAN_CURRENT;
    else if (Date.parse(endDate) < Date.parse(startDate))
      errors.date = errorMessages.START_END_DATE_ERROR;
    else if (Date.parse(endDate) - Date.parse(startDate) === 0)
      errors.date = errorMessages.START_END_DATE_EQUAL_ERROR;
    else errors.date = "";

    if (
      errors.date !== "" ||
      errors.siteName !== "" ||
      errors.offlineMessage !== "" ||
      errors.metaTitle !== "" ||
      errors.metaKeyword !== "" ||
      errors.metaDescription !== "" ||
      errors.analyticsSnippet !== "" ||
      errors.footerSnippet !== "" ||
      errors.headerSnippet !== ""
    )
      isFormValid = false;
    else isFormValid = true;
    setErrors(errors);
    setIsFormValid(isFormValid);
    return isFormValid;
  };
  /******************* 
  @Purpose : Used for meta title change
  @Parameter : e
  @Author : INIC
  ******************/
  const handleMetaTitleChange = (e) => {
    let maxChar = 70;
    metaTitleTrackChanges.current.textContent = `Maximum ${
      maxChar - e.target.value.length
    } characters is suitable`;
    setMetaTitle(e.target.value);
    errors = Object.assign(errors, { metaTitle: "" });
    setErrors(errors);
  };
  /******************* 
  @Purpose : Used for meta keyword change
  @Parameter : e
  @Author : INIC
  ******************/
  const handleMetaKeywordChange = (e) => {
    let maxChar = 150;
    metaKeywordTrackChanges.current.textContent = `Maximum ${
      maxChar - e.target.value.length
    } characters is suitable`;
    setMetaKeyword(e.target.value);
    errors = Object.assign(errors, { metaKeyword: "" });
    setErrors(errors);
  };
  /******************* 
  @Purpose : Used for meta description change
  @Parameter : e
  @Author : INIC
  ******************/
  const handleMetaDescriptionChange = (e) => {
    let maxChar = 160;
    metaDescriptionTrackChanges.current.textContent = `Maximum ${
      maxChar - e.target.value.length
    } characters is suitable`;
    setMetaDescription(e.target.value);
    errors = Object.assign(errors, { metaDescription: "" });
    setErrors(errors);
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="content-header-title">
                  {lang("GeneralSettings.general")}
                </li>
                <li className="breadcrumb-item">
                  <Link onClick={() => props.history.push("/dashboard")}>
                    <i className="bx bx-home-alt" />
                  </Link>
                </li>
                <li className="breadcrumb-item">Settings</li>
                <li className="breadcrumb-item active" aria-current="page">
                  {lang("GeneralSettings.general")}
                </li>
              </ol>
            </nav>
            <div className="card notification-card">
              <form action="#">
                <div className="row">
                  <div className="form-group col-md-6 mb-md-5 mb-3">
                    <label for="SiteName">
                      {lang("GeneralSettings.siteName")}
                      <sup className="text-danger">*</sup>
                    </label>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        id="SiteName"
                        placeholder="IndiaNIC | IT Sevices India"
                        value={siteName}
                        onChange={(e) => {
                          setSiteName(e.target.value);
                          errors = Object.assign(errors, { siteName: "" });
                          setErrors(errors);
                        }}
                      />
                    </div>
                    <span className="error-msg" style={{ color: "red" }}>
                      {" "}
                      {errors.siteName}{" "}
                    </span>
                  </div>
                  <div className="d-flex align-items-center col-md-6 mb-md-5 mb-3">
                    <div className="form-group mr-3">
                      <label for="SiteFavicon">
                        {lang("GeneralSettings.siteFavicon")}
                      </label>
                      <div className="custom-file add">
                        <input
                          type="file"
                          className="custom-file-input form-control"
                          id="SiteFavicon"
                          placeholder="No file selected"
                          onChange={(e) => onSelectFile(e, "siteFevicon")}
                        />
                        <label
                          className="custom-file-label selected"
                          for="SiteFavicon"
                        ></label>
                      </div>
                      <label>Recomended Size 16 x 16 pixels</label>

                      <span className="error-msg" style={{ color: "red" }}>
                        {" "}
                        {errors.feviconImg}{" "}
                      </span>
                    </div>
                    <div className="img-demo1">
                      {feviconImg !== null ? (
                        <img src={ADMIN_URL+IMG_URL + feviconImg} alt="Icon" />
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-6 d-flex align-items-center align-self-start mb-md-5 mb-3">
                    <div className="form-group mr-3 site-logo">
                      <label for="SiteLogo">
                        {lang("GeneralSettings.siteSmallLogo")}
                      </label>
                      <div className="custom-file add">
                        <input
                          type="file"
                          className="custom-file-input form-control"
                          id="SiteLogo"
                          placeholder="No file selected"
                          onChange={(e) => onSelectFile(e, "Site Logo Small")}
                        />
                        <label
                          className="custom-file-label selected"
                          for="SiteLogo"
                        ></label>
                      </div>
                      <label>Recomended Size 152 x 152 pixels</label>
                      <span className="error-msg" style={{ color: "red" }}>
                        {" "}
                        {errors.smallImg}{" "}
                      </span>
                    </div>
                    <div className="img-demo2">
                      {smallImg !== null ? (
                        <img src={ADMIN_URL+IMG_URL + smallImg} alt="Icon" />
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-6 mb-md-5 mb-3">
                    <div className="form-group mr-3">
                      <label for="SiteLogo">
                        {lang("GeneralSettings.siteBigLarge")}
                      </label>
                      <div className="custom-file add">
                        <input
                          type="file"
                          className="custom-file-input form-control"
                          id="SiteLogo"
                          placeholder="No file selected"
                          onChange={(e) => onSelectFile(e, "Site Logo Large")}
                        />
                        <label
                          className="custom-file-label selected"
                          for="SiteLogo"
                        ></label>
                      </div>
                      <label>Recomended Size 350 x 150 pixels</label>
                      <span className="error-msg" style={{ color: "red" }}>
                        {" "}
                        {errors.largeImg}{" "}
                      </span>
                    </div>
                    <div className="img-demo3">
                      {largeImg !== null ? (
                        <img src={ADMIN_URL+IMG_URL + largeImg} alt="Icon" />
                      ) : null}
                    </div>
                  </div>
                </div>
              </form>
              <Accordion defaultActiveKey="">
                <Card
                  className={
                    !onlineStatus
                      ? "p-0 pb-7 custom-accordian disable"
                      : "p-0 pb-7 custom-accordian"
                  }
                >
                  <Card.Header>
                    <div className="collapse-title d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="mr-2 icon">
                          <i class="bx bx-loader text-primary"></i>
                        </div>
                        <div>
                          <h5 className="mb-0">
                            {lang("GeneralSettings.siteMaintainance")}
                          </h5>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="custom-control custom-switch light">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="switchCheckbox1"
                            checked={onlineStatus ? true : false}
                            onChange={() => setOnlineStatus(!onlineStatus)}
                          />
                          <label
                            className="custom-control-label"
                            for="switchCheckbox1"
                          ></label>
                        </div>
                        <Accordion.Toggle
                          as={Button}
                          variant="link"
                          eventKey="0"
                          onClick={() => setMenuToggleSite(!menuToggleSite)}
                          className={menuToggleSite ? "arrow-down" : "arrow-up"}
                        >
                          <div
                            className="collapse-arrow"
                            data-toggle="collapse"
                            data-target="#collapseOne"
                            aria-expanded="false"
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
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <h6 className="mb-4 text-gray-dk">
                            {lang("GeneralSettings.siteMaintainanceMessage")}
                          </h6>
                          <fieldset className="form-group position-relative has-icon-left d-flex align-items-ceneter flex-wrap">
                            <div className="mr-0 mr-sm-4">
                              <label className="mr-0 mr-sm-4">
                                {lang("GeneralSettings.startDate")}
                              </label>
                              <Datetime
                                className="d-block w-100"
                                placeholderText="Select Start Date"
                                inputProps={{
                                  ...(!onlineStatus && { disabled: true }),
                                }}
                                dateFormat={dateFormat}
                                timeFormat={
                                  timeFormat === "24 Hours" ? "HH:mm" : "h:mm A"
                                }
                                value={startDate ? new Date(startDate) : ""}
                                onChange={(date) => setStartDate(date)}
                              />
                            </div>
                            <div>
                              <label className="mr-2 d-block">
                                {lang("GeneralSettings.endDate")}
                              </label>
                              <Datetime
                                className="d-block w-100"
                                placeholderText="Select End Date"
                                inputProps={{
                                  ...(!onlineStatus && { disabled: true }),
                                }}
                                dateFormat={dateFormat}
                                timeFormat={
                                  timeFormat === "24 Hours" ? "HH:mm" : "h:mm A"
                                }
                                value={endDate ? new Date(endDate) : ""}
                                onChange={(date) => setEndDate(date)}
                              />
                            </div>
                            <span
                              className="error-msg"
                              style={{ color: "red" }}
                            >
                              {" "}
                              {errors.date}{" "}
                            </span>
                          </fieldset>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label for="OfflineMessage">
                              {lang("GeneralSettings.offlineMessage")}
                            </label>
                            <textarea
                              className="form-control"
                              id="OfflineMessage"
                              rows="5"
                              placeholder="Write your message here"
                              value={offlineMessage}
                              disabled={!onlineStatus ? true : false}
                              onChange={(e) => {
                                setOfflineMessage(e.target.value);
                                errors = Object.assign(errors, {
                                  offlineMessage: "",
                                });
                                setErrors(errors);
                              }}
                            ></textarea>
                          </div>
                          <span className="error-msg" style={{ color: "red" }}>
                            {" "}
                            {errors.offlineMessage}{" "}
                          </span>
                        </div>
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card className="p-0 pb-7 custom-accordian">
                  <Card.Header>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="mr-2 icon">
                          <i class="bx bx-code text-primary"></i>
                        </div>
                        <div>
                          <h5 className="mb-0">
                            {lang("GeneralSettings.metaData")}
                          </h5>
                        </div>
                      </div>
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey="1"
                        onClick={() => setMenuToggleMeta(!menuToggleMeta)}
                        className={menuToggleMeta ? "arrow-down" : "arrow-up"}
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
                  </Card.Header>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>
                      <form>
                        <div className="form-group mb-md-5 mb-3">
                          <label for="MetaTitle">
                            {lang("GeneralSettings.metaTitle")}
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="MetaTitle"
                            placeholder="Admin Panel"
                            value={metaTitle}
                            maxLength="70"
                            onChange={(e) => handleMetaTitleChange(e)}
                          />
                          <small
                            id="MetaTitle"
                            className="form-text"
                            ref={metaTitleTrackChanges}
                          >
                            Maximum {70 - metaTitle.length} characters is
                            suitable
                          </small>
                          <span className="error-msg" style={{ color: "red" }}>
                            {" "}
                            {errors.metaTitle}{" "}
                          </span>
                        </div>
                        <div className="form-group mb-md-5 mb-3">
                          <label for="MetaKeywords">
                            {lang("GeneralSettings.metaKeywords")}
                          </label>
                          <textarea
                            rows="5"
                            className="form-control"
                            id="MetaKeywords"
                            placeholder="Admin Panel"
                            value={metaKeyword}
                            maxLength="150"
                            onChange={(e) => handleMetaKeywordChange(e)}
                          ></textarea>
                          <small
                            id="MetaKeywords"
                            className="form-text"
                            ref={metaKeywordTrackChanges}
                          >
                            Maximum {150 - metaKeyword.length} characters is
                            suitable
                          </small>
                          <span className="error-msg" style={{ color: "red" }}>
                            {" "}
                            {errors.metaKeyword}{" "}
                          </span>
                        </div>
                        <div className="form-group mb-md-5 mb-3">
                          <label for="MetaDescription">
                            {lang("GeneralSettings.metaDescription")}
                          </label>
                          <textarea
                            rows="5"
                            className="form-control"
                            id="MetaDescription"
                            placeholder="Admin Panel"
                            value={metaDescription}
                            maxLength="160"
                            onChange={(e) => handleMetaDescriptionChange(e)}
                          ></textarea>
                          <small
                            id="MetaDescription"
                            className="form-text"
                            ref={metaDescriptionTrackChanges}
                          >
                            Maximum {160 - metaDescription.length} characters is
                            suitable
                          </small>
                          <span className="error-msg" style={{ color: "red" }}>
                            {" "}
                            {errors.metaDescription}{" "}
                          </span>
                        </div>
                      </form>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card className="p-0 pb-7 custom-accordian">
                  <Card.Header>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="mr-2 icon">
                          <i class="bx bx-bar-chart-alt text-primary"></i>
                        </div>
                        <div>
                          <h5 className="mb-0">
                            {lang("GeneralSettings.analyticalData")}
                          </h5>
                        </div>
                      </div>
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey="2"
                        onClick={() =>
                          setMenuToggleAnalytics(!menuToggleAnalytics)
                        }
                        className={
                          menuToggleAnalytics ? "arrow-down" : "arrow-up"
                        }
                      >
                        <div className="collapse-arrow">
                          <div className="arrow"></div>
                        </div>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>

                  <Accordion.Collapse eventKey="2">
                    <Card.Body>
                      <div className="form-group mb-md-5 mb-3">
                        <label for="HeaderSnippet">
                          {lang("GeneralSettings.headerSnippet")}
                        </label>
                        <CKEditor
                          className="ck-editor__editable "
                          columns={40}
                          editor={ClassicEditor}
                          data={headerSnippet}
                          onInit={(editor) => {}}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setHeaderSnippet(data);
                          }}
                        />
                        <span className="error-msg" style={{ color: "red" }}>
                          {" "}
                          {errors.headerSnippet}{" "}
                        </span>
                      </div>
                      <div className="form-group mb-md-5 mb-3">
                        <label for="FooterSnippet">
                          {lang("GeneralSettings.footerSnippet")}
                        </label>
                        <CKEditor
                          className="ck-editor__editable "
                          columns={40}
                          editor={ClassicEditor}
                          data={footerSnippet}
                          onInit={(editor) => {}}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setFooterSnippet(data);
                          }}
                        />
                        <span className="error-msg" style={{ color: "red" }}>
                          {" "}
                          {errors.footerSnippet}{" "}
                        </span>
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

              <form className="mb-md-2 mb-2">
                <div className="row">
                  <div className="form-group col-md-6 mb-md-5 mb-3">
                    <label for="Timezone">
                      {lang("GeneralSettings.timezone")}
                    </label>
                    <Select
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
                    </Select>
                  </div>
                  <div className="form-group col-md-6 mb-md-5 mb-3">
                    <label for="DateFormat">
                      {lang("GeneralSettings.dateformat")}
                    </label>
                    <Select
                      className="d-block custom-input"
                      onChange={(value) => setDateFormat(value)}
                      value={dateFormat}
                    >
                      <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                      <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                      <Option value="YYYY/MM/DD">YYYY/MM/DD</Option>
                    </Select>
                  </div>
                  <div className="form-group col-md-6 mb-md-0 mb-3">
                    <label for="Currency">
                      {lang("GeneralSettings.currency")}
                    </label>
                    <Select
                      className="d-block custom-input"
                      showSearch
                      onChange={(value) => setCurrency(value)}
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
                    </Select>
                  </div>
                  <div className="form-group col-md-6">
                    <label for="TimeFormat">
                      {lang("GeneralSettings.timeFormat")}
                    </label>
                    <Select
                      className="d-block custom-input"
                      onChange={(value) => setTimeFormat(value)}
                      value={timeFormat}
                      onFocus={GetAllTimezone}
                    >
                      <Option value="12 Hours">12 Hours</Option>
                      <Option value="24 Hours">24 Hours</Option>
                    </Select>
                  </div>
                </div>
              </form>
              <div className="text-right mt-md-4 mt-3">
                <button className="btn btn-primary" onClick={addGlobalSettings}>
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
      <Modal
        isOpen={open}
        width="150"
        height="150"
        onRequestClose={closeLoginModal}
        style={customStylesModal}
      >
        <div className="App mt-3 col-12 profile-img-crop">
          {src && (
            <div>
              <i
                className="fa fa-times-circle-o text-danger pull-right fa-2x"
                onClick={closeLoginModal}
              />
              <Cropper
                style={{ height: 400, width: "100%" }}
                initialAspectRatio={1}
                preview=".img-preview"
                src={src}
                viewMode={1}
                guides={true}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
              />

              <div className="button-continer pull-right my-2">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={fileUploadSubmit}
                >
                  {" "}
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </Layout>
  );
}
/******************* 
@Purpose : Used for get data from redux
@Parameter : state
@Author : INIC
******************/
const mapStateToProps = (state) => ({
  language: state.admin.language,
});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, { callApi })(GeneralSettings);
