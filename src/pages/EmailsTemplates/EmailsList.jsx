import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link, withRouter } from "react-router-dom";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import swal from "sweetalert";
import {  editEmail } from "../../store/Actions";
import { callApi } from "../../api"; // Used for api call
import "antd/dist/antd.css";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Loader/Loader";
import { useSorting } from "../../hooks";
import { getItem, showMessageNotification } from "./../../utils/Functions"; // Utility functions
import "react-datepicker/dist/react-datepicker.css";
import API from "../../api/Routes";
import moment from "moment";
import "moment-timezone";
import _ from "lodash";
import $ from "jquery";
import { ADMIN_URL } from "../../config";
$.DataTable = require("datatables.net");
require("datatables.net-responsive");
/******************* 
@Purpose : Used for email tamplet list
@Parameter : props
@Author : INIC
******************/
function EmailsList(props) {
  const [columnSettingsArr, setColumnSettingsArr] = useState([]);
  const [lang] = useTranslation("language");
  const [columnSettings, setColumnSettings] = useState({
    templateTitle: true,
    emailKey: true,
    subject: true,
    status: true,
  });
  const [usersList, setUsersList] = useState([]);
  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [total, setTotal] = useState(1);
  const [, setLength] = useState(1);
  const [loading, setLoading] = useState(true);
  const [multipleDelete] = useState([]);
  const [, setGetFilterValues] = useState([]);
  const [condition] = useState("");
  const [, sort] = useSorting();
  const [allChecked, setAllChecked] = useState(false);
  const [loadingcheckbox, setLoadingcheckbox] = useState(false);
  const [searchText, setSearchtext] = useState("");
  const [dateFormatUI, setDateFormatUI] = useState("");
  const [timeFormatUI, setTimeFormatUI] = useState("");
  const [timeZoneUI, setTimeZoneUI] = useState("");
  const [showEditOption, setShowEditOption] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [showAddOption, setShowAddOption] = useState(false);

  useEffect(() => {
    (async () => {
        let body = {
          loginId: getItem("accessToken"),
        };

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
          let { dateFormat, timeFormat, timeZone } = response.data;
          setDateFormatUI(dateFormat);
          setTimeFormatUI(timeFormat);
          setTimeZoneUI(timeZone);
        }
    })();
  }, []);

  useEffect(() => {
    if (props.EmailTemplateAccess && !_.isEmpty(props.EmailTemplateAccess)) {
      let { EmailTemplateAccess } = props;
      setShowEditOption(EmailTemplateAccess.edit);
      setShowDeleteOption(EmailTemplateAccess.delete);
      setShowAddOption(EmailTemplateAccess.create);
    }
    if(props.adminData || props.editAdminProfileData) {
      let adminProfile = props.editAdminProfileData ? props.editAdminProfileData : props.adminData
      let { dateFormat, timeFormat, timeZone } = adminProfile;
      console.log(dateFormat,timeFormat,timeZone)
      if(dateFormat) setDateFormatUI(dateFormat);
      if(timeFormat) setTimeFormatUI(timeFormat);
      if(timeZone) setTimeZoneUI(timeZone);
    }
    getAllUsers();
    let settings = columnSettings;
    _.map(settings, (val, column) => {
      let columnSetting = _.find(columnSettingsArr, (setting) => {
        return _.isEqual(setting.key, column);
      });
      settings[column] = columnSetting ? columnSetting.status : val;
    });
    setColumnSettings(settings);
  }, [page, pagesize]);

  /******************* 
  @Purpose : Used for get all users list
  @Parameter : filterObj
  @Author : INIC
  ******************/
  const getAllUsers = async (filterObj) => {
    var body = {
      page,
      pagesize,
      sort,
      columnKey: "emailListing",
      filter: filterObj ? filterObj : "",
      condition: condition,
    };
    try {
      const response = await props.callApi(
        API.EMAIL_LIST,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        var results = response.data.listing.map(function (el) {
          var o = Object.assign({}, el);
          o.isChecked = false;
          return o;
        });
        setUsersList(results);
        setColumnSettingsArr(response.data.columnSettings);
        setGetFilterValues(response.data.filterSettings);
        setTotal(response.total);
        setLength(response.data.listing.length);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  /******************* 
  @Purpose : Used for clear input
  @Parameter : {}
  @Author : INIC
  ******************/
  const clearInput = () => {
    setSearchtext("");
    getAllUsers();
  };
  /******************* 
  @Purpose : Used for delete users
  @Parameter : uid
  @Author : INIC
  ******************/
  const deleteUser = async (uid) => {
    var delArr = multipleDelete;
    swal({
      title: "Are you sure,You Want To Delete ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        if (delArr.length > 0) {
          var body = { ids: delArr };
        } else {
          body = { ids: [uid] };
        }
        const response = await props.callApi(
          API.DELETE_EMAIL,
          body,
          "post",
          null,
          true,
          false,
          ADMIN_URL
        );
        if (response.status === 1) {
          showMessageNotification("Deleted successfully", "success")
          getAllUsers();
        }
      }
    });
  };
  /******************* 
  @Purpose : Used for search data
  @Parameter : keyword
  @Author : INIC
  ******************/
  const searchField = async (keyword) => {
    var body = {
      page: page,
      pagesize: pagesize,
      searchText: keyword,
      columnKey: "emailListing",
    };
    const response = await props.callApi(
      API.EMAIL_LIST,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      setUsersList(response.data.listing);
      setColumnSettingsArr(response.data.columnSettings);
      setGetFilterValues(response.data.filterSettings);
      setTotal(response.total);
      setLength(response.data.listing.length);
      setLoading(false);
    }
  };
  /******************* 
  @Purpose : Used for change pagination
  @Parameter : pageNo, pageSize
  @Author : INIC
  ******************/
  const paginationChange = (pageNo, pageSize) => {
    setPage(pageNo);
    setPagesize(pageSize);
  };
  /******************* 
  @Purpose : Used for change checkbox
  @Parameter : e
  @Author : INIC
  ******************/
  const handleChangeCheckbox2 = (e) => {
    let list = usersList;
    let checkedALL = allChecked;
    if (e.target.value === "checkAll") {
      list.forEach((item) => {
        item.isChecked = e.target.checked;
        checkedALL = e.target.checked;
      });
    } else {
      list.find((item) => item.emailTitle === e.target.name).isChecked =
        e.target.checked;
    }
    setUsersList(list);
    setAllChecked(checkedALL);
    setTimeout(function () {
      setLoadingcheckbox(!loadingcheckbox);
    }, 100);
  };
  /******************* 
  @Purpose : Used for delete templet
  @Parameter : uid
  @Author : INIC
  ******************/
  const deleteTemplates = async (uid) => {
    let list = usersList.filter((rec) => rec.isChecked == true);
    let results = list.map(({ _id }) => _id);
    if (results.length > 0) {
      swal({
        title: "Are you sure,You Want To Delete ?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          if (results.length > 0) {
            var body = { ids: results };
          } else {
            body = { ids: results };
          }
          const response = await props.callApi(
            API.DELETE_EMAIL,
            body,
            "post",
            null,
            true,
            false,
            ADMIN_URL
          );
          if (response.status === 1) {
            showMessageNotification("Deleted successfully", "success")
            setPage(1);
            setPagesize(10);
            getAllUsers();
          }
        }
      });
    }
  };
  /******************* 
  @Purpose : Used for  Date Time TimeZone Conversion based on setting in General Settings
  @Parameter : uid
  @Author : INIC
  ******************/
  const getDateTimeFormat = (inputDatetime) => {
    // let timeZone = timeZoneUI.split('(').pop().split(')')[0].trim()
    // let isNegative = timeZone.trim().startsWith("-");
    // let timeArr = timeZone.substring(1).split(':');
    // let minutes = ( parseInt(timeArr[0]) * 60 ) + parseInt(timeArr[1]);
    // let newInputDateTime = isNegative ? inputDatetime - ( minutes * 60000) : inputDatetime + ( minutes * 60000 )
    let mergedDate;
    let timeZone = timeZoneUI.split(" ")[1];
    if (timeFormatUI === "24 Hours") {
      mergedDate = moment(inputDatetime)
        .tz(`${timeZone}`)
        .format(`${dateFormatUI} HH:mm `);
    } else {
      mergedDate = moment(inputDatetime)
        .tz(`${timeZone}`)
        .format(`${dateFormatUI} h:mm A `);
    }
    return mergedDate;
  };
  var { emailKey, subject } = columnSettings;
  let data = usersList.filter((rec) => rec.isChecked == true);
  let result = data.map(({ _id }) => _id);
  return (
    <Layout>
      <div className="dashboard-container">
        {loadingcheckbox ? <div></div> : null}
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="content-header-title">
                  {lang("EmailList.emailTemplates")}
                </li>
                <li className="breadcrumb-item">
                  <Link
                    onClick={() => {
                      props.history.push("/dashboard");
                    }}
                  >
                    <i className="bx bx-home-alt" />
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {lang("EmailList.emailTemplates")}
                </li>
              </ol>
            </nav>
            <div className="content-area position-relative">
              <div className="grid">
                <div className="grid-content">
                  <div className="email-notification-listing-filterOptions mb-2">
                    <div className="mb-2">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="left-buttons d-flex align-items-center">
                          <label className="mr-0 mr-sm-2 mb-0">
                            <div class="search position-relative has-icon-left">
                              <input
                                type="search"
                                value={searchText}
                                class="form-control text-capitalize"
                                placeholder="Search"
                                aria-controls="user-listing"
                                onChange={(evt) => {
                                  searchField(evt.target.value);
                                  setSearchtext(evt.target.value);
                                }}
                              />
                              {searchText && searchText.length > 0 ? (
                                <div className="clear">
                                  <span
                                    onClick={clearInput}
                                    className="d-block"
                                  >
                                    <em className="bx bx-x"></em>
                                  </span>
                                </div>
                              ) : null}

                              <div className="form-control-position">
                                <em className="bx bx-search"></em>
                              </div>
                            </div>
                          </label>

                          {result.length > 0 ? (
                            <button
                              onClick={() => deleteTemplates()}
                              type="button"
                              class="btn btn-default delete-btn minW-0 btn-bg-white"
                            >
                              <i class="bx bx-trash-alt"></i>
                            </button>
                          ) : null}
                        </div>

                        {showAddOption ? (
                          <div className="right-buttons">
                            <Link
                              onClick={() => {
                                props.history.push("/addemailtemplate");
                                localStorage.removeItem("EmailTemplatesId");
                              }}
                              id="addNewTemplate"
                              type="button"
                              className="btn glow-primary btn-primary minW-0 mr-0"
                            >
                              <i className="bx bx-user-plus d-lg-none" />
                              <span className="d-none d-sm-none d-lg-inline-block">
                                Add New Template
                              </span>
                            </Link>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table
                      className="table row-border nowrap common-datatable mb-0"
                      id="email-notification-listing"
                    >
                      <thead>
                        <tr>
                          <th className="checkbox-table">
                            <div className="custom-checkbox">
                              <label>
                                <input
                                  type="checkbox"
                                  value="checkAll"
                                  checked={allChecked}
                                  onChange={handleChangeCheckbox2}
                                />
                                <span></span>
                              </label>
                            </div>
                          </th>
                          <th className="all">
                            <b>{lang("EmailList.templateTitle")}</b>
                          </th>
                          <th>
                            <b>{lang("EmailList.subject")}</b>
                          </th>
                          <th>
                            <b>{lang("EmailList.createdBy")}</b>
                          </th>
                          <th>
                            <b>{lang("EmailList.dateTime")}</b>
                          </th>
                          <th className="all">
                            <b>{lang("EmailList.action")}</b>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList && usersList.length === 0 ? (
                          <tr className="text-center text-danger not-found-txt">
                            <td colSpan="6">
                              {loading ? <Loader /> : null}

                              {!loading ? (
                                <h6
                                  className="text-center text-danger not-found-txt"
                                  colSpan="6"
                                >
                                  {lang("EmailList.noRecord")}
                                </h6>
                              ) : null}
                            </td>
                          </tr>
                        ) : (
                          usersList &&
                          Array.isArray(usersList) &&
                          usersList.map((user, key) => {
                            return (
                              <tr key={key}>
                                <td>
                                  <div className="custom-checkbox">
                                    <label>
                                      <input
                                        key={user._id}
                                        type="checkbox"
                                        name={user.emailTitle}
                                        value={user.emailTitle}
                                        checked={user.isChecked}
                                        onChange={handleChangeCheckbox2}
                                      />
                                      <span />
                                    </label>
                                  </div>
                                </td>
                                <td>
                                  <span>
                                    {" "}
                                    {emailKey ? user.emailTitle : null}
                                  </span>
                                </td>
                                <td>
                                  <span> {subject ? user.subject : null}</span>
                                </td>
                                <td>
                                  <span>
                                    {user.createdBy
                                      ? user.createdBy
                                      : "Lorem lipsum"}
                                  </span>
                                </td>
                                <td>
                                  <span className="dob-date d-block">
                                    {user.createdAt
                                      ? getDateTimeFormat(parseInt(user.createdAt)).split(
                                          " "
                                        )[0]
                                      : null}
                                  </span>
                                  <span className="d-block time">
                                    {user.createdAt
                                      ? `${
                                          getDateTimeFormat(
                                            parseInt(user.createdAt)
                                          ).split(" ")[1]
                                        } ${
                                          getDateTimeFormat(
                                            parseInt(user.createdAt)
                                          ).split(" ")[2]
                                        }`
                                      : null}
                                  </span>
                                </td>
                                <td>
                                  <div className="d-flex">
                                    {showEditOption ? (
                                      <Link
                                        className="cursor-pointer mr-3"
                                        onClick={() => {
                                          props.history.push(
                                            "/editemailtemplate"
                                          );
                                          localStorage.setItem(
                                            "EmailTemplatesId",
                                            user._id
                                          );
                                        }}
                                      >
                                        <i className="bx bx-edit" />
                                      </Link>
                                    ) : null}
                                    {showDeleteOption ? (
                                      <Link
                                        className="cursor-pointer"
                                        onClick={() => deleteUser(user._id)}
                                      >
                                        <i className="bx bx-trash-alt" />
                                      </Link>
                                    ) : null}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3">
                    <Pagination
                      pageSize={pagesize}
                      current={page}
                      total={total}
                      onChange={paginationChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer>
            <div className="footer-text d-flex align-items-centerf justify-content-between">
              <span className="d-block">2020 © IndiaNIC</span>
              <span className="d-flex align-items-center">
                Crafted with{" "}
                <i className="bx bxs-heart text-danger ml-1 mr-1" /> in INDIA{" "}
              </span>
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
  EmailTemplateAccess:
    // state.admin.adminData.staticRolePermission.emailTemplateAccess,
    {edit:true,delete:true,create:true},
  language: state.admin.language,
  adminData: state.admin.adminData,
  editAdminProfileData:state.admin.editAdminProfileData
});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default withRouter(
  connect(mapStateToProps, { callApi, editEmail })(EmailsList)
);
