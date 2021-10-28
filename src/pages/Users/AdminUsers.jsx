import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { connect } from "react-redux";
import "antd/dist/antd.css";
import { Select } from "antd";
import "rc-pagination/assets/index.css";
import Pagination from "rc-pagination";
import { editUser } from "../../store/Actions";
import { callApi } from "../../api"; // Used for api call
import swal from "sweetalert";
import _ from "lodash";
import { Link } from "react-router-dom";
import $ from "jquery";
import Loader from "../../components/Loader/Loader";
import "react-datepicker/dist/react-datepicker.css";
import { useSorting } from "../../hooks";
import API from "../../api/Routes";
import moment from "moment";
import { showMessageNotification } from "./../../utils/Functions"; //Utility functions
import { ADMIN_URL } from "../../config";
$.DataTable = require("datatables.net");
require("datatables.net-responsive");
var { Option } = Select;
/******************* 
@Purpose : Used for admin users page
@Parameter : props
@Author : INIC
******************/
function AdminUsers(props) {
  const [columnSettingsArr, setColumnSettingsArr] = useState([]);
  const [columnSettings, setColumnSettings] = useState({
    photo: true,
    firstName: true,
    lastName: true,
    emailId: true,
    mobile: true,
    emailVerificationStatus: true,
    status: true,
  });
  const [usersList, setUsersList] = useState([]);
  const [pagesize, setPagesize] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [length, setLength] = useState(1);
  const [loading, setLoading] = useState(true);
  const [multipleDelete, setMultipleDelete] = useState([]);
  const [selectAll] = useState(false);
  const [, setGetFilterValues] = useState([]);
  const [addedFilter, setaddedFilter] = useState([]);
  const [searchFilter, setSearchAddedfilter] = useState([]);
  const [, setUserAccess] = useState({});
  const [, setSavedTemp] = useState([]);
  const [, setLatestColumnsArr] = useState([]);
  const [, setFilterObj] = useState([
    {
      key: "",
      type: "",
      input: "",
      value: { startDate: "", endDate: "" },
      condition: "$and",
    },
  ]);
  const [, setCondition] = useState("$and");
  const [, setUserStatus] = useState("");
  const [val, setVal] = useState(false);
  const [sortData, sort, onSort] = useSorting();
  const [, SetFiltercolor] = useState("green");
  const [searchText, setSearchText] = useState("");
  const [allChecked, setAllChecked] = useState(false);
  const [loadingcheckbox, setLoadingcheckbox] = useState(false);
  const [, openFilterpopup] = useState(false);
  const [togglestatus, setTogglestatus] = useState(false);
  const [isCheckBoxSelected, setIsCheckBoxSelected] = useState([]);
  const [showEditOption, setShowEditOption] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [showAddOption, setShowAddOption] = useState(false);

  useEffect(() => {
    if (props.UserAccess && !_.isEmpty(props.UserAccess)) {
      let { UserAccess } = props;
      setShowAddOption(UserAccess.create);
      setShowEditOption(UserAccess.edit);
      setShowDeleteOption(UserAccess.delete);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (
        props.UserAccess &&
        !_.isEmpty(props.UserAccess) &&
        (await props.UserAccess.viewList) === false
      ) {
        props.history.push("/dashboard");
      } else {
        await setUserAccess(props.UserAccess ? props.UserAccess : {});
      }
      await getAllUsers();
      let settings = columnSettings;
      _.map(settings, (val, column) => {
        let columnSetting = _.find(columnSettingsArr, (setting) => {
          return _.isEqual(setting.key, column);
        });
        settings[column] = columnSetting ? columnSetting.status : val;
        setColumnSettings({ ...settings });
      });
      $(".filterlink").click(function () {
        $("#itemlist").hide();
        $("#filterlist").stop().slideToggle();
      });
      $(".listlink").click(function () {
        $("#filterlist").hide();
        $("#itemlist").stop().slideToggle();
      });
    })();
  }, [page, pagesize, sort]);

  useEffect(() => {
    selectAllcheck();
    checkArray();
  }, [multipleDelete, val, selectAll]);

  /******************* 
  @Purpose : Used for get all users list
  @Parameter : filterObj
  @Author : INIC
  ******************/
  const getAllUsers = async (filterObj) => {
    var body = { page, pagesize, sort, filter: filterObj ? filterObj : "" };
    const response = await props.callApi(
      API.ADMIN_LIST,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      var result = response.data.listing.map(function (el) {
        var o = Object.assign({}, el);
        o.isChecked = false;
        return o;
      });
      setUsersList(result);
      setColumnSettingsArr(response.data.columnSettings);
      setSavedTemp(response.data.templateSettings);
      setLatestColumnsArr(response.data.latestColumns);
      setGetFilterValues(response.data.filterSettings);
      setTotal(response.total);
      setLength(response.data.listing.length);
      setLoading(false);
    }
  };
  /******************* 
  @Purpose : Used for pagination
  @Parameter : page, pagesize
  @Author : INIC
  ******************/
  const paginationChange = (page, pagesize) => {
    setPage(page);
    setPagesize(pagesize);
  };
  /******************* 
  @Purpose : Used for user state change
  @Parameter : status, userId
  @Author : INIC
  ******************/
  const userStatusChange = async (status, userId) => {
    var body = { userIds: [userId], status };
    const response = await props.callApi(
      API.ADMIN_STATUS,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      showMessageNotification("Status updated successfully", "success")
    }
  };
  /******************* 
  @Purpose : Used for multiple user delete
  @Parameter : uid
  @Author : INIC
  ******************/
  const deleteMultipleUsers = async (uid) => {
    let data = usersList.filter((rec) => rec.isChecked == true);
    let result = data.map(({ _id }) => _id);
    if (result.length > 0) {
      swal({
        title: "Are you sure,You Want To Delete ?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          if (result.length > 0) {
            var body = { userIds: result };
          } else {
            body = { userIds: result };
          }
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
            setPage(1);
            setPagesize(10);
            getAllUsers();
          }
        }
      });
    }
  };
  /******************* 
  @Purpose : Used for user delete
  @Parameter : uid
  @Author : INIC
  ******************/
  const deleteUser = (uid) => {
    swal({
      title: "Are you sure,You Want To Delete ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        var body = { userIds: [uid] };
        const response = await props.callApi(
          API.DELETE_ADMIN,
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
  @Purpose : Used for handle multiple checkbox
  @Parameter : {}
  @Author : INIC
  ******************/
  const selectAllcheck = () => {
    var delarray = multipleDelete;
    onCheckbox();
    if (selectAll === true) {
      usersList.forEach((each) => {
        if (!delarray.includes(each._id)) {
          delarray.push(each._id);
        }
      });
    } else {
      usersList.forEach((each) => {
        delarray.splice(delarray.indexOf(each._id), 1);
      });
    }
    setMultipleDelete(delarray);
  };
  /******************* 
  @Purpose : Used for check array
  @Parameter : _id
  @Author : INIC
  ******************/
  const checkArray = (_id) => {
    if (selectAll === true && multipleDelete.includes(_id)) {
      setVal(true);
      return true;
    } else if (multipleDelete.includes(_id)) {
      return true;
    } else {
      return false;
    }
  };
  /******************* 
  @Purpose : Used for handle checkbox
  @Parameter : _id
  @Author : INIC
  ******************/
  const onCheckbox = (_id) => {
    var delarray = multipleDelete;
    if (!delarray.includes(_id)) {
      delarray.push(_id);
    } else {
      delarray.splice(delarray.indexOf(_id), 1);
    }

    if (delarray.length !== usersList.length) {
      setVal(false);
    }
  };
  /******************* 
  @Purpose : Used for status change
  @Parameter : {}
  @Author : INIC
  ******************/
  const applyBulkActions = async () => {
    let data = usersList.filter((rec) => rec.isChecked);
    let delArr = data.map(({ _id }) => _id);
    if (delArr.length > 0) {
      delArr = _.compact(delArr);
      data.forEach((item) => (item.status = !item.status));
      setAllChecked(false);
      showMessageNotification("Status updated successfully", "success")
      let newList = usersList.map((item) => ({ ...item, isChecked: false }));
      setUsersList(newList);
      setIsCheckBoxSelected([]);
    } else {
      showMessageNotification("Please select records to change status", "error")
    }
  };
  /******************* 
  @Purpose : Used for reset filter value
  @Parameter : {}
  @Author : INIC
  ******************/
  const resetFilter = async () => {
    setCondition("$and");
    SetFiltercolor("green");
    openFilterpopup(false);
    var body = { page, pagesize, columnKey: "userListing" };
    const response = await props.callApi(
      API.USERS_LIST,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      setUsersList(response.data.listing);
      setGetFilterValues(response.data.filterSettings);
      setColumnSettingsArr(response.data.columnSettings);
      setTotal(response.total);
      setLength(response.data.listing.length);
      setLoading(false);
      setFilterObj([
        {
          key: "",
          type: "",
          input: "",
          value: { startDate: "", endDate: "" },
          condition: "$and",
        },
      ]);
    }
    setaddedFilter("");
    setSearchAddedfilter([]);
  };
  /******************* 
  @Purpose : Used for status toggle handle
  @Parameter : {}
  @Author : INIC
  ******************/
  const toggleStatusHandler = () => {
    setTogglestatus(!togglestatus);
    applyBulkActions();
  };
  /******************* 
  @Purpose : Used for search action
  @Parameter : {}
  @Author : INIC
  ******************/
  const searchField = async () => {
    const body = {
      searchText: searchText && searchText.length > 1 ? searchText : "",
      page,
      pagesize,
    };
    const response = await props.callApi(
      API.ADMIN_LIST,
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
      setSavedTemp(response.data.templateSettings);
      setLatestColumnsArr(response.data.latestColumns);
      setGetFilterValues(response.data.filterSettings);
      setTotal(response.total);
      setLength(response.data.listing.length);
      setLoading(false);
    }
  };
  /******************* 
  @Purpose : Used for clear form field data
  @Parameter : {}
  @Author : INIC
  ******************/
  const clearInput = () => {
    setSearchText("");
    getAllUsers();
  };
  /******************* 
  @Purpose : Used for change checkbox value
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
      list.find((item) => item.emailId === e.target.name).isChecked =
        e.target.checked;
    }
    setUsersList(list);
    setAllChecked(checkedALL);
    setIsCheckBoxSelected(usersList.filter((el) => el.isChecked === true));
    setTimeout(function () {
      setLoadingcheckbox(!loadingcheckbox);
    }, 100);
  };

  const numbers = [2, 5, 10, 15, 25, 50, 100, 200, 500].filter(
    (number) => number < total
  );

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block overflow-auto">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="content-header-title">Admin Users</li>
                <li class="breadcrumb-item">
                  <Link onClick={() => props.history.push("/dashboard")}>
                    <i class="bx bx-home-alt"></i>
                  </Link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  Admin Users
                </li>
              </ol>
            </nav>

            <div class="content-area position-relative">
              <div class="grid">
                <div class="grid-content">
                  <div class="user-listing-filterOptions mb-2 d-block">
                    <div class="row mb-2">
                      <div class="col-sm-8 position-static">
                        <div class="left-buttons d-flex ">
                          <label>
                            <div className="search position-relative has-icon-left">
                              <input
                                type="search"
                                className="form-control text-capitalize"
                                placeholder="search"
                                value={searchText}
                                onChange={(evt) => {
                                  searchField();
                                  setSearchText(evt.target.value);
                                }}
                              />
                              {searchText && searchText.length > 0 ? (
                                <div className="clear">
                                  <span onClick={clearInput}>
                                    <em className="bx bx-x"></em>
                                  </span>
                                </div>
                              ) : null}
                              <div className="form-control-position">
                                <em className="bx bx-search"></em>
                              </div>
                            </div>
                          </label>
                          {isCheckBoxSelected.length > 0 ? (
                            <div className="position-relative d-flex flex-wrap">
                              <button
                                onClick={() => deleteMultipleUsers()}
                                type="button"
                                class="btn btn-default delete-btn minW-0 btn-bg-white"
                              >
                                <i class="bx bx-trash-alt"></i>
                              </button>
                              <div className="custom-checkbox mx-1">
                                <label>
                                  <input
                                    type="checkbox"
                                    onChange={() => {
                                      toggleStatusHandler();
                                    }}
                                    id="allStatus"
                                    checked={
                                      togglestatus ? togglestatus : false
                                    }
                                  />
                                  <span className="switch">
                                    <i class="bx bx-toggle-left"></i>
                                  </span>
                                </label>
                              </div>
                            </div>
                          ) : null}
                          <div className="filter-label">
                            {addedFilter.description ? (
                              <div className="multiple-filter">
                                <label className="mb-0">
                                  {addedFilter.description}
                                </label>
                                <label
                                  className="remove-label mb-0"
                                  onClick={resetFilter}
                                >
                                  <em className="bx bx-x"></em>
                                </label>
                              </div>
                            ) : null}
                          </div>

                          <div className="search-label">
                            {searchFilter && searchFilter.length > 0 ? (
                              <div className="multiple-text">
                                {searchFilter &&
                                  searchFilter.length > 0 &&
                                  searchFilter.map((filter, i) => {
                                    return (
                                      <div className="text-label mr-1">
                                        {filter.type == "date" &&
                                        filter.value &&
                                        filter.value.startDate ? (
                                          <label className="mb-0">
                                            {filter.key}{" "}
                                            <span className="text-success">
                                              is added from Date
                                            </span>{" "}
                                            {filter.value.startDate &&
                                            filter.value &&
                                            filter.value.startDate
                                              ? moment(
                                                  filter.value.startDate
                                                ).format("L")
                                              : null}{" "}
                                            TO Date{" "}
                                            {filter.value.startDate &&
                                            filter.value &&
                                            filter.value.endDate
                                              ? moment(
                                                  filter.value.endDate
                                                ).format("L")
                                              : null}{" "}
                                          </label>
                                        ) : (
                                          <label className="mb-0">
                                            {filter.key}{" "}
                                            <span className="text-success">
                                              contains
                                            </span>{" "}
                                            {filter.value}{" "}
                                          </label>
                                        )}
                                      </div>
                                    );
                                  })}
                                <label
                                  className="remove-label"
                                  onClick={resetFilter}
                                >
                                  <em className="bx bx-x"></em>
                                </label>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      {loading ? <Loader /> : null}

                      <div class="col-sm-4">
                        <div class="right-buttons d-flex justify-content-end">
                          {showAddOption && (
                            <button
                              id="addNewUser"
                              type="button"
                              class="btn glow-primary btn-primary mr-0 minW-md-0"
                            >
                              <i class="bx bx-user-plus d-lg-none"></i>
                              <span
                                class="d-none d-sm-none d-lg-inline-block"
                                onClick={() => props.history.push("/adduser")}
                              >
                                Add New User
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <table
              class="table row-border nowrap common-datatable"
              id="user-listing"
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
                  <th onClick={() => onSort("firstName")}>
                    <b>First Name</b>{" "}
                    <i
                      aria-hidden="true"
                      className={
                        sortData["firstName"]
                          ? "bx bxs-chevron-up"
                          : "bx bxs-chevron-down"
                      }
                    ></i>
                  </th>
                  <th onClick={() => onSort("lastName")}>
                    <b>Last Name</b>{" "}
                    <i
                      aria-hidden="true"
                      className={
                        sortData["lastName"]
                          ? "bx bxs-chevron-up"
                          : "bx bxs-chevron-down"
                      }
                    ></i>
                  </th>
                  <th onClick={() => onSort("emailId")}>
                    <b>Email</b>
                    <i
                      aria-hidden="true"
                      className={
                        sortData["emailId"]
                          ? "bx bxs-chevron-up"
                          : "bx bxs-chevron-down"
                      }
                    ></i>
                  </th>
                  <th>
                    <b>Role</b>
                    <i aria-hidden="true"></i>
                  </th>
                  <th>
                    <span>
                      <b>Status</b>
                    </span>
                  </th>
                  <th class="all">
                    <span>
                      <b>Action</b>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersList && usersList.length === 0 ? (
                  <tr className="text-center text-danger not-found-txt">
                    <td colSpan="6">
                      {!loading ? (
                        <h6
                          className="text-center text-danger not-found-txt"
                          colSpan="6"
                        >
                          No Records Found!
                        </h6>
                      ) : null}
                    </td>
                  </tr>
                ) : (
                  usersList &&
                  Array.isArray(usersList) &&
                  usersList.map((user, key) => {
                    return (
                      <tr>
                        <td>
                          <div className="custom-checkbox">
                            <label>
                              <input
                                key={user._id}
                                type="checkbox"
                                name={user.emailId}
                                value={user.emailId}
                                checked={user.isChecked}
                                onChange={handleChangeCheckbox2}
                              />
                              <span />
                            </label>
                          </div>
                        </td>
                        <td>{user.firstname}</td>
                        <td>{user.lastname}</td>

                        <td>
                          <div class="eamil-col d-flex align-items-center">
                            <div class="badge-outer circle round d-flex align-items-center mr-2">
                              {user.status ? (
                                <span class="badge badge-success circle">
                                  {" "}
                                </span>
                              ) : (
                                <span class="badge badge-danger circle"> </span>
                              )}
                            </div>
                            <span>{user.emailId}</span>
                          </div>
                        </td>
                        <td>{user.staticRole ? user.staticRole.role : null}</td>
                        <td>
                          <div class="custom-control custom-switch light">
                            <input
                              type="checkbox"
                              class="custom-control-input"
                              onChange={() => {
                                user.status = !user.status;
                                setUserStatus({ usersList });
                                userStatusChange(user.status, user._id);
                              }}
                              id={user._id}
                              checked={user.status ? user.status : false}
                            />
                            <label
                              class="custom-control-label"
                              for={user._id}
                            ></label>
                          </div>
                        </td>
                        <td>
                          <div class="d-flex">
                            {showEditOption && (
                              <a
                                onClick={() =>
                                  props.history.push(
                                    `/editAdminUser/${user._id}`
                                  )
                                }
                              >
                                <i className="bx bx-edit mr-3"></i>
                              </a>
                            )}

                            {showDeleteOption && (
                              <a onClick={() => deleteUser(user._id)}>
                                <i className="bx bx-trash-alt" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            {usersList && usersList.length === 0 ? (
              <div> </div>
            ) : (
              <div className="table-footer mt-2 mt-sm-3 d-flex align-items-center justify-content-between">
                <div>
                  <label className="mr-2">Showing</label>
                  <Select
                    placeholder={<b>10 Items Per Page</b>}
                    optionFilterProp="children"
                    value={length}
                    onChange={(value) => setPagesize(value)}
                  >
                    {numbers.map((number) => (
                      <Option value={number} key={number}>
                        {number}
                      </Option>
                    ))}
                  </Select>
                  <label className="ml-2">Out of {total} Users</label>
                </div>
                <div className="pagination-list mt-2 mt-sm-3">
                  <Pagination
                    className="ant-pagination"
                    pageSize={pagesize}
                    current={page}
                    total={total}
                    onChange={paginationChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <footer>
          <div className="footer-text d-flex align-items-centerf justify-content-between">
            <span className="d-block">2020 © IndiaNIC</span>
          </div>
        </footer>
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
  UserAccess: {edit:true,delete:true,create:true,viewDetails:true,viewList:true}
    // state.admin.adminData &&
    // state.admin.adminData.staticRolePermission &&
    // state.admin.adminData.staticRolePermission.userAccess,
});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, { callApi, editUser })(AdminUsers);
