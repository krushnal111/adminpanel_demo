import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { callApi } from "../../api"; // Used for api call
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import API from "../../api/Routes";
import CropImages from "../../components/CropImages/CropImages";
import { ADMIN_URL, IMG_URL } from "../../config";
import "react-datepicker/dist/react-datepicker.css";
import Layout from "../../components/Layout/Layout";
import moment from "moment";
/******************* 
@Purpose : Used for view user details
@Parameter : props
@Author : INIC
******************/
function ViewuserDetails(props) {
  const [lang] = useTranslation("language");
  const [photo, setPhoto] = useState("");
  const [birthday, setBirthday] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
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
  const [status, setStatus] = useState(true);
  const [, setUserId] = useState("");
  let {
    firstname,
    lastname,
    email,
    website,
    mobile,
    gender,
    address,
    country,
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
  @Purpose : Used for get users all details
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
          firstname: firstname,
          lastname: lastname,
          emailId: emailid,
          mobile: mobileNo,
          photo: userPhoto,
          dob,
          gender: genders,
          website: webSite,
          address: userAddress,
          country: userCountry,
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
        firstname: firstname,
        lastname: lastname,
        email: emailid,
        gender: genders,
        website: webSite,
        mobile: mobileNo,
        address: userAddress,
        country: userCountry,
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
      setPhoto(userPhoto);
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
  @Purpose : Used for get image preview
  @Parameter : image
  @Author : INIC
  ******************/
  const getpreview = (image) => {
    setPhoto(image);
  };

  let imagePreview = null;
  if (photo) {
    imagePreview = <img src={photo ? ADMIN_URL+IMG_URL + photo : ""} alt="Icon" />;
  } else {
    imagePreview = <img src={"/assets/images/no-user.png"} alt="Icon" />;
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
                      {
                        lang("Usermanagement.edituser.labels.userprofile")}
                    </li>
                    <li className="breadcrumb-item">
                      <Link onClick={() => props.history.push("/dashboard")}>
                        <i className="bx bx-home-alt" />
                      </Link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      <Link
                        onClick={() => props.history.push("/usermanagement")}
                      >
                        users
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {lang("Usermanagement.edituser.labels.userprofile")}
                    </li>
                  </ol>
                </nav>
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
                            <label className="mb-0" htmlFor="firstname">
                              {lang("Usermanagement.edituser.labels.firsname")}
                              <sup className="text-danger">*</sup>
                            </label>
                            <div className="w-100 text-readonly">
                              <span>{firstname}</span>
                            </div>
                          </div>

                          <div className="form-group d-flex align-items-center mb-md-4 mb-3">
                            <label className="mb-0" htmlFor="lastname">
                              {lang("Usermanagement.edituser.labels.lastname")}
                              <sup className="text-danger">*</sup>
                            </label>
                            <div className="w-100 text-readonly">
                              {lastname}
                            </div>
                          </div>
                        </div>
                        <div className="user-title-info user-details">
                          <div className="form-group d-flex align-items-center mb-md-4 mb-3">
                            <label className="mb-0" htmlFor="email">
                              {lang("Usermanagement.edituser.labels.email")}
                              <sup className="text-danger">*</sup>
                            </label>
                            <div className="w-100 text-readonly">{email}</div>
                          </div>
                          <div className="d-flex align-items-center mb-md-4 mb-3">
                            <label className="mb-0" htmlFor="email">
                              {lang("Usermanagement.edituser.labels.status")}
                              <sup className="text-danger">*</sup>
                            </label>
                            <div class="custom-control custom-switch light w-100">
                              <input
                                type="checkbox"
                                class="custom-control-input"
                                id="checkbox1"
                                disabled
                                onChange={() => setStatus(!status)}
                                checked={status ? status : false}
                              />
                              <label
                                class="custom-control-label"
                                for="checkbox1"
                              ></label>
                            </div>
                          </div>

                          {mobile && mobile !== "" ? (
                            <div className="form-group d-flex align-items-center mb-md-4 mb-3">
                              <label className="mb-0" htmlFor="email">
                                { lang("Usermanagement.edituser.labels.phoneNumber")}
                                <sup className="text-danger">*</sup>
                              </label>
                              <div className="w-100 text-readonly">
                                {mobile}
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

                    {birthday && (
                      <div className="form-group d-flex align-items-center mb-md-4 mb-3 user-details">
                        <label className="mb-0" htmlFor="BirthDate">
                          { lang("Usermanagement.edituser.labels.birthdate ")}
                        </label>
                        <fieldset className="position-relative w-100 text-readonly">
                          {moment(birthday).format("MMMM Do YYYY")}
                          <span className="text-danger d-block">
                            {errors.birthday}
                          </span>
                        </fieldset>
                      </div>
                    )}

                    <div className="d-flex align-items-center mb-md-4 mb-3 user-details">
                      <label className="mb-0" htmlFor="WebSite">
                        {lang("Usermanagement.edituser.labels.website")}
                      </label>
                      <div className="w-100 text-readonly">
                        {website}
                        <span className="text-danger d-block">
                          {errors.website}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-md-4 mb-3 user-details">
                      <label className="mb-0" htmlFor="Gender">
                        {lang("Usermanagement.edituser.labels.gender")}
                      </label>
                      <div className="w-100 text-readonly">{gender}</div>
                    </div>
                    <div className="d-flex align-items-center user-details mb-md-5 mb-3">
                      <label className="mb-0" htmlFor="Address">
                        {lang("Usermanagement.edituser.labels.address")}
                      </label>
                      <div className="w-100 text-readonly">
                        {address}
                        <span className="text-danger d-block">
                          {errors.address}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center user-details mb-md-5 mb-3">
                      <label className="mb-0" htmlFor="Country">
                        Country{" "}
                      </label>
                      {country}
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

  UserAccess: {edit:true,delete:true,create:true,viewDetails:true,viewList:true}
  //  state.admin.adminData.staticRolePermission.userAccess,
});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, { callApi })(ViewuserDetails);
