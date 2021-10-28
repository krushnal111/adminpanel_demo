import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link, withRouter } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { sidebaropen } from "../../store/Actions"; // Commun function
import { callApi } from "../../api"; // Used for api call
import * as _ from "lodash";
/******************* 
@Purpose : Used for sidebar view
@Parameter : props
@Author : INIC
******************/
function Sidebar(props) {
  const [, setUserName] = useState("");
  const [, setPhoto] = useState("");
  const [, setAdminUserAccess] = useState({});
  const [, setCmsPagesAccess] = useState({});
  const [, setEmailSettingsAccess] = useState({});
  const [, setEmailTemplateAccess] = useState({});
  const [, setRolesAccess] = useState({});
  const [, setUserAccess] = useState({});
  const [lang] = useTranslation("language");
  const [usermenu, openUsermenu] = useState(false);
  const [settingsmenu, openSettingsmenu] = useState(false);
  const [contentmenu, openContentmenu] = useState(false);
  const [blogsmenu, openBlogsmenu] = useState(false);
  const [, openSocialmediamenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showContentMenu, setShowContentMenu] = useState(false);
  const [showEmailTempMenu, setShowEmailTempMenu] = useState(false);
  const path = props.location.pathname;
  const innerRef = useOuterClick();
  useEffect(() => {
    if (props.rolePermissions && !_.isEmpty(props.rolePermissions)) {
      let {
        adminUserAccess,
        cmsPagesAccess,
        emailSettingsAccess,
        emailTemplateAccess,
        rolesAccess,
        userAccess,
      } = props.rolePermissions;
      setShowUserMenu(userAccess.read);
      setShowContentMenu(cmsPagesAccess.read);
      setShowEmailTempMenu(emailTemplateAccess.read);
      setAdminUserAccess(adminUserAccess);
      setCmsPagesAccess(cmsPagesAccess);
      setEmailSettingsAccess(emailSettingsAccess);
      setEmailTemplateAccess(emailTemplateAccess);
      setRolesAccess(rolesAccess);
      setUserAccess(userAccess);
    }
    if (props.admindata && !_.isEmpty(props.admindata)) {
      let { firstname, lastname, photo } = props.admindata;
      setUserName(firstname + " " + lastname);
      setPhoto(photo);
    }
  }, [props]);

  function useOuterClick(callback) {
    const outerRef = useRef();
    const callbackRef = useRef();

    useEffect(() => {
      callbackRef.current = callback;
    });

    useEffect(() => {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
      function handleClick(e) {
        if (
          outerRef.current &&
          callbackRef.current &&
          !outerRef.current.contains(e.target)
        ) {
          callbackRef.current(e);
        }
      }
    }, []);
    return outerRef;
  }

  /******************* 
  @Purpose : Used for sidebar open
  @Parameter : {}
  @Author : INIC
  ******************/
  const SidebarOpen = () => {
    document.body.classList.remove("sidebar-open");
  };
  /******************* 
  @Purpose : Used for change routes
  @Parameter : e, page
  @Author : INIC
  ******************/
  const changeRoute = (e, page) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (
      page === "/dashboard" ||
      page === "/rolesList" ||
      page === "/master" ||
      page === "/emailTemplates"
    ) {
      openUsermenu(false);
      openContentmenu(false);
      openSettingsmenu(false);
    }

    if (page === "/faq") {
      openBlogsmenu(false);
    }
    document.body.classList.remove("sidebar-open");
    return props.history.push(page);
  };
  /******************* 
  @Purpose : Used for blog handle
  @Parameter : e
  @Author : INIC
  ******************/
  const blogs = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    openContentmenu(true);
    openBlogsmenu(!blogsmenu);
  };
  /******************* 
  @Purpose : Used for user menu handle
  @Parameter : {}
  @Author : INIC
  ******************/
  const user = () => {
    openUsermenu(!usermenu);
    openContentmenu(false);
    openSettingsmenu(false);
    openBlogsmenu(false);
  };
  /******************* 
  @Purpose : Used for content handle
  @Parameter : {}
  @Author : INIC
  ******************/
  const content = () => {
    openContentmenu(!contentmenu);
    openUsermenu(false);
    openSettingsmenu(false);
    if (!contentmenu) {
      openBlogsmenu(false);
    }
  };
  /******************* 
  @Purpose : Used for settings handle
  @Parameter : {}
  @Author : INIC
  ******************/
  const settings = () => {
    openSettingsmenu(!settingsmenu);
    openContentmenu(false);
    openUsermenu(false);
    openBlogsmenu(false);
    if (!settingsmenu) {
      openSocialmediamenu(false);
    }
  };
  /******************* 
  @Purpose : Used for settings handle
  @Parameter : {}
  @Author : INIC
  ******************/
  const getActiveLinkClass = (activePath, type) => {
    // used for active route class on path
    if (type === "base-path") {
      if (path === activePath) {
        return "menu-link active-link";
      }
      return "menu-link";
    }
    // used for active user route class
    if (type === "user-parent") {
      if (activePath === "showUserMenu" && usermenu) {
        return "menu-list-item has-child-submenu level1 submenu-open";
      }
      return "menu-list-item has-child-submenu level1";
    }

    if (type === "user-child") {
      if (activePath === "showUserMenu" && usermenu) {
        return "sidebar-menu-list sub-menu-list show";
      }
      return "sidebar-menu-list sub-menu-list";
    }
    // used for active content route class
    if (type === "content-parent") {
      if (activePath === "contentmenu" && contentmenu) {
        return "menu-list-item has-child-submenu level1 submenu-open";
      }
      return "menu-list-item has-child-submenu level1";
    }

    if (type === "content-child") {
      if (activePath === "contentmenu" && contentmenu) {
        return "sidebar-menu-list sub-menu-list show";
      }
      return "sidebar-menu-list sub-menu-list";
    }
    // used for active blog route class
    if (type === "blogs-parent") {
      if (activePath === "blogsmenu" && blogsmenu) {
        return "menu-list-item has-child-submenu level1 submenu-open";
      }
      return "menu-list-item has-child-submenu level1";
    }
    // setting for active content route class
    if (type === "settings-parent") {
      if (activePath === "settingsmenu" && settingsmenu) {
        return "menu-list-item has-child-submenu level1 submenu-open";
      }
      return "menu-list-item has-child-submenu level1";
    }

  };
  let isLogined = localStorage.getItem("accessToken");
  return (
    <div>
      {isLogined && (
        <div ref={innerRef} id="container" className="App">
          <header className="App-header"></header>
          <aside className="sidebar">
            <div className="sidebar-inner-wrapper">
              <div className="sidebar-heading">
                <div className="d-flex align-items-end justify-content-between w-100">
                  <Link className="navbar-brand">
                    <div className="brand-logo">
                      <img
                        className="img-fluid"
                        src="assets/images/brand-logo.svg"
                        alt="branding logo"
                      />
                    </div>
                  </Link>
                  <span onClick={SidebarOpen} className="sidebar-close">
                    <em className="bx bx-x"></em>
                  </span>
                </div>
              </div>
              <PerfectScrollbar>
                <div className="sidebar-menu">
                  <ul className="sidebar-menu-list">
                    <li className="menu-list-item">
                      <a
                        className={getActiveLinkClass(
                          "/dashboard",
                          "base-path"
                        )}
                        onClick={(e) => {
                          changeRoute(e, "/dashboard");
                        }}
                      >
                        <i className="bx bx-home-alt" />
                        <span className="menu-title">
                          {lang("CustomLabels.dashboard")}
                        </span>
                      </a>
                    </li>
                
                      <li
                        onClick={() => {
                          user();
                        }}
                        className={getActiveLinkClass(
                          "showUserMenu",
                          "user-parent"
                        )}
                      >
                        <a className="menu-link">
                          <i className="bx bxs-user" />
                          <span className="menu-title">
                            {lang("CustomLabels.users")}
                          </span>
                          <i className="bx bxs-chevron-right" />
                        </a>

                        <ul
                          className={getActiveLinkClass(
                            "showUserMenu",
                            "user-child"
                          )}
                          style={
                            usermenu
                              ? { display: "block" }
                              : { display: "none" }
                          }
                        >
                          <li className="menu-list-item">
                            <a
                              onClickCapture={(evt) =>
                                changeRoute(evt, "/usermanagement")
                              }
                              className={getActiveLinkClass(
                                "/usermanagement",
                                "base-path"
                              )}
                            >
                              <i className="bx bxs-right-arrow-alt" />
                              <span className="menu-title">
                                {lang("CustomLabels.users")}
                              </span>
                            </a>
                          </li>
                          <li className="menu-list-item">
                            <a
                              onClickCapture={(evt) =>
                                changeRoute(evt, "/adminusers")
                              }
                              className={getActiveLinkClass(
                                "/adminusers",
                                "base-path"
                              )}
                            >
                              <i className="bx bxs-right-arrow-alt" />
                              <span className="menu-title">
                                {lang("CustomLabels.adminuser")}
                              </span>
                            </a>
                          </li>
                        </ul>
                      </li>
            

                      <li
                        onClick={() => content()}
                        className={getActiveLinkClass(
                          "contentmenu",
                          "content-parent"
                        )}
                      >
                        <a className="menu-link">
                          <i className="bx bx-link-alt" />
                          <span className="menu-title">
                            {lang("CustomLabels.content")}
                          </span>
                          <i className="bx bxs-chevron-right" />
                        </a>

                        <ul
                          onClick={() => {
                            content();
                          }}
                          className={getActiveLinkClass(
                            "showUserMenu",
                            "content-child"
                          )}
                          style={
                            contentmenu
                              ? { display: "block" }
                              : { display: "none" }
                          }
                        >
                          <li className="menu-list-item">
                            <a
                              onClick={(evt) => {
                                changeRoute(evt, "/staticPage");
                              }}
                              className={getActiveLinkClass(
                                "/staticPage",
                                "base-path"
                              )}
                            >
                              <i className="bx bxs-right-arrow-alt" />
                              <span className="menu-title">
                                {lang("CustomLabels.staticpages")}
                              </span>
                            </a>
                          </li>
                          <li
                            onClick={(e) => blogs(e)}
                            className={getActiveLinkClass(
                              "blogsmenu",
                              "blogs-parent"
                            )}
                          >
                            <a className="menu-link">
                              <i className="bx bxs-right-arrow-alt" />
                              <span className="menu-title">Blogs</span>
                              <i className="bx bxs-chevron-right" />
                            </a>
                            <ul
                              style={
                                blogsmenu
                                  ? { display: "block" }
                                  : { display: "none" }
                              }
                              className="sidebar-menu-list sub-menu-list"
                            >
                              <li className="menu-list-item level3">
                                <a
                                  onClick={(evt) => {
                                    changeRoute(evt, "/blogListing");
                                  }}
                                  className={getActiveLinkClass(
                                    "/blogListing",
                                    "base-path"
                                  )}
                                >
                                  <i className="bx bxs-right-arrow-alt" />
                                  <span className="menu-title">Blogs</span>
                                </a>
                              </li>
                              <li className="menu-list-item level3">
                                <a
                                  onClick={(evt) => {
                                    changeRoute(evt, "/blogCategory");
                                  }}
                                  className={getActiveLinkClass(
                                    "/blogCategory",
                                    "base-path"
                                  )}
                                >
                                  <i className="bx bxs-right-arrow-alt" />
                                  <span className="menu-title">
                                    {lang("CustomLabels.blogs")}
                                  </span>
                                </a>
                              </li>
                            </ul>
                          </li>
                          <li className="menu-list-item">
                            <a
                              onClick={(evt) => {
                                changeRoute(evt, "/faq");
                              }}
                              className={getActiveLinkClass(
                                "/faq",
                                "base-path"
                              )}
                            >
                              <i className="bx bxs-right-arrow-alt" />
                              <span className="menu-title">
                                {lang("CustomLabels.faq")}
                              </span>
                            </a>
                          </li>
                        </ul>
                      </li>


                      <li className="menu-list-item">
                        <a
                          onClick={(evt) => {
                            changeRoute(evt, "/emailTemplates");
                          }}
                          className={getActiveLinkClass(
                            "/emailTemplates",
                            "base-path"
                          )}
                        >
                          <i className="bx bx-notification" />
                          <span className="menu-title">
                            {lang("CustomLabels.emailTemplateslabel")}
                          </span>
                        </a>
                      </li>
                  
                    <li className="menu-list-item">
                      <a
                        onClick={(evt) => {
                          changeRoute(evt, "/master");
                        }}
                        className={getActiveLinkClass("/master", "base-path")}
                      >
                        <i className="bx bx-note" />
                        <span className="menu-title">
                          {lang("CustomLabels.master")}
                        </span>
                      </a>
                    </li>

                    <li className="menu-list-item">
                      <a
                        onClick={(evt) => {
                          changeRoute(evt, "/rolesList");
                        }}
                        className={getActiveLinkClass(
                          "/rolesList",
                          "base-path"
                        )}
                      >
                        <i className="bx bx-check-circle" />
                        <span className="menu-title">
                          {lang("CustomLabels.roles")}
                        </span>
                      </a>
                    </li>
                    
                    <li
                      onClick={() => {
                        settings();
                      }}
                      className={getActiveLinkClass(
                        "settingsmenu",
                        "settings-parent"
                      )}
                    >
                      <a className="menu-link">
                        <i className="bx bx-cog" />
                        <span className="menu-title">
                          {lang("CustomLabels.settings")}
                        </span>
                        <i className="bx bxs-chevron-right" />
                      </a>
                      <ul
                        className="sidebar-menu-list sub-menu-list"
                        style={
                          settingsmenu
                            ? { display: "block" }
                            : { display: "none" }
                        }
                      >
                        <li className="menu-list-item">
                          <a
                            onClick={(evt) =>
                              changeRoute(evt, "/generalSettings")
                            }
                            className={getActiveLinkClass(
                              "/generalSettings",
                              "base-path"
                            )}
                          >
                            <i className="bx bxs-right-arrow-alt" />
                            <span className="menu-title">
                              {lang("CustomLabels.generalsettings")}
                            </span>
                          </a>
                        </li>

                        <li className="menu-list-item level3">
                          <a
                            onClick={(evt) => changeRoute(evt, "/socialMedia")}
                            className={getActiveLinkClass(
                              "/socialMedia",
                              "base-path"
                            )}
                          >
                            <i className="bx bxs-right-arrow-alt" />
                            <span className="menu-title">
                              {lang("CustomLabels.socilamedia")}
                            </span>
                          </a>
                        </li>

                        <li className="menu-list-item">
                          <a
                            onClick={(evt) =>
                              changeRoute(evt, "/paymentGateway")
                            }
                            className={getActiveLinkClass(
                              "/paymentGateway",
                              "base-path"
                            )}
                          >
                            <i className="bx bxs-right-arrow-alt" />
                            <span className="menu-title">
                              {lang("CustomLabels.paymentGateway")}
                            </span>
                          </a>
                        </li>

                        <li className="menu-list-item">
                          <a
                            onClick={(evt) => changeRoute(evt, "/smtp")}
                            className={getActiveLinkClass("/smtp", "base-path")}
                          >
                            <i className="bx bxs-right-arrow-alt" />
                            <span className="menu-title">
                              {lang("CustomLabels.smtp")}
                            </span>
                          </a>
                        </li>
                        <li
                          onClick={(evt) => changeRoute(evt, "/emailSettings")}
                          className={getActiveLinkClass(
                            "/emailSettings",
                            "base-path"
                          )}
                        >
                          <a className="menu-link">
                            <i className="bx bxs-right-arrow-alt" />
                            <span className="menu-title">
                              {lang("CustomLabels.emailNotification")}
                            </span>
                          </a>
                        </li>

                      </ul>
                    </li>

                  </ul>
                </div>
              </PerfectScrollbar>
            </div>
          </aside>
        </div>
      )}
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
  admindata: state.admin.adminData,
  sidebar: state.admin.sidebar,
  editadminprofile: state.admin.editAdminProfileData,
  rolePermissions: state.admin.adminData.staticRolePermission,
});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, { callApi, sidebaropen })(
  withRouter(Sidebar)
);
