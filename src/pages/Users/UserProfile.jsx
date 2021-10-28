import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { callApi } from "../../api"; // Used for api call
import { validateEmail, validateURL , showMessageNotification} from "./../../utils/Functions"; // Utility functions
import { Link } from "react-router-dom";
import Select from "react-select";
import { isEmpty } from "lodash";
import PhoneInput from "react-phone-input-2";
import { connect } from "react-redux";
import errorMessages from "../../utils/ErrorMessages";
import countryList from "react-select-country-list";
import API from "../../api/Routes";
import CropImages from "../../components/CropImages/CropImages";
import { ADMIN_URL, IMG_URL } from "../../config";
import DatePicker from "react-datepicker";
import swal from "sweetalert";
import "react-datepicker/dist/react-datepicker.css";
import Layout from "../../components/Layout/Layout";
/******************* 
@Purpose : Used for users profile page
@Parameter : props
@Author : INIC
******************/
function UserProfile(props) {
  const [lang] = useTranslation("language");
  const options = countryList().getData();
  const [photo, setPhoto] = useState("");
  const [birthday, setBirthday] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "Male",
    dob: "",
    website: "",
    mobile: "",
    address: "",
    country: "",
    twitterLink: "",
    fbLink: "",
    instagramLink: "",
    company: "",
    gitHubLink: "",
    codePen: "",
    slack: "",
    errors: {},
  });
  let [loading] = useState(false);
  let [, setdisablePhoneinput] = useState(false);
  const [status, setStatus] = useState(true);
  const [userId, setUserId] = useState("");
  let {
    firstName,
    lastName,
    email,
    website,
    mobile,
    gender,
    address,
    country,
    slack,
    company,
    errors,
  } = formData;

  useEffect(() => {
    if (props.UserAccess && props.UserAccess.viewDetails === false) {
      props.history.push("/dashboard");
    }
    let id = props.match.params;
    if (id) {
      getDetails(id.slug);
      setUserId(id.slug);
    }
    getCountryList();
  }, []);
  /******************* 
  @Purpose : Used for get users details
  @Parameter : id
  @Author : INIC
  ******************/
  const getDetails = async (id) => {
    const response = await props.callApi(
      API.GET_USERS_PROFILE + id,
      "",
      "get",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      let { data } = response,
        {
          firstName,
          lastName,
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
          status,
          company,
        } = data;
      setFormData({
        ...formData,
        firstName,
        lastName,
        email: emailId,
        gender,
        website: website,
        mobile,
        address: address,
        country: country,
        twitterLink: twitterLink,
        fbLink: fbLink,
        instagramLink: instagramLink,
        gitHubLink: gitHubLink,
        codePen: codePen,
        slack: slack,
        status,
        company,
      });
      setBirthday(dob);
      setPhoto(photo);
    }
  };
  /******************* 
  @Purpose : Used for get country List at the time of Add contry
  @Parameter : {}
  @Author : INIC
  ******************/
  const getCountryList = async () => {
    const response = await props.callApi(
      API.GET_LIST,
      null,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      // setCountryList(response.data )
    }
  };
  /******************* 
  @Purpose : Used for validate form
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    const {
      firstName,
      lastName,
      email,
      website,
      twitterLink,
      fbLink,
      instagramLink,
      gitHubLink,
      codePen,
    } = formData;

    // for firstName
    if (formData.hasOwnProperty("firstName")) {
      if (isEmpty(firstName))
        errors.firstName = errorMessages.PROVIDE_FIRST_NAME;
      else delete errors.firstName;
    }

    //for lastName
    if (formData.hasOwnProperty("lastName")) {
      if (isEmpty(lastName)) errors.lastName = errorMessages.PROVIDE_LAST_NAME;
      else delete errors.lastName;
    }

    if (formData.hasOwnProperty("email")) {
      if (isEmpty(email)) errors.email = errorMessages.PROVIDE_EMAIL;
      else if (!validateEmail(email))
        errors.email = errorMessages.PROVIDE_VALID_EMAIL;
      else delete errors.email;
    }

    if (formData.hasOwnProperty("website")) {
      if (!isEmpty(website) && !validateURL(website))
        errors.website = errorMessages.PROVIDE_WEBSITE;
      else delete errors.website;
    }

    if (formData.hasOwnProperty("company")) {
      if (!company.trim()) errors.company = errorMessages.PROVIDE_COMPANY_NAME;
      else delete errors.company;
    }

    //for twitterLink
    if (formData.hasOwnProperty("twitterLink")) {
      if (!isEmpty(twitterLink) && !validateURL(twitterLink))
        errors.twitterLink = errorMessages.PROVIDE_TWITTER;
      else delete errors.twitterLink;
    }

    //for fbLink
    if (formData.hasOwnProperty("fbLink")) {
      if (!isEmpty(fbLink) && !validateURL(fbLink))
        errors.fbLink = errorMessages.PROVIDE_FACEBOOK;
      else delete errors.fbLink;
    }

    //for instagramLink
    if (formData.hasOwnProperty("instagramLink")) {
      if (!isEmpty(instagramLink) && !validateURL(instagramLink))
        errors.instagramLink = errorMessages.PROVIDE_INSTAGRAM;
      else delete errors.instagramLink;
    }

    //for gitHubLink
    if (formData.hasOwnProperty("gitHubLink")) {
      if (!isEmpty(gitHubLink) && !validateURL(gitHubLink))
        errors.gitHubLink = errorMessages.PROVIDE_GITHUB;
      else delete errors.gitHubLink;
    }

    //for codepen
    if (formData.hasOwnProperty("codePen")) {
      if (!isEmpty(codePen) && !validateURL(codePen))
        errors.codePen = errorMessages.PROVIDE_CODEPEN;
      else delete errors.codePen;
    }

    //for slack
    if (formData.hasOwnProperty("slack")) {
      if (!isEmpty(slack) && !validateURL(slack))
        errors.slack = errorMessages.PROVIDE_SLACK;
      else delete errors.slack;
    }

    delete errors.gender;
    delete errors.address;
    delete errors.gender;

    const isFormValid = Object.keys(errors).length !== 0 ? false : true;
    setFormData({
      ...formData,
      errors: errors,
    });
    return isFormValid;
  };
  /******************* 
  @Purpose : Used for change form value
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
  @Purpose : Used for change phone number
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
  @Purpose : Used for change country
  @Parameter : value
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
  @Purpose : Used for update user profile
  @Parameter : e
  @Author : INIC
  ******************/
  const updateUsersData = async (e) => {
    e.preventDefault();
    if (userId === "") {
      let { firstName, lastName, email } = formData;

      var body = Object.assign({}, formData);
      body.dob = birthday;
      body.emailId = email;
      body.status = status;
      body.userName = firstName + lastName;
      body.photo = photo;
    } else {
      let { firstName, lastName, email } = formData;

      var body = Object.assign({}, formData);
      body.dob = birthday;
      body.emailId = email;
      body.status = status;
      body.userName = firstName + lastName;
      body.photo = photo;
      body.userId = userId;
    }
    if (validateForm()) {
      const response = await props.callApi(
        API.ADD_NEW_USERS,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Data added successfully", "success")
        props.history.push("/adminusers");
      }
    }
  };
  /******************* 
  @Purpose : Used for get image preview
  @Parameter : e
  @Author : INIC
  ******************/
  const getpreview = (image) => {
    setPhoto(image);
  };
  /******************* 
  @Purpose : Used for delete user profile
  @Parameter : e
  @Author : INIC
  ******************/
  const deleteUser = async (uid) => {
    swal({
      title: "Are you sure,You Want To Delete ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        var body = { userIds: [uid] };

        const response = await props.callApi(
          API.DELETE_USERS,
          body,
          "post",
          null,
          true,
          false,
          ADMIN_URL
        );
        if (response.status === 1) {
          showMessageNotification("Deleted successfully", "success")
          props.history.push("/adminusers");
        }
      }
    });
  };
  let imagePreview = null;
  if (photo) {
    imagePreview = <img src={photo ? ADMIN_URL+IMG_URL + photo : ""} alt="Icon" />;
  } else {
    imagePreview = <img src={"assets/images/avatar-s-16.jpg"} alt="Icon" />;
  }
  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block">
            <form>
              <div className="d-flex align-items-center justify-content-between flex-wrap">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="content-header-title">
                      {lang("Usermanagement.edituser.labels.userprofile")}
                    </li>
                    <li className="breadcrumb-item">
                      <Link onClick={() => props.history.push("/dashboard")}>
                        <i className="bx bx-home-alt" />
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {lang("Usermanagement.edituser.labels.userprofile")}
                    </li>
                  </ol>
                </nav>
                <div className="btn-blocks mb-md-0 mb-2">
                  <a
                    className="btn btn-primary glow-primary mr-3"
                    onClick={(e) => updateUsersData(e)}
                  >
                    <em className="bx bx-revision mr-2" />
                    {loading ? "saving.." : "save"}
                  </a>
                  <a
                    className="btn btn-primary glow-primary mr-3"
                    onClick={() => deleteUser(userId)}
                  >
                    <em className="bx bx-revision mr-2" />
                    Delete
                  </a>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div class="card profile-card mb-5">
                    <div className="row">
                      <div className="col-lg-12 col-xl-3">
                        <div className="edit-image">
                          <div className="user-image">
                            {imagePreview}
                            <label className="img-upload" htmlfor="attach-file">
                              <CropImages getPreview={getpreview} />
                              <em className="bx bxs-edit-alt" />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-xl-9">
                        <div className="user-title-info user-details">
                          <div className="form-group d-flex align-items-center mb-md-4 mb-3">
                            <label className="mb-0" htmlFor="firstName">
                              {
                                lang("Usermanagement.edituser.labels.firsname")
                              }{" "}
                              <sup className="text-danger">*</sup>
                            </label>
                            <div className="w-100">
                              <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                name="firstName"
                                placeholder={
                                  lang("Usermanagement.edituser.labels.firsname")
                                }
                                value={firstName}
                                onChange={(e) => handleChange(e)}
                              />
                              <span className="text-danger d-block">
                                {errors.firstName}
                              </span>
                            </div>
                          </div>

                          <div className="form-group d-flex align-items-center mb-md-4 mb-3">
                            <label className="mb-0" htmlFor="lastName">
                              {
                                lang("Usermanagement.edituser.labels.lastname")
                              }{" "}
                              <sup className="text-danger">*</sup>
                            </label>
                            <div className="w-100">
                              <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                name="lastName"
                                placeholder={
                                  lang("Usermanagement.edituser.labels.lastname")
                                }
                                value={lastName}
                                onChange={(e) => handleChange(e)}
                              />

                              <span className="text-danger d-block">
                                {errors.lastName}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="user-title-info user-details">
                          <div className="form-group d-flex align-items-center mb-md-4 mb-3">
                            <label className="mb-0" htmlFor="email">
                              {
                                lang("Usermanagement.edituser.labels.email")
                              }{" "}
                              <sup className="text-danger">*</sup>
                            </label>
                            <div className="w-100">
                              <input
                                className="form-control"
                                id="email"
                                name="email"
                                placeholder={
                                  lang("Usermanagement.edituser.labels.email")
                                }
                                type="email"
                                value={email}
                                onChange={(e) => handleChange(e)}
                              />
                              <span className="text-danger d-block">
                                {errors.email}
                              </span>
                            </div>
                          </div>

                          <div className="form-group d-flex align-items-center mb-md-4 mb-3">
                            <label className="mb-0" htmlFor="email">
                              {
                                lang("Usermanagement.edituser.labels.company")
                              }{" "}
                              <sup className="text-danger">*</sup>
                            </label>
                            <div className="w-100">
                              <input
                                className="form-control"
                                type="company"
                                name="company"
                                placeholder={
                                  lang("Usermanagement.edituser.labels.company")
                                }
                                value={company}
                                onChange={(e) => handleChange(e)}
                              />
                              <span className="text-danger d-block">
                                {errors.company}{" "}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex align-items-center mb-md-4 mb-3">
                            <label className="mb-0" htmlFor="email">
                              {
                                lang("Usermanagement.edituser.labels.status")
                              }{" "}
                              <sup className="text-danger">*</sup>
                            </label>
                            <div class="custom-control custom-switch light w-100">
                              <input
                                type="checkbox"
                                class="custom-control-input"
                                id="checkbox1"
                                onChange={() => setStatus(!status)}
                                checked={status ? status : false}
                              />
                              <label
                                class="custom-control-label"
                                for="checkbox1"
                              ></label>
                            </div>
                          </div>

                          {mobile && mobile != "" ? (
                            <div className="form-group d-flex align-items-center mb-md-4 mb-3">
                              <label className="mb-0" htmlFor="email">
                                {
                                  lang("Usermanagement.edituser.labels.phoneNumber")
                                }{" "}
                                <sup className="text-danger">*</sup>
                              </label>
                              <div className="w-100">
                                <PhoneInput
                                  className="form-control w-100"
                                  name="phone"
                                  country={"in"}
                                  masks={""}
                                  countryCodeEditable={false}
                                  value={mobile}
                                  onChange={handleOnChanges}
                                />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-5">
                  <div className="card profile-card">
                    <h6 className="d-flex align-items-center title mb-4">
                      <i className="bx bx-user mr-1" />
                      Personal Info
                    </h6>
                    <div className="form-group d-flex align-items-center mb-md-4 mb-3 user-details">
                      <label className="mb-0" htmlFor="BirthDate">
                        {lang("Usermanagement.edituser.labels.birthdate")}
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
                    <div className="d-flex align-items-center mb-md-4 mb-3 user-details">
                      <label className="mb-0" htmlFor="WebSite">
                        {lang("Usermanagement.edituser.labels.website")}
                      </label>
                      <div className="w-100">
                        <input
                          type="text"
                          className="form-control"
                          id="website"
                          name="website"
                          placeholder={
                            lang("Usermanagement.edituser.labels.website")}
                          value={website}
                          onChange={(e) => handleChange(e)}
                        />
                        <span className="text-danger d-block">
                          {errors.website}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-md-4 mb-3 user-details">
                      <label className="mb-0" htmlFor="Gender">
                        {lang("Usermanagement.edituser.labels.gender")}
                      </label>
                      <select
                        className="form-control selectpicker"
                        id="gender"
                        name="gender"
                        value={gender}
                        onChange={(e) => handleChange(e)}
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                      </select>
                    </div>
                    <div className="d-flex align-items-center user-details mb-md-5 mb-3">
                      <label className="mb-0" htmlFor="Address">
                        {lang("Usermanagement.edituser.labels.address")}
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
                        {lang("Usermanagement.edituser.labels.company")}
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
              </div>
            </form>
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
const mapStateToProps = (state) => ({
  language: state.admin.language,
  UserId: state.admin.edituserId,
  UserAccess: {edit:true,delete:true,create:true,viewDetails:true}
  // state.admin.adminData.staticRolePermission.userAccess,
});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, { callApi })(UserProfile);
