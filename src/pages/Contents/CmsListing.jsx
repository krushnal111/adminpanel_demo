import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { callApi } from "../../api"; // Used for api call
import { Link } from "react-router-dom";
import swal from "sweetalert";
import $ from "jquery";
import Select from "react-select";
import * as _ from "lodash";
import { showMessageNotification } from "./../../utils/Functions"; //Utility functions
import Loader from "../../components/Loader/Loader";
import { useSorting } from "../../hooks";
import API from "../../api/Routes";
import { IMG_URL,ADMIN_URL } from "../../config";
$.DataTable = require("datatables.net");
require("datatables.net-responsive");
/******************* 
@Purpose : Used for CMS listing
@Parameter : props
@Author : INIC
******************/
function CmsListing(props) {
  const [lang] = useTranslation("language");
  const [page] = useState(1);
  const [pagesize] = useState(10);
  const [, setTotal] = useState(1);
  const [blogListing, setBlogListing] = useState([]);
  const [condition] = useState("");
  const [, setColumnSettingsArr] = useState([]);
  const [, sort] = useSorting();
  const [openFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [blogCategoryListing, setBlogCategoryListing] = useState([]);
  const [showEditOption, setShowEditOption] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [showAddOption, setShowAddOption] = useState(false);

  useEffect(() => {
    if (props.CmsPagesAccess && !_.isEmpty(props.CmsPagesAccess)) {
      let { CmsPagesAccess } = props;
      setShowEditOption(CmsPagesAccess.edit);
      setShowDeleteOption(CmsPagesAccess.delete);
      setShowAddOption(CmsPagesAccess.create);
    }
    getAllBlogs();
  }, []);

  /******************* 
  @Purpose : List all blogs
  @Parameter : {}
  @Author : INIC
  ******************/
  const getAllBlogs = async () => {
    var body = {
      page,
      pagesize,
      sort,
      columnKey: "blogListing",
      condition: condition,
    };

    try {
      const response = await props.callApi(
        API.LIST_BLOG,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        setBlogListing(response.data.listing);
        setColumnSettingsArr(response.data.columnSettings);
        setBlogCategoryListing(response.data.listing);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  /******************* 
  @Purpose : Delete cms
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
          API.DELETE_BLOG,
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
  @Purpose : Reset input box value
  @Parameter : {}
  @Author : INIC
  ******************/
  const clearInput = () => {
    setSearchText("");
    getAllBlogs();
  };
  /******************* 
  @Purpose : Used for search fields
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
      API.LIST_BLOG,
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
  @Purpose : Function to filter by some property in array of objects with unique property name
  @Parameter : data, key
  @Author : INIC
  ******************/
  const filterCategories = (data, key) => {
    return [...new Map(data.map((x) => [key(x), x])).values()];
  };
  /******************* 
  @Purpose : Function to filter action handle
  @Parameter : e
  @Author : INIC
  ******************/
  const filterCategoryHandler = async (e) => {
    let categoryList = [];
    if (e !== null && e.length && e.length > 0) {
      e.forEach((item) => categoryList.push(item.label));
    }
    let body = {
      blogCategory: categoryList,
      page,
      pagesize,
    };
    const response = await props.callApi(
      API.LIST_BLOG,
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
  @Purpose : Rander Filter selection
  @Parameter : {}
  @Author : INIC
  ******************/
  const renderFilter = () => {
    let blogFilter = filterCategories(
      blogCategoryListing,
      (id) => id.blogCategory
    );
    let categoryObj = [];

    blogFilter.forEach((item) => {
      categoryObj.push({
        value: item.blogCategory,
        label: item.blogCategory,
      });
    });

    return (
      <div>
        <Select
          isMulti
          placeholder="Filter By Category"
          name="categories"
          options={categoryObj}
          className="basic-multi-select"
          styles={{ width: "30px" }}
          classNamePrefix="select"
          onChange={(e) => filterCategoryHandler(e)}
        />
      </div>
    );
  };
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
                  Blog Lists
                </li>
              </ol>
            </nav>
            <div className="content-area position-relative">
              <div className="grid">
                <div className="grid-content">
                  {/* filterbar buttons */}

                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="left-buttons d-flex align-items-center flex-wrap">
                      <div className="search position-relative has-icon-left mr-3">
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
                      <div
                        id="container1"
                        className={
                          openFilter
                            ? "mr-5 filter-category custom-dropdown open"
                            : "mr-5 filter-category custom-dropdown"
                        }
                      >
                        {renderFilter()}
                      </div>
                    </div>
                    {showAddOption ? (
                      <div className="right-buttons">
                        <Link
                          onClick={() => props.history.push("/addBlog")}
                          id="addNewblog"
                          type="button"
                          className="btn glow-primary btn-primary"
                        >
                          <i className="bx bx-user-plus d-lg-none" />
                          <span className="d-none d-sm-none d-lg-inline-block">
                            {lang("ContentManagement.CMSListing.addNewPage")}
                          </span>
                        </Link>
                      </div>
                    ) : null}
                  </div>

                  <div className="listing-grid">
                    <div className="row">
                      {blogListing && blogListing.length === 0
                        ? loading && <Loader />
                        : blogListing &&
                          Array.isArray(blogListing) &&
                          blogListing.map((item, key) => {
                            return (
                              <div
                                className="col-md-6 col-lg-4 mb-3 mb-sm-5"
                                key={key}
                              >
                                <Link className="d-block">
                                  <div className="listing-image">
                                    <img
                                      src={ADMIN_URL+ IMG_URL + item.image}
                                      alt=""
                                    ></img>
                                    <div className="info-details">
                                      <Link>
                                        <span
                                          className="bx bx-show-alt"
                                          onClick={() =>
                                            props.history.push(
                                              `/blogPreview/${item._id}`
                                            )
                                          }
                                        ></span>
                                      </Link>
                                      {showEditOption && (
                                        <Link className="d-inline-block mr-2">
                                          <span
                                            className="bx bx-edit"
                                            onClick={() =>
                                              props.history.push(
                                                `/editBlog/${item._id}`
                                              )
                                            }
                                          ></span>
                                        </Link>
                                      )}
                                      {showDeleteOption && (
                                        <Link className="d-inline-block mr-2">
                                          <span
                                            className="bx bx-trash-alt"
                                            onClick={() => deleteCms(item._id)}
                                          ></span>
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                </Link>

                                <div className="listing-details">
                                  <span className="category-name d-block mt-2 mb-2">
                                    {item.blogCategory}
                                  </span>
                                  <Link
                                    className="article-name"
                                    onClick={() =>
                                      props.history.push(
                                        `/blogPreview/${item._id}`
                                      )
                                    }
                                  >
                                    {item.blogTitle.slice(0, 30)}...
                                  </Link>
                                  <p>{item.metaDescription.slice(0, 70)}...</p>
                                </div>
                              </div>
                            );
                          })}
                    </div>
                  </div>
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
export default connect(mapStateToProps, { callApi })(CmsListing);
