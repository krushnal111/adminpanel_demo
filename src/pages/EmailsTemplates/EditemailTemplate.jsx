import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout/Layout";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { callApi } from "../../api"; // Used for api call
import { Link, withRouter } from "react-router-dom";
import { Select } from "antd";
import API from "../../api/Routes";
import SunEditorEdit from "../../components/Editor/SunEditorEdit";
import { showMessageNotification } from "./../../utils/Functions"; //Utility functions
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ADMIN_URL } from "../../config";
var { Option } = Select;
/******************* 
@Purpose : Used for email tamplet
@Parameter : props
@Author : INIC
******************/
function EditemailTemplate(props) {
  const editorRef = useRef();
  const [tags, setTags] = useState("");
  const [lang] = useTranslation("language");
  const [array, setArray] = useState([
    { key: "firstName", name: "FirstName" },
    { key: "lastName", name: "LastName" },
    { key: "emailId", name: "EmailID" },
  ]);
  const [emailTemplates, setEmailTemplates] = useState("");
  const [subject, setSubject] = useState("");
  const [adminId, setAdminId] = useState("");
  let [emailId, setEmailId] = useState("");
  const [templateTitle, setTemplateTitle] = useState("");
  var [errors, setErrors] = useState({});
  const [, setIsFormValid] = useState(true);
  let editId = localStorage.getItem("EmailTemplatesId");

  useEffect(() => {
    if (
      props.EmailTemplateAccess &&
      props.EmailTemplateAccess.create === false
    ) {
      props.history.push("/dashboard");
    }
    if (localStorage.getItem("EmailTemplatesId")) {
      let id = localStorage.getItem("EmailTemplatesId");
      getEmailTemlateDetails(id);
      setAdminId(id);
    }
  }, []);
  /******************* 
  @Purpose : Used for get email template
  @Parameter : id
  @Author : INIC
  ******************/
  const getEmailTemlateDetails = async (id) => {
    const response = await props.callApi(
      API.EMAIL_DETAILS + id,
      "",
      "get",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      let { emailKey, emailTitle, subject: sub, fromEmailId, emailContent } = response.data;

      setTemplateTitle(emailTitle);
      setSubject(sub);
      setEmailId(fromEmailId);
      setEmailTemplates(emailContent);
      setAdminId(id);
    }
  };
  /******************* 
  @Purpose : Used for add email templates
  @Parameter : event
  @Author : INIC
  ******************/
  const AddEmailTemplate = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      var body = {
        emailKey: templateTitle,
        subject,
        emailContent: emailTemplates,
        fromEmailId: emailId,
        createdAt: new Date().getTime()
      };
      const response = await props.callApi(
        API.ADD_UPDATE_EMAILS,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        props.history.push("/emailTemplates");
        showMessageNotification("Email Template added successfully", "success")
      }
    }
  };
  /******************* 
  @Purpose : Used for edit admin users
  @Parameter : event
  @Author : INIC
  ******************/
  const EditAdminUsers = async (event) => {
    event.preventDefault();
    var body = {
      _id: adminId,
      emailKey: templateTitle,
      subject,
      emailContent: emailTemplates,
      fromEmailId: emailId,
      updatedAt: new Date().getTime()
    };
    const response = await props.callApi(
      API.ADD_UPDATE_EMAILS,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      showMessageNotification("Email Template updated successfully", "success")
    }
    props.history.push("/emailTemplates");
  };
  /******************* 
  @Purpose : Used for get all tags
  @Parameter : {}
  @Author : INIC
  ******************/
  const GetAllTags = () => {
    setArray(array);
  };
  /******************* 
  @Purpose : Used for get preview
  @Parameter : content
  @Author : INIC
  ******************/
  const getpreview = (content) => {
    setEmailTemplates(content);
  };
  /******************* 
  @Purpose : Used for on cancle handle
  @Parameter : {}
  @Author : INIC
  ******************/
  const onCancel = () => {
    localStorage.removeItem("EmailTemplatesId");
    props.history.push("/emailTemplates");
  };
  /******************* 
  @Purpose : Used for validate form
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    let error = { templateTitle, subject, emailId, emailTemplates };
    var mailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|(^\d{10}$)+$/;
    let isFormValid = true;
    if (!templateTitle.trim()) error.templateTitle = "Please enter title";
    else if (templateTitle.length > 15)
      error.templateTitle = "Title should be under 15 characters";
    else error.templateTitle = "";

    if (!subject.trim()) error.subject = "Please enter subject";
    else if (subject.length > 150)
      error.subject = "subject should be under 150 characters";
    else error.subject = "";

    if (!emailId.trim()) error.emailId = "Please enter email id ";
    else if (!mailFormat.test(emailId))
      error.emailId = "Please enter vaild email";
    else error.emailId = "";

    if (!emailTemplates.trim())
      error.emailTemplates = "Please add  email description";
    else error.emailTemplates = "";

    if (
      error.templateTitle !== "" ||
      error.subject !== "" ||
      error.emailId !== "" ||
      error.emailTemplates !== ""
    )
      isFormValid = false;

    setErrors(error);
    setIsFormValid(isFormValid);
    return isFormValid;
  };
  /******************* 
  @Purpose : Used for copy data
  @Parameter : {}
  @Author : INIC
  ******************/
  const onCopy = () => {
    showMessageNotification("Copied successfully", "success")
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block">
            <div className="d-flex align-items-center justify-content-between flex-wrap">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="content-header-title">
                    {lang("EmailTemplates.emailTemplates")}
                  </li>
                  <Link
                    className="breadcrumb-item"
                    onClick={() => props.history.push("/dashboard")}
                    className="bx bx-home-alt mr-2"
                  />
                  <li className="breadcrumb-item active" aria-current="page">
                    <Link onClick={() => props.history.push("/emailTemplates")}>
                      {lang("EmailTemplates.emailTemplates")}
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Edit Email Template
                  </li>
                </ol>
              </nav>
            </div>
            <div className="card">
              <div className="email-form">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3 mb-md-5">
                      <label htmlFor="Title">
                        {lang("EmailTemplates.title")}
                      </label>
                      <input
                        type="text"
                        id="Title"
                        className="form-control"
                        placeholder="Title"
                        value={templateTitle}
                        onChange={(e) => {
                          setTemplateTitle(e.target.value);
                          errors = Object.assign(errors, {
                            templateTitle: "",
                          });
                          setErrors(errors);
                        }}
                      />
                      <span className="error-msg" style={{ color: "red" }}>
                        {" "}
                        {errors.templateTitle}{" "}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3 mb-md-5">
                      <label htmlFor="Subject">
                        {lang("EmailTemplates.subject")}
                      </label>
                      <input
                        type="text"
                        id="Subject"
                        className="form-control"
                        placeholder="Subject"
                        value={subject}
                        required
                        onChange={(e) => {
                          setSubject(e.target.value);
                          errors = Object.assign(errors, { subject: "" });
                          setErrors(errors);
                        }}
                      />
                      <span className="error-msg" style={{ color: "red" }}>
                        {" "}
                        {errors.subject}{" "}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3 mb-md-5">
                      <label htmlFor="EmailAddress">
                        {lang("EmailTemplates.fromemailAddress")}
                      </label>
                      <input
                        type="email"
                        id="EmailAddress"
                        className="form-control"
                        placeholder="Email address"
                        onChange={(e) => {
                          setEmailId(e.target.value);
                          errors = Object.assign(errors, { emailId: "" });
                          setErrors(errors);
                        }}
                        value={emailId}
                      />
                      <span className="error-msg" style={{ color: "red" }}>
                        {" "}
                        {errors.emailId}{" "}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3 mb-md-5">
                      <label htmlFor="Tags">
                        {lang("EmailTemplates.tags")}
                      </label>
                      <Select
                        className="d-block custom-input"
                        showSearch
                        onChange={(value) => setTags(value)}
                        value={tags}
                        onFocus={GetAllTags}
                      >
                        {array.map((tag, key) => {
                          return (
                            <Option key={key} value={tag.name}>
                              {tag.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </div>
                    {tags !== "" && (
                      <div className="form-group w-100">
                        <label className="mr-2 mb-2">Copy Tag</label>
                        <div className="position-relative">
                          <CopyToClipboard
                            text={`{{{${tags}}}}`}
                            onCopy={() => onCopy()}
                          >
                            <button
                              type="text"
                              className="btn btn-copy mr-2 d-flex align-items-center"
                              value={tags}
                              readOnly
                            >
                              {tags}
                              <span className="bx bx-note copy-content ml-3"></span>
                            </button>
                          </CopyToClipboard>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <SunEditorEdit
                    editContenet={emailTemplates}
                    ref={editorRef}
                    getPreview={getpreview}
                  />
                  <span className="error-msg" style={{ color: "red" }}>
                    {" "}
                    {errors.emailTemplates}{" "}
                  </span>
                </div>
                <div className="text-right mt-3">
                  <a
                    className="btn btn-primary mr-0 mr-sm-3 mb-2 mb-sm-0"
                    onClick={(e) => {
                      editId ? EditAdminUsers(e) : AddEmailTemplate(e);
                    }}
                  >
                    {" "}
                    {editId ? "Update" : "Save"}{" "}
                  </a>
                  <a
                    className="btn btn-light-secondary"
                    onClick={() => onCancel()}
                  >
                    Cancel
                  </a>
                </div>
              </div>
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
@Purpose : Used for get data from redux
@Parameter : state
@Author : INIC
******************/
const mapStateToProps = (state) => {
  return {
    emailId: state.admin.editEmailId,
    language: state.admin.language,
    EmailTemplateAccess:
      // state.admin.adminData.staticRolePermission.emailTemplateAccess,
      {edit:true,delete:true,create:true}
  };
};
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, { callApi })(
  withRouter(EditemailTemplate)
);
