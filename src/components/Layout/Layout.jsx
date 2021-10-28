import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Header from "./Header.jsx";
/******************* 
@Purpose : Used for default view design
@Parameter : props
@Author : INIC
******************/
function Layout(props) {
  let Theme = props.theme && props.theme.data;
  let resize = props.resize && props.resize.data;
  let sidebar = props.sidebar && props.sidebar.data;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [Theme, resize, sidebar]);

  return (
    <div className="container-scroller">
      <Header />
      <div className="container-fluid page-body-wrapper">
        <div className="main-panel">
          <div className="content-wrapper">{props.children}</div>
        </div>
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
export default connect(mapStateToProps, null)(withRouter(Layout));
