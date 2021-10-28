import React, { useEffect, useState, useRef } from "react";
import Layout from "../../components/Layout/Layout";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { callApi } from "../../api"; // Used for api call
import { Link } from "react-router-dom";
import API from "../../api/Routes";
import _ from "lodash";
import moment from "moment";
import { useSorting } from "../../hooks";
import StaticEditorEdit from "../../components/Editor/BlogEditorAdd";
import { showMessageNotification } from "./../../utils/Functions"; //Utility functions
import Datetime from "react-datetime";
import { ADMIN_URL } from "../../config";

/******************* 
@Purpose : Used for static CMS pages
@Parameter : props
@Author : INIC
******************/
function AddPage(props) {
  const [lang] = useTranslation("language");
  const editorRef = useRef();
  const [metaKeyword, setMetaKeyword] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [gjsHtml, setGHtml] = useState("");
  const [postDate, setPostDate] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [pageStatus, setPageStatus] = useState(false);
  const [, setCreatedBy] = useState("");
  const [, setCreatedById] = useState("");
  const [, setIsFormValid] = useState(true);
  const [dateFormatUI, setDateFormatUI] = useState("");
  const [timeFormatUI, setTimeFormatUI] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  let [errors, setErrors] = useState({});
  const metaTitleTrackChanges = useRef(null);
  const metaKeywordTrackChanges = useRef(null);
  const metaDescriptionTrackChanges = useRef(null);
  const pageTitleTrackChanges = useRef(null);


  useEffect(() => {
    if (props.admindata && !_.isEmpty(props.admindata)) {
      let { firstname, lastname, _id } = props.admindata;
      setCreatedBy(firstname + " " + lastname);
      setCreatedById(_id);
    }
  }, []);

  /******************* 
  @Purpose : Used for page title change
  @Parameter : e
  @Author : INIC
  ******************/
  const handlePageTitleChange = (e) => {
    let maxChar = 70;
    pageTitleTrackChanges.current.textContent = `Maximum ${
      maxChar - e.target.value.length
    } characters is suitable`;
    setPageTitle(e.target.value);
    errors = Object.assign(errors, { pageTitle: "" });
    setErrors(errors);
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
    let maxChar = 250;
    metaDescriptionTrackChanges.current.textContent = `Maximum ${
      maxChar - e.target.value.length
    } characters is suitable`;
    setMetaDescription(e.target.value);
    errors = Object.assign(errors, { metaDescription: "" });
    setErrors(errors);
  };


  /******************* 
  @Purpose : Used for validate form
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    let error = {
      pageTitle: "",
      metaTitle: "",
      metaKeyword: "",
      metaDescription: "",
      gjsHtml: "",
    };
    let isFormValid = true;

    if (!pageTitle.trim()) error.pageTitle = "*Page title is required";
    else if (pageTitle.length > 70)
      error.pageTitle = "*Page title can't be more than 70 characters";
    else error.pageTitle = "";

    if (!metaTitle.trim()) error.metaTitle = "*Meta title is required";
    else if (metaTitle.length > 70)
      error.metaTitle = "*Meta title can't be more than 70 characters";
    else error.metaTitle = "";

    if (!metaKeyword.trim()) error.metaKeyword = "*Meta keyword is required";
    else if (metaKeyword.length > 150)
      error.metaKeyword = "*Meta keywords can't be more than 150 characters";
    else error.metaKeyword = "";

    if (!metaDescription.trim())
      error.metaDescription = "*Meta description is required";
    else if (metaDescription.length > 250)
      error.metaDescription =
        "*Meta keywords can't be more than 250 characters";
    else error.metaDescription = "";

    if (!gjsHtml.trim()) error.gjsHtml = "*Content is required";
    else if (gjsHtml.length < 50)
      error.gjsHtml = "*Caption must contain minimum 50 characters";
    else error.gjsHtml = "";

    if (
      error.pageTitle !== "" ||
      error.metaTitle !== "" ||
      error.metaKeyword !== "" ||
      error.metaDescription !== "" ||
      error.gjsHtml !== ""
    )
      isFormValid = false;

    setErrors(error);
    setIsFormValid(isFormValid);

    return isFormValid;
  };

  /******************* 
  @Purpose : Used for Update Static Page
  @Parameter : e
  @Author : INIC
  ******************/
  const updateCmsPage = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      let body = {
        pageTitle,
        metaTitle,
        metaKeyword,
        metaDescription,
        gjsHtml,
        status: pageStatus,
      };
      const response = await props.callApi(
        API.add_Update_CMS,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Page Added successfully", "success");
        setTimeout(() => {
          props.history.push("/staticPage");
        }, 1500);
      }
    }
  };
  /******************* 
  @Purpose : Used for preview
  @Parameter : content
  @Author : INIC
  ******************/
  const getpreview = (content) => {
    setGHtml(content);
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="content-header-title">Add Page</li>
                <li className="breadcrumb-item">
                  <Link
                    onClick={() => {
                      props.history.push("/dashboard");
                    }}
                  >
                    <i className="bx bx-home-alt" />
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link
                    onClick={() => {
                      props.history.push("/staticPage");
                    }}
                  >
                    Static Pages
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Add Page
                </li>
              </ol>
            </nav>
            <div className="d-flex align-items-center justify-content-end mb-2 flex-wrap">
              <span className="author d-lg-none d-flex">
                {lang("ContentManagement.CMS.Author")}
              </span>
            </div>
            <div className="blog-content-block">
              <div className="card card-media">
                <div className="row">
                  <div className="col-md-4"></div>
                  <div className="col-md-12">
                    <div className="form-group mb-md-5 mb-3">
                      <label htmlFor="pageTitle">
                        Page Title<sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="pageTitle"
                        name="pageTitle"
                        placeholder="IndiaNIC Joins the Clutch 1000!"
                        value={pageTitle}
                        maxLength="70"
                        onChange={(e) => handlePageTitleChange(e)}
                      />
                      <small
                        id="pageTitle"
                        className="form-text"
                        ref={pageTitleTrackChanges}
                      >
                        Maximum {70 - pageTitle.length} characters is suitable
                      </small>
                      <span className="text-danger d-block">
                        {errors.pageTitle}
                      </span>
                    </div>
                    <div className="form-group mb-md-5 mb-3">
                      <label htmlFor="Title">
                        {lang("ContentManagement.CMS.title")}
                        <sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="metaTitle"
                        name="metaTitle"
                        placeholder="IndiaNIC Joins the Clutch 1000!"
                        value={metaTitle}
                        onChange={(e) => handleMetaTitleChange(e)}
                      />
                      <small
                        id="metaTitle"
                        className="form-text"
                        ref={metaTitleTrackChanges}
                      >
                        Maximum {70 - metaTitle.length} characters is suitable
                      </small>
                      <span className="text-danger d-block">
                        {errors.metaTitle}
                      </span>
                    </div>

                    <div className="form-group mb-md-5 mb-3">
                      <label htmlFor="MetaKeywords">
                        {lang("ContentManagement.CMS.metaKeywords")}
                        <sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="metaKeyword"
                        name="metaKeyword"
                        placeholder="Keywords here!"
                        value={metaKeyword}
                        onChange={(e) => handleMetaKeywordChange(e)}
                      />
                      <small
                        id="MetaKeyword"
                        className="form-text"
                        ref={metaKeywordTrackChanges}
                      >
                        Maximum {150 - metaKeyword.length} characters is
                        suitable
                      </small>
                      <span className="text-danger d-block">
                        {errors.metaKeyword}
                      </span>
                    </div>
                    <div className="form-group mb-md-5 mb-3">
                      <label htmlFor="Description">
                        {lang("ContentManagement.CMS.metaDescription")}
                        <sup className="text-danger">*</sup>
                      </label>
                      <textarea
                        rows="6"
                        class="form-control"
                        placeholder="Describe this a bit"
                        id="metaDescription"
                        name="metaDescription"
                        value={metaDescription}
                        onChange={(e) => handleMetaDescriptionChange(e)}
                      />
                      <small
                        id="metaDescription"
                        className="form-text"
                        ref={metaDescriptionTrackChanges}
                      >
                        Maximum {250 - metaDescription.length} characters is
                        suitable
                      </small>
                      <span className="text-danger d-block">
                        {errors.metaDescription}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="content-img-block">
                  <div className="img-drag-section">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group mb-0">
                          <label htmlFor="caption">
                            {lang("ContentManagement.CMS.content")}
                            <sup className="text-danger">*</sup>
                          </label>

                          <StaticEditorEdit
                            className="form-control mx-auto"
                            editContent={gjsHtml}
                            ref={editorRef}
                            getPreview={getpreview}
                          />
                          <span className="text-danger d-block">
                            {errors.gjsHtml}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-end mt-3">
                  <div className="form-group">
                    <div className="button-group-container">
                      {
                        <React.Fragment>
                          <a
                            className="btn btn-primary mr-3 mb-sm-0 mb-2"
                            onClick={(e) => {
                              updateCmsPage(e);
                            }}
                          >
                            <span>Add</span>
                          </a>
                        </React.Fragment>
                      }
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => {
                          props.history.push("/staticPage");
                        }}
                      >
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="blog-sidebar">
              <div className="card card-profile">
                <div className="form-group">
                  <label>Last Update</label>
                  <div className="row">
                    <div className="col-md-12">
                      <fieldset className="form-group position-relative has-icon-left">
                        <Datetime
                          className="d-block w-100"
                          inputProps={{
                            placeholder: "Select date & time",
                          }}
                          dateFormat={dateFormatUI}
                          timeFormat={
                            timeFormatUI === "24 Hours" ? "HH:mm" : "h:mm A"
                          }
                          value={postDate ? new Date(postDate) : ""}
                          onChange={(date) => setPostDate(date)}
                        />
                      </fieldset>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <label className="mb-0">
                    {lang("ContentManagement.CMS.status")}
                  </label>
                  <span>
                    <div className="custom-control custom-switch light">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="blogStatus"
                        checked={pageStatus}
                        onChange={() => setPageStatus(!pageStatus)}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="blogStatus"
                      />
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
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
const mapStateToProps = (state) => ({
  // CmsPagesAccess: state.admin.adminData.staticRolePermission.cmsPagesAccess,
  CmsPagesAccess: {edit:true,delete:true,create:true},
  admindata: state.admin.adminData,
  language: state.admin.language,
});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, { callApi })(AddPage);
