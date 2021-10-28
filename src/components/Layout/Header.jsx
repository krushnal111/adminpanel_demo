import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, withRouter } from "react-router-dom";
import { IMG_URL } from "../../config"; // Default configuration
import { Dropdown, Tooltip, OverlayTrigger, Modal } from "react-bootstrap"; // Bootstrap design
import errorMessages from "../../utils/ErrorMessages";
import { connect } from "react-redux";
import {
  setItem,
  validatePassword,
  showMessageNotification,
} from "../../utils/Functions"; // utility function
import _ from "lodash";
import API from "../../api/Routes";
import {
  changeLanguage,
  changeTheme,
  changeResize,
  sidebaropen,
  useWindowSize,
} from "../../store/Actions"; // Commun function
import { callApi } from "../../api"; // Used for api call
import {ADMIN_URL,AUTH_URL} from "../../config"

/******************* 
@Purpose : Used for header view
@Parameter : props
@Author : INIC
******************/
function Header(props) {
  const [userPhoto, setUserPhoto] = useState("");
  const [userName, setUserName] = useState("");
  const [toggleSettings, setTogglesettings] = useState(false);
  const [checked, setChecked] = useState(props.theme && props.theme.data);
  const [resizechecked, setResizeChecked] = useState(
    props.resize && props.resize.data
  );
  const [openSideBar, setOpenSideBar] = useState(
    props.sidebar && props.sidebar.data
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  let [changeLoading, setChangeLoading] = useState(false);
  let [changeErrors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordUIFlag, setPasswordUIFlag] = useState(false);
  const [hiddenNewPassword, setHiddenNewPassword] = useState(true);
  const [hiddenConfirmPassword, setHiddenConfirmPassword] = useState(true);
  let [, setIsFormValid] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [trans, i18n] = useTranslation("language");
  const [feviconImg, setFeviconImg] = useState([]);

  const size = useWindowSize();
  const url = props.match.path;

  useEffect(() => {
    GetGlobalSettings();
    setFavIcon()
  }, []);


  

  useEffect(() => {
    if (url === "/profile") {
      setShowEditProfile(false);
    } else {
      setShowEditProfile(true);
    }
    i18n.changeLanguage(props.language);
  }, []);

  useEffect(() => {
    if (props.admindata && !_.isEmpty(props.admindata)) {
      if (props.editadminprofile && Object.keys(props.editadminprofile).length > 0) {
        let { firstname, lastname, photo } = props.editadminprofile;
        setUserName(firstname + " " + lastname);
        setUserPhoto(photo);
      } else {
        let {
          firstname,
          lastname,
          photo,
          theme,
          menuAlignment,
        } = props.admindata;
        if (theme === "Dark") {
          document.body.classList.add("dark");
          document.body.classList.remove("light");
        } else {
          document.body.classList.add("light");
          document.body.classList.remove("dark");
        }
        if (menuAlignment == "vertical") {
          setResizeChecked(true);
          props.changeResize(true);
          document.body.classList.add("vertical");
          document.body.classList.remove("horizontal");
        } else {
          setResizeChecked(false);
          props.changeResize(false);
          document.body.classList.add("horizontal");
          document.body.classList.remove("vertical");
        }
        setUserName(firstname + " " + lastname);
        setUserPhoto(photo);
      }
    }
  }, []);

  useEffect(() => {
    if (props.theme && props.theme.data === true) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    // if (props.resize && props.resize.data === true) {
    //   document.body.classList.add("vertical");
    //   document.body.classList.remove("horizontal");
    // } else {
    //   document.body.classList.add("horizontal");
    //   document.body.classList.remove("vertical");
    // }
  }, []);

  useEffect(() => {
    if (size.width <= 1440) {
      setResizeChecked(false);
      document.body.classList.remove("vertical");
      props.changeResize(false);
    }
  }, [size.width <= 1440]);

  useEffect(() => {
    if (props.admindata && !_.isEmpty(props.admindata)) {
      let { firstname, lastname, photo } = props.admindata;
      if (props.editadminprofile && !_.isEmpty(props.editadminprofile)) {
        let {
          firstname: firstName,
          lastname: lastName,
          photo: uPhoto,
        } = props.editadminprofile;
        setUserName(firstName + " " + lastName);
        setUserPhoto(uPhoto);
      } else {
        setUserName(firstname + " " + lastname);
        setUserPhoto(photo);
      }
    }
  }, [props.admindata, props.editadminprofile]);

  /******************* 
  @Purpose : Used for password validate
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateFormForPassword = () => {
    let passwordError = { newPassword: "", confirmPassword: "" };
    let isFormValid = true;

    //for new password
    if (!newPassword.trim()) {
      setPasswordUIFlag(true);
      passwordError.newPassword = errorMessages.PROVIDE_PASSWORD;
    } else if (!validatePassword(newPassword)) {
      setPasswordUIFlag(false);
      passwordError.newPassword = errorMessages.PROVIDE_VALID_PASSWORD;
    } else passwordError.newPassword = "";

    //for confirm password
    if (!confirmPassword.trim()) {
      setPasswordUIFlag(true);
      passwordError.confirmPassword = errorMessages.PROVIDE_PASSWORD;
    } else if (!validatePassword(confirmPassword)) {
      setPasswordUIFlag(true);
      passwordError.confirmPassword = errorMessages.PROVIDE_VALID_PASSWORD;
    } else passwordError.confirmPassword = "";

    if (
      passwordError.newPassword !== "" ||
      passwordError.confirmPassword !== ""
    )
      isFormValid = false;

    setErrors(passwordError);
    setIsFormValid(isFormValid);
    return isFormValid;
  };
  /******************* 
  @Purpose : Used for reset password 
  @Parameter : event
  @Author : INIC
  ******************/
  const resetPassword = async (event) => {
    event.preventDefault();
    var body = {
      oldPassword: newPassword,
      newPassword: confirmPassword,
    };
    try {
      if (validateFormForPassword()) {
        setChangeLoading(true);
        const response = await props.callApi(
          API.CHANGE_PASSWORD,
          body,
          "post",
          "",
          true,
          false,
          ADMIN_URL
        );
        setChangeLoading(false);
        if (response.status === 1) {
          showMessageNotification(response.message, "success");
          setItem("accessToken", "");
          props.history.push("/");
        }
      }
    } catch (error) {
      setChangeLoading(false);
      throw error;
    }
  };


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
        siteFavicon,
      } = response.data;

      
      setFeviconImg(siteFavicon);
      setFavIcon(siteFavicon);
    }
  };

  const getFavEl = () => {
    return document.getElementById("favicon");
}

const setFavIcon = (img = "") => {
    const favicon = getFavEl(); // Accessing favicon element
    if(favicon && feviconImg) {
      favicon.href = ADMIN_URL+IMG_URL + img;
    }
    
}


  /******************* 
  @Purpose : Used for password modal open
  @Parameter : 
  @Author : INIC
  ******************/
  const openPasswordModal = () => {
    setShowPassword(true);
    setConfirmPassword("");
    setNewPassword("");
  };
  /******************* 
  @Purpose : Used for password modal close
  @Parameter : 
  @Author : INIC
  ******************/
  const closePasswordModal = () => {
    setShowPassword(false);
    setConfirmPassword("");
    setNewPassword("");
    setErrors("");
  };
  /******************* 
  @Purpose : Used for tooltip view
  @Parameter : propsConfirmPassword
  @Author : INIC
  ******************/
  const renderTooltip = (propsConfirmPassword) =>
    !hiddenConfirmPassword ? (
      <Tooltip id="button-tooltip" {...propsConfirmPassword}>
        Hide Password
      </Tooltip>
    ) : (
      <Tooltip id="button-tooltip" {...propsConfirmPassword}>
        Show Password
      </Tooltip>
    );
  /******************* 
  @Purpose : Used for tooltip view
  @Parameter : propsNewPassword
  @Author : INIC
  ******************/
  const renderTooltip1 = (propsNewPassword) =>
    !hiddenNewPassword ? (
      <Tooltip id="button-tooltip" {...propsNewPassword}>
        Hide Password
      </Tooltip>
    ) : (
      <Tooltip id="button-tooltip" {...propsNewPassword}>
        Show Password
      </Tooltip>
    );
  /******************* 
  @Purpose : Used for outer click
  @Parameter : callback
  @Author : INIC
  ******************/
  function useOuterClick(callback) {
    const innerSettingsRef = useRef();
    const callbackRef = useRef();
    useEffect(() => {
      callbackRef.current = callback;
    });

    useEffect(() => {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);

      function handleClick(e) {
        if (
          innerSettingsRef.current &&
          callbackRef.current &&
          !innerSettingsRef.current.contains(e.target)
        ) {
          callbackRef.current(e);
        }
      }
    }, []);

    return innerSettingsRef;
  }
  /******************* 
  @Purpose : Used for outer click setting
  @Parameter : {}
  @Author : INIC
  ******************/
  const settingsRef = useOuterClick(() => {
    setTogglesettings(false);
  });
  /******************* 
  @Purpose : Used for sidebar open
  @Parameter : {}
  @Author : INIC
  ******************/
  const SidebarOpen = () => {
    document.body.classList.add("sidebar-open");
    setOpenSideBar(!openSideBar);
    props.sidebaropen(!openSideBar);
  };




  /******************* 
  @Purpose : Used for edit theme or meny alignment
  @Parameter : e
  @Author : INIC
  ******************/
  const editconf = async (key,value) => {
    let body = {}
    body[key] = value;
      const response = await props.callApi(
        API.UPDATE_PROFILE,
        body,
        "post",
        "EDITADMIN_PROFILE",
        true,
        false,
        ADMIN_URL
      );
  };


  /******************* 
  @Purpose : Used for theme change
  @Parameter : {}
  @Author : INIC
  ******************/
  const handleCheckClick = () => {
    setChecked(!checked);
    if (!checked) {
      editconf("theme","Dark");
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      editconf("theme","Light");
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
    props.changeTheme(!checked);
  };
  /******************* 
  @Purpose : Used for screen resize
  @Parameter : {}
  @Author : INIC
  ******************/
  const handleCheckResize = () => {
    setResizeChecked(!resizechecked);
    if (!resizechecked) {
      editconf("menuAlignment","vertical")
      document.body.classList.add("vertical");
      document.body.classList.remove("horizontal");
    } else {
      editconf("menuAlignment","horizontal")
      document.body.classList.add("horizontal");
      document.body.classList.remove("vertical");
    }
    props.changeResize(!resizechecked);
  };
  /******************* 
  @Purpose : Used for change langauge
  @Parameter : event
  @Author : INIC
  ******************/
  const handleLanguage = (event) => {
    let language = event.target.value;
    const data = {
      language: language,
    };
    props.changeLanguage(data);
    i18n.changeLanguage(language);
  };
  /******************* 
  @Purpose : Used for user logout
  @Parameter : {}
  @Author : INIC
  ******************/
  const logout = () => {
    settings();
    props.callApi("/logout",{role:"admin"}, "post", "LOGOUT", true,false,AUTH_URL);
    setItem("accessToken", "");
    localStorage.clear();
    showMessageNotification("Logged Out Successfully", "success");
    props.history.push("/");
  };
  /******************* 
  @Purpose : Used for change theme settings
  @Parameter : {}
  @Author : INIC
  ******************/
  const settings = async () => {
    // let body = {
    //   theme: checked ? "Dark" : "Light",
    //   menuAlignment: resizechecked ? "Horizontal" : "Vertical",
    // };
    // await props.callApi(API.SETTINGS, body, "post", "", true,false,ADMIN_URL);
  };

  let imagePreview = null;
  if (userPhoto) {
    imagePreview = (
      <img
        class="round"
        src={ADMIN_URL+ IMG_URL + userPhoto}
        alt="/assets/images/user.png"
        height="40"
        width="40"
      />
    );
  } else {
    imagePreview = (
      <img
        class="round"
        src={"/assets/images/avatar-s-16.jpg"}
        alt="avatar"
        height="40"
        width="40"
      />
    );
  }
  return (
    <div ref={settingsRef} id="container1" className="App">
      <div className="main-content-area">
        <header>
          <div className="navigation-bar">
            <nav className="navbar d-flex navbar-expand bd-navbar fixed-top">
              <div className="mr-auto float-left bookmark-wrapper d-flex align-items-center">
                <ul className="nav navbar-nav">
                  <li className="nav-item mobile-menu">
                    <Link
                      onClick={() => {
                        SidebarOpen();
                      }}
                      className="nav-link nav-menu-main menu-toggle hidden-xs"
                    >
                      <i className="bx bx-menu"></i>
                    </Link>
                  </li>
                </ul>
                <ul className="horizontal-brand nav navbar-nav">
                  <li>
                    <Link to="">
                      <img
                        className="img-fluid"
                        src="assets/images/brand-logo.svg"
                        alt="branding logo"
                      />
                    </Link>
                  </li>
                </ul>
              </div>
              <ul className="navbar-nav flex-row ml-md-auto d-md-flex">
                <li className="nav-item dropdown dropdown-language"></li>
                <li className="nav-item nav-search">
                  <div className="search-input">
                    <div className="search-box">
                      <div className="search-input-icon">
                        <i className="bx bx-search primary"></i>
                      </div>
                      <input
                        className="input"
                        type="text"
                        placeholder="Explore Search..."
                        tabindex="-1"
                        data-search="template-search"
                      />
                      <div className="search-input-close">
                        <i className="bx bx-x"></i>
                      </div>
                    </div>
                    <ul className="search-list">
                      <li className="auto-suggestion align-items-center justify-content-between cursor-pointer current_item">
                        <Link className="align-items-center justify-content-between w-100">
                          <div className="justify-content-start">
                            <span className="mr-75 bx bx-error-circle"></span>
                            <span>No results found.</span>
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
               
                <div className="language-dropdown">
                  <select
                    className="custom-select border-0"
                    onChange={handleLanguage}
                    value={props.language}
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="gr">German</option>
                    <option value="po">Portuguese</option>
                  </select>
                </div>
                
                <li className="nav-item user-dropdown dropdown">
                  <Dropdown className="custome-dropdown">
                    <Dropdown.Toggle
                      id="dropdown-basic1"
                      className="custome-btn"
                    >
                      <Link
                        className="nav-link dropdown-toggle dropdown-user-link"
                        to="#"
                        id="userDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-expanded="true"
                      >
                        <div className="user-nav d-sm-flex d-none">
                          <span className="user-name text-capitalize">
                            {userName}
                          </span>
                        </div>
                        <span>{imagePreview}</span>
                      </Link>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {showEditProfile && (
                        <Dropdown.Item
                          onClick={() => props.history.push("/profile")}
                        >
                          <i className="bx bx-user mr-2"></i>Edit Profile
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item onClick={openPasswordModal}>
                        <i className="bx bx-reset mr-2"></i>Change Password
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => logout()}>
                        <i className="bx bx-log-out mr-2"></i>Log out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
                <li className="nav-item theme-setting-block-nav-link">
                  <Link
                    onClick={() => setTogglesettings(!toggleSettings)}
                    class="theme-setting-link on click"
                  >
                    <i class="bx bx-cog bx-flip-horizontal bx-spin"></i>
                  </Link>
                  <div
                    class={
                      toggleSettings
                        ? "theme-setting-block open"
                        : "theme-setting-block "
                    }
                  >
                    <div class="d-flex align-items-center">
                      <span class="light-icon icon mr-1 d-block">
                        <em class="bx bx-sun"></em>
                      </span>
                      <div class="custom-control custom-switch theme-switch">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleCheckClick()}
                          class="custom-control-input"
                          id="customSwitchTheme"
                        />
                        <label
                          class="custom-control-label"
                          for="customSwitchTheme"
                        ></label>
                      </div>
                      <span class="dark-icon icon">
                        <em class="bx bxs-sun"></em>
                      </span>
                    </div>
                    <div className="d-flex align-items-center verticle-btn">
                      <span className="vertical-icon icon mr-1 d-block">
                        <em className="bx bx-grid-vertical"></em>
                      </span>
                      <div className="custom-control custom-switch sidebar-switch">
                        <input
                          type="checkbox"
                          checked={resizechecked}
                          onChange={() => handleCheckResize()}
                          class="custom-control-input"
                          id="sidebarSwitchBtn"
                        />
                        <label
                          className="custom-control-label"
                          for="sidebarSwitchBtn"
                        ></label>
                      </div>
                      <span className="horizontal-icon icon">
                        <em className="bx bx-grid-horizontal"></em>
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            <Modal show={showPassword} onHide={closePasswordModal}>
              <Modal.Header closeButton>
                <div class="d-flex align-items-center">
                  <div class="icon mr-2">
                    <span class="bx bxs-plus-circle"></span>
                  </div>
                  <h5 class="modal-title" id="exampleModalLongTitle">
                    Change Password
                  </h5>
                </div>
              </Modal.Header>
              <Modal.Body closeButton>
                <div class="notification-form password-modal">
                  <div class="row">
                    <div class="col-md-12">
                      <div className="form-group d-flex align-items-center mb-md-4 mb-3">
                        <label className="label xl-label">Old Password</label>
                        <div className="w-100 position-relative">
                          <input
                            className="form-control"
                            type={hiddenNewPassword ? "password" : "text"}
                            placeholder="Old password"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              changeErrors = Object.assign(changeErrors, {
                                newPassword: "",
                              });
                              setErrors(changeErrors);
                            }}
                          />
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip1}
                          >
                            <span
                              onClick={() =>
                                setHiddenNewPassword(!hiddenNewPassword)
                              }
                              toggle="#password-field"
                              className={
                                hiddenNewPassword
                                  ? "bx bx-hide field-icon-profile toggle-password"
                                  : "bx bx-show field-icon-profile toggle-password"
                              }
                            ></span>
                          </OverlayTrigger>
                        </div>
                      </div>
                      <div
                        className={
                          passwordUIFlag
                            ? "class1 error-message-password d-flex align-items-center justify-content-end"
                            : "class2 error-message-password d-flex align-items-center justify-content-end"
                        }
                      >
                        <div
                          className="error-msg d-block mb-2"
                          style={{ color: "red" }}
                        >
                          {changeErrors.newPassword}
                        </div>
                      </div>
                      <div className="form-group d-flex align-items-center mb-md-4 mb-3 position-relative">
                        <label className="label xl-label">New Password</label>
                        <div className="w-100 position-relative">
                          <input
                            className="form-control"
                            type={hiddenConfirmPassword ? "password" : "text"}
                            placeholder="New password"
                            id="confirmpassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              changeErrors = Object.assign(changeErrors, {
                                confirmPassword: "",
                              });
                              setErrors(changeErrors);
                            }}
                          />
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}
                          >
                            <span
                              onClick={() =>
                                setHiddenConfirmPassword(!hiddenConfirmPassword)
                              }
                              toggle="#password-field"
                              className={
                                hiddenConfirmPassword
                                  ? "bx bx-hide field-icon-profile toggle-password"
                                  : "bx bx-show field-icon-profile toggle-password"
                              }
                            ></span>
                          </OverlayTrigger>
                          <em className="fa fa-lock" aria-hidden="true" />
                        </div>
                      </div>
                      <div
                        className={
                          passwordUIFlag
                            ? "class1 error-message-password d-flex align-items-center justify-content-end"
                            : "class2 error-message-password d-flex align-items-center justify-content-end"
                        }
                      >
                        <div
                          className="error-msg d-block mb-2"
                          style={{ color: "red" }}
                        >
                          {changeErrors.confirmPassword}
                        </div>
                      </div>
                      <div className="mt-5 text-center">
                        <button
                          className="btn btn-primary mr-2"
                          type="submit"
                          onClick={(e) => resetPassword(e)}
                        >
                          {" "}
                          {changeLoading ? "Loading..." : "Change Password "}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </header>
      </div>
    </div>
  );
}
/******************* 
@Purpose : Used for get data from redux
@Parameter : state
@Author : INIC
******************/
const mapStateToProps = (state) => ({
  language: state.admin.language,
  theme: state.admin.theme,
  resize: state.admin.resize,
  sidebar: state.admin.sidebar,
  admindata: state.admin.adminData,
  editadminprofile: state.admin.editAdminProfileData,
});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, {
  changeTheme,
  changeLanguage,
  changeResize,
  callApi,
  sidebaropen,
})(withRouter(Header));
