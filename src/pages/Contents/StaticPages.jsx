import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { callApi } from "../../api"; // Used for api call
import { Link } from "react-router-dom";
import { Select } from "antd";
import swal from "sweetalert";
import $ from "jquery";
import * as _ from "lodash";
import Loader from "../../components/Loader/Loader";
import { useSorting } from "../../hooks";
import moment from "moment";
import "moment-timezone";
import API from "../../api/Routes";
import Pagination from "rc-pagination";
import { showMessageNotification } from "./../../utils/Functions"; //Utility functions
import { ADMIN_URL } from "../../config";
$.DataTable = require("datatables.net");
require("datatables.net-responsive");
var { Option } = Select;

/******************* 
@Purpose : Used for static page data
@Parameter : props
@Author : INIC
******************/
function StaticPage(props) {
  const [lang] = useTranslation("language");
  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [total, setTotal] = useState(1);
  const [length, setLength] = useState(1);
  const [blogListing, setBlogListing] = useState([]);
  const [condition] = useState("");
  const [, setColumnSettingsArr] = useState([]);
  const [sortData, sort, onSort] = useSorting();
  const [, setGetFilterValues] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateFormatUI, setDateFormatUI] = useState("");
  const [timeFormatUI, setTimeFormatUI] = useState("");
  const [timeZoneUI, setTimeZoneUI] = useState("");
  const [allChecked, setAllChecked] = useState(false);
  const [isCheckBoxSelected, setIsCheckBoxSelected] = useState([]);
  const [allBlogStatus, setAllBlogStatus] = useState([]);
  const [toggleStatus, setToggleStatus] = useState(false);
  const [showEditOption, setShowEditOption] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [showAddOption, setShowAddOption] = useState(false);

  useEffect(() => {
    (async () => {
      let body = {
        loginId: localStorage.getItem("accessToken"),
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
    if (props.CmsPagesAccess && !_.isEmpty(props.CmsPagesAccess)) {
      let { CmsPagesAccess } = props;
      setShowEditOption(CmsPagesAccess.edit);
      setShowDeleteOption(CmsPagesAccess.delete);
      setShowAddOption(CmsPagesAccess.create);
    }
    getAllBlogs();
  }, [page, pagesize, sort]);

  /******************* 
  @Purpose : Used for get all blogs
  @Parameter : filterObj
  @Author : INIC
  ******************/
  const getAllBlogs = async (filterObj) => {
    let body = {
      page,
      pagesize,
      sort,
      columnKey: "blogListing",
      filter: filterObj ? filterObj : "",
      condition: condition,
    };
    try {
      const response = await props.callApi(
        API.CMS_LIST,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        setBlogListing(
          response.data.listing.map((item) => ({ ...item, isChecked: false }))
        );
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
  @Purpose : Used for Delete cms
  @Parameter : uid
  @Author : INIC
  ******************/
  const deleteCms = async (uid) => {
    swal({
      title: "Are you sure,You Want To Delete ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        var body = { ids: [uid] };
        const response = await props.callApi(
          API.CMS_DELETE,
          body,
          "post",
          null,
          true,
          false,
          ADMIN_URL
        );
        if (response.status === 1) {
          showMessageNotification("Deleted successfully", "success");
          getAllBlogs();
        }
      }
    });
  };
  /*******************  
  @Purpose : Used for clear input
  @Parameter : {}
  @Author : INIC
  ******************/
  const clearInput = () => {
    setSearchText("");
    getAllBlogs();
  };
  /*******************  
  @Purpose : Used for search data
  @Parameter : {}
  @Author : INIC
  ******************/
  const searchField = async () => {
    let body = {
      page,
      pagesize,
      searchText: searchText && searchText.length > 1 ? searchText : "",
    };
    const response = await props.callApi(
      API.CMS_LIST,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      setBlogListing(response.data.listing);
      setTotal(response.data.total);
    }
  };
  /*******************  
  @Purpose : Used for blog status handle
  @Parameter : status, id
  @Author : INIC
  ******************/
  const blogStatusHandler = async (status, id) => {
    let body = {
      ids: [id],
      status: status,
    };

    const response = await props.callApi(
      API.CMS_STATUS,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      showMessageNotification("Status updated successfully", "success");
      getAllBlogs();
    }
  };
  /*******************  
  @Purpose : Used for blog pagination
  @Parameter : pageNo, pageSize
  @Author : INIC
  ******************/
  const blogPagination = (pageNo, pageSize) => {
    setPage(pageNo);
    setPagesize(pageSize);
  };
  /*******************  
  @Purpose : Used for  Date Time TimeZone Conversion based on setting in General Settings
  @Parameter : inputDatetime
  @Author : INIC
  ******************/
  const getDateTimeFormat = (inputDatetime) => {
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
  /*******************  
  @Purpose : Used for multiple status change
  @Parameter : {}
  @Author : INIC
  ******************/
  const bulkStatusChange = async () => {
    let newList = allBlogStatus.filter(({ isChecked }) => isChecked);
    newList.forEach((blog) => (blog.status = !blog.status));
    if (allBlogStatus.length > 0) {
      showMessageNotification("Status updated successfully", "success");
    }
  };
  /*******************  
  @Purpose : Used for multiple status toggle change
  @Parameter : {}
  @Author : INIC
  ******************/
  const toggleStatusHandler = () => {
    setToggleStatus(!toggleStatus);
    let tempList = blogListing;
    setAllBlogStatus(tempList);
    bulkStatusChange();
  };
  /*******************  
  @Purpose : Used for multiple checkbox change
  @Parameter : {}
  @Author : INIC
  ******************/
  const handleChangeCheckbox = (e) => {
    let tempListing = [...blogListing];
    let checkedAll = allChecked;

    if (e.target.value === "checkAll") {
      tempListing.forEach((item) => {
        item.isChecked = e.target.checked;
        checkedAll = e.target.checked;
      });
    } else {
      tempListing.find(({ _id }) => _id === e.target.value).isChecked =
        e.target.checked;
      let newList = tempListing.filter((el) => el.isChecked === false);
      if (newList.length <= 0) {
        checkedAll = true;
      } else {
        checkedAll = false;
      }
    }
    setBlogListing(tempListing);
    setAllChecked(checkedAll);
    setIsCheckBoxSelected(blogListing.filter((el) => el.isChecked === true));
  };
  /*******************  
  @Purpose : Used for multiple record delete
  @Parameter : {}
  @Author : INIC
  ******************/
  const deleteRecords = () => {
    let lists = blogListing
      .map((el) => (el.isChecked === true ? el._id : ""))
      .filter((el) => el !== "");

    if (lists.length > 0) {
      swal({
        title: "Are you sure, you want to delete?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          let body;
          body = { ids: lists };
          const response = await props.callApi(
            API.CMS_DELETE,
            body,
            "post",
            null,
            true,
            false,
            ADMIN_URL
          );
          if (response.status === 1) {
            showMessageNotification("Deleted successfully", "success");
            getAllBlogs();
          }
        }
      });
    }
  };

  const numbers = [2, 5, 10, 15, 25, 50, 100, 200, 500].filter(
    (number) => number < total
  );
  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="content-header-title">Content</li>
                <li className="breadcrumb-item">
                  <Link onClick={() => props.history.push("/dashboard")}>
                    <i className="bx bx-home-alt" />
                  </Link>
                </li>
                <li className="breadcrumb-item">Content</li>
                <li className="breadcrumb-item active" aria-current="page">
                  Static Pages
                </li>
              </ol>
            </nav>
            <div className="content-area position-relative">
              <div className="grid">
                <div className="grid-content">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="left-buttons d-flex flex-wrap">
                      <div className="search position-relative has-icon-left">
                        <input
                          type="search"
                          className="form-control text-capitalize"
                          placeholder={`${lang(
                            "ContentManagement.CMSListing.search"
                          )}`}
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
                      {isCheckBoxSelected.length > 0 && (
                        <div className="position-relative d-flex flex-wrap">
                          <button
                            onClick={() => deleteRecords()}
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
                                checked={toggleStatus}
                              />
                              <span className="switch">
                                <i class="bx bx-toggle-left"></i>
                              </span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                    {showAddOption ? (
                      <div className="right-buttons">
                        <Link
                          onClick={() => props.history.push("/addStatic")}
                          id="addNewPage"
                          type="button"
                          className="btn glow-primary btn-primary"
                        >
                          <i className="bx bx-user-plus d-lg-none" />
                          <span className="d-none d-sm-none d-lg-inline-block">
                            {lang("ContentManagement.CMSListing.addNewCMSPage")}
                          </span>
                        </Link>
                      </div>
                    ) : null}
                  </div>
                  <div className="table-responsive">
                    <table
                      className="table row-border nowrap common-datatable"
                      id="content-blog-listing"
                    >
                      <thead>
                        <tr>
                          <th>
                            <div className="custom-checkbox">
                              <label>
                                <input
                                  type="checkbox"
                                  name="checkAll"
                                  value="checkAll"
                                  checked={allChecked}
                                  onChange={handleChangeCheckbox}
                                />
                                <span></span>
                              </label>
                            </div>
                          </th>
                          <th
                            className="all"
                            onClick={() => onSort("pageTitle")}
                          >
                            <b>Page Title</b>{" "}
                            <i
                              aria-hidden="true"
                              className={
                                sortData["[pageTitle]"]
                                  ? "bx bxs-chevron-up"
                                  : "bx bxs-chevron-down"
                              }
                            ></i>
                          </th>
                          <th className="all">
                            <b>Description</b>
                          </th>
                          <th className="all">
                            <b>Updated</b>{" "}
                          </th>
                          <th className="all">
                            <b>{lang("ContentManagement.CMSListing.status")}</b>
                          </th>
                          <th className="all">
                            <b>{lang("ContentManagement.CMSListing.action")}</b>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogListing && blogListing.length === 0 ? (
                          <tr className="text-center text-danger not-found-txt">
                            <td colSpan="6">
                              {loading ? (
                                <Loader />
                              ) : (
                                <h6
                                  className="text-center text-danger not-found-txt"
                                  colSpan="6"
                                >
                                  {lang(
                                    "ContentManagement.CMSListing.noRecord"
                                  )}
                                </h6>
                              )}
                            </td>
                          </tr>
                        ) : (
                          blogListing.map((item, key) => {
                            return (
                              <tr key={key}>
                                <td>
                                  <div className="custom-checkbox">
                                    <label>
                                      <input
                                        key={item._id}
                                        type="checkbox"
                                        name={item._id}
                                        value={item._id}
                                        checked={item.isChecked}
                                        onChange={handleChangeCheckbox}
                                      />
                                      <span />
                                    </label>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <span>
                                      {item.pageTitle.slice(0, 30)}...
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <span>
                                    {" "}
                                    {item.metaDescription.slice(0, 170)}...
                                  </span>
                                </td>
                                <td>
                                  <span className="dob-date d-block">
                                    {item.updatedAt
                                      ? getDateTimeFormat(parseInt(item.updatedAt))
                                      : null}
                                  </span>
                                </td>
                                <td>
                                  <div className="custom-control custom-switch light">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      id={item._id}
                                      checked={item.status ? true : false}
                                      onChange={() => {
                                        item.status = !item.status;
                                        blogStatusHandler(
                                          item.status,
                                          item._id
                                        );
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      for={item._id}
                                    ></label>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex">
                                    <Link
                                      className="cursor-pointer mr-3"
                                      onClick={() =>
                                        props.history.push(
                                          `/staticPreview/${item._id}`
                                        )
                                      }
                                    >
                                      <i className="bx bx-show-alt" />
                                    </Link>
                                    {showEditOption && (
                                      <Link
                                        className="cursor-pointer mr-3"
                                        onClick={() => {
                                          props.history.push(
                                            `/editStatic/${item._id}`
                                          );
                                        }}
                                      >
                                        <i class="bx bx-edit" />
                                      </Link>
                                    )}
                                    {showDeleteOption && (
                                      <Link
                                        className="cursor-pointer mr-3"
                                        onClick={() => deleteCms(item._id)}
                                      >
                                        <i className="bx bx-trash-alt" />
                                      </Link>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                  {blogListing && blogListing.length > 0 && (
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
                          onChange={blogPagination}
                        />
                      </div>
                    </div>
                  )}
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
  language: state.admin.language,
});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, { callApi })(StaticPage);
