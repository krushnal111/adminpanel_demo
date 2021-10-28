import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { callApi } from "../../api"; // Used for api call
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import $ from "jquery";
import _ from "lodash";
import Loader from "../../components/Loader/Loader"; // Used lading screen view
import { useSorting } from "../../hooks";
import API from "../../api/Routes";
import Pagination from "rc-pagination"; // Used pagination
import { Select } from "antd";
import { showMessageNotification } from "./../../utils/Functions"; // Utility functions
import { ADMIN_URL } from "../../config";
$.DataTable = require("datatables.net");
require("datatables.net-responsive");

const { Option } = Select;
/******************* 
@Purpose : Used for blog category
@Parameter : props
@Author : INIC
******************/
function BlogCategory(props) {
  const [lang] = useTranslation("language");
  const [blogCategoryTitle, setBlogCategoryTitle] = useState("");
  const [blogCategoryDescription, setBlogCategoryDescription] = useState("");
  const [, setCategoryStatus] = useState(false);
  const [blogCategoryListing, setBlogCategoryListing] = useState("");
  const [createdById, setCreatedById] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [, setColumnSettingsArr] = useState([]);
  const [page, setPage] = useState(1);
  const [, sort] = useSorting();
  const [pagesize, setPagesize] = useState(10);
  const [total, setTotal] = useState(1);
  const [multipleDelete] = useState([]);
  const [condition] = useState("");
  const [loading, setLoading] = useState(true);
  const [, setBlogId] = useState("");
  const [, setIsFormValid] = useState("");
  const [show, setShow] = useState(false);
  const [, setEditCategory] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [blogCategoryId, setBlogCategoryId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isCheckBoxSelected, setIsCheckBoxSelected] = useState([]);
  const [toggleStatus, setToggleStatus] = useState(false);
  const [allBlogStatus, setAllBlogStatus] = useState([]);
  const [length, setLength] = useState(1);
  const [showEditOption, setShowEditOption] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [showAddOption, setShowAddOption] = useState(false);
  let [errors, setErrors] = useState("");

  useEffect(() => {
    getAllBlogCategory();
    setShow(false);
  }, [page, pagesize]);

  useEffect(() => {
    if (props.CmsPagesAccess && !_.isEmpty(props.CmsPagesAccess)) {
      let { CmsPagesAccess } = props;
      setShowEditOption(CmsPagesAccess.edit);
      setShowDeleteOption(CmsPagesAccess.delete);
      setShowAddOption(CmsPagesAccess.create);
    }

    if (props.admindata && !_.isEmpty(props.admindata)) {
      let { firstname, lastname, _id } = props.admindata;
      setCreatedBy(firstname + " " + lastname);
      setCreatedById(_id);
    }
  }, []);
  /******************* 
  @Purpose : Used for get all blog category
  @Parameter : {}
  @Author : INIC
  ******************/
  const getAllBlogCategory = async () => {
    let body = {
      page,
      pagesize,
      sort,
      columnKey: "blogCategoryListing",
      condition: condition,
    };
    try {
      const response = await props.callApi(
        API.LIST_BLOG_CATEGORY,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        setBlogCategoryListing(
          response.data.listing.map((item) => ({ ...item, isChecked: false }))
        );
        setColumnSettingsArr(response.data.columnSettings);
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
  @Purpose : Used for validate form
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    let formError = { blogCategoryTitle: "", blogCategoryDescription: "" };
    let isFormValid = true;

    if (!blogCategoryTitle.trim())
      formError.blogCategoryTitle = "*Blog category is required";
    else if (blogCategoryTitle.length < 2)
      formError.blogCategoryTitle =
        "*Blog category should be minimum 2 characters";
    else formError.blogCategoryTitle = "";

    if (!blogCategoryDescription.trim())
      formError.blogCategoryDescription = "*Blog description is required";
    else if (blogCategoryDescription.length < 20)
      formError.blogCategoryDescription =
        "*Blog description should be minimum 20 characters";
    else formError.blogCategoryDescription = "";

    if (
      formError.blogCategoryTitle !== "" ||
      formError.blogCategoryDescription !== ""
    )
      isFormValid = false;

    setErrors(formError);
    setIsFormValid(isFormValid);

    return isFormValid;
  };
  /******************* 
  @Purpose : Used for get blog catagory
  @Parameter : id
  @Author : INIC
  ******************/
  const getBlogCategory = async (id) => {
    setShow(true);
    setEditCategory(true);
    const response = await props.callApi(
      API.GET_BLOG_CATEGORY_DETAILS + id,
      "",
      "get",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      let {
        blogCategoryTitle: blogTitle,
        blogCategoryDescription: blogDescription,
      } = response.data;

      setBlogCategoryTitle(blogTitle);
      setBlogCategoryDescription(blogDescription);
      setBlogId(id);
    }
  };
  /******************* 
  @Purpose : Used for edit blog catagory
  @Parameter : id
  @Author : INIC
  ******************/
  const updateCategoryHandler = async (id) => {
    if (validateForm()) {
      let body = {
        id,
        blogCategoryTitle: blogCategoryTitle,
        blogCategoryDescription: blogCategoryDescription,
      };
      const response = await props.callApi(
        API.ADD_UPDATE_BLOG_CATEGORY,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Category updated successfully", "success");
        setShow(false);
        getAllBlogCategory();
      }
    }
  };
  /******************* 
  @Purpose : Used for delete blog catagory
  @Parameter : bId
  @Author : INIC
  ******************/
  const deleteCategoriesHandler = async (bId) => {
    var delArr = multipleDelete;
    delArr = _.compact(delArr);
    swal({
      title: "Are you sure, you want to delete ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        if (delArr.length > 0) {
          var body = { ids: delArr };
        } else {
          body = { ids: [bId] };
        }
        const response = await props.callApi(
          API.DELETE_BLOG_CATEGORY,
          body,
          "post",
          null,
          true,
          false,
          ADMIN_URL
        );
        if (response.status === 1) {
          showMessageNotification("Category deleted successfully", "success");
          getAllBlogCategory();
        }
      }
    });
  };
  /******************* 
  @Purpose : Used for add blog catagory
  @Parameter : id
  @Author : INIC
  ******************/
  const addCategoryHandler = async (e) => {
    setShow(true);
    e.preventDefault();
    if (validateForm()) {
      let body = {
        blogCategoryTitle: blogCategoryTitle,
        blogCategoryDescription: blogCategoryDescription,
        createdBy: createdBy,
        createdById: createdById,
      };

      const response = await props.callApi(
        API.ADD_UPDATE_BLOG_CATEGORY,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Category added successfully", "success");
        setShow(false);
      }
      getAllBlogCategory();
    }
  };
  /******************* 
  @Purpose : Used for handle blog status
  @Parameter : {status, id}
  @Author : INIC
  ******************/
  const blogStatusHandler = async (status, id) => {
    setCategoryStatus((current) => !current);
    let body = {
      ids: [id],
      status: status,
    };

    const response = await props.callApi(
      API.CHANGE_BLOG_CATEGORY_STATUS,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      showMessageNotification("Status updated  successfully", "success");
      getAllBlogCategory();
    }
  };
  /******************* 
  @Purpose : Used for close modal handle
  @Parameter : {}
  @Author : INIC
  ******************/
  const modelCloseBtn = () => {
    setShow(false);
    setErrors("");
  };
  /******************* 
  @Purpose : Used for modal add category handle
  @Parameter : {}
  @Author : INIC
  ******************/
  const modalAddCategory = () => {
    setShow(true);
    setBlogCategoryTitle("");
    setBlogCategoryDescription("");
    setBlogCategoryId("");
  };
  /******************* 
  @Purpose : Used for modal update category handle
  @Parameter : e
  @Author : INIC
  ******************/
  const addUpdateCategory = (e) => {
    blogCategoryId
      ? updateCategoryHandler(blogCategoryId)
      : addCategoryHandler(e);
  };
  /******************* 
  @Purpose : Used for clean form field handle
  @Parameter : {}
  @Author : INIC
  ******************/
  const clearInput = () => {
    setSearchText("");
    getAllBlogCategory();
  };
  /******************* 
  @Purpose : Used for search action
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
      API.LIST_BLOG_CATEGORY,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      setBlogCategoryListing(response.data.listing);
      setTotal(response.data.total);
    }
  };
  /******************* 
  @Purpose : Used for multiple checkbox selection
  @Parameter : e
  @Author : INIC
  ******************/
  const handleChangeCheckbox = (e) => {
    let tempListing = [...blogCategoryListing];
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
    setBlogCategoryListing(tempListing);
    setAllChecked(checkedAll);
    setIsCheckBoxSelected(
      blogCategoryListing.filter((el) => el.isChecked === true)
    );
  };
  /******************* 
  @Purpose : Used for multiple checkbox selection & delete records
  @Parameter : {}
  @Author : INIC
  ******************/
  const deleteRecords = () => {
    let lists = blogCategoryListing
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
            API.DELETE_BLOG_CATEGORY,
            body,
            "post",
            null,
            true,
            false,
            ADMIN_URL
          );
          if (response.status === 1) {
            showMessageNotification("Deleted successfully", "success");
            getAllBlogCategory();
          }
        }
      });
    }
  };
  /******************* 
  @Purpose : Used for bulk status change
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
  @Purpose : Used for toggle status change
  @Parameter : {}
  @Author : INIC
  ******************/
  const toggleStatusHandler = () => {
    setToggleStatus(!toggleStatus);
    let tempList = blogCategoryListing;
    setAllBlogStatus(tempList);
    bulkStatusChange();
  };
  /******************* 
  @Purpose : Used for blog pagination change
  @Parameter : {}
  @Author : INIC
  ******************/
  const blogPagination = (pageNo, pageSize) => {
    setPage(pageNo);
    setPagesize(pageSize);
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
                  Blog Category
                </li>
              </ol>
            </nav>
            <div className="content-area position-relative">
              <div className="grid">
                <div className="grid-content">
                  {/* filterbar buttons */}
                  <div className="d-flex align-items-center justify-content-between mb-2 left-buttons">
                    <div className="left-buttons d-flex align-items-center flex-wrap">
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
                        {searchText && searchText.length > 0 && (
                          <div className="clear">
                            <span onClick={clearInput}>
                              <em className="bx bx-x"></em>
                            </span>
                          </div>
                        )}
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
                                // value="checked"
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
                    {showAddOption && (
                      <Button
                        onClick={modalAddCategory}
                        id="addNewCategory"
                        type="button"
                        className="btn glow-primary btn-primary minW-0"
                      >
                        <i className="bx bx-user-plus d-lg-none" />
                        <span className="d-none d-sm-none d-lg-inline-block">
                          Add Category
                        </span>
                      </Button>
                    )}
                  </div>

                  {/* filter bar buttons end */}
                  {/* datatable start */}
                  <Modal show={show} onHide={modelCloseBtn}>
                    <Modal.Header closeButton>
                      <div class="d-flex align-items-center">
                        <div class="icon mr-2">
                          <span class="bx bxs-plus-circle"></span>
                        </div>
                        <h5 class="modal-title" id="exampleModalLongTitle">
                          {blogCategoryId ? "Update Category" : "Add Category"}
                        </h5>
                      </div>
                    </Modal.Header>
                    <Modal.Body closeButton>
                      <div class="notification-form">
                        <div class="row">
                          <div class="col-md-12">
                            <div className="form-group mb-md-5 mb-3">
                              <label htmlFor="Title">
                                {lang("ContentManagement.CMS.category")}
                                <sup className="text-danger">*</sup>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="blogCategoryTitle"
                                name="blogCategoryTitle"
                                placeholder="Add Category"
                                value={blogCategoryTitle}
                                onChange={(e) => {
                                  setBlogCategoryTitle(e.target.value);
                                  errors = Object.assign(errors, {
                                    blogCategoryTitle: "",
                                  });
                                  setErrors(errors);
                                }}
                              />
                              <div className="text-danger d-block">
                                {errors.blogCategoryTitle}
                              </div>
                            </div>
                            <div className="form-group mb-md-5 mb-3">
                              <label htmlFor="Title">
                                Description
                                <sup className="text-danger">*</sup>
                              </label>
                              <textarea
                                type="text"
                                className="form-control"
                                id="blogCategoryDescription"
                                name="blogCategoryDescription"
                                placeholder="Add Description"
                                value={blogCategoryDescription}
                                onChange={(e) => {
                                  setBlogCategoryDescription(e.target.value);
                                  errors = Object.assign(errors, {
                                    blogCategoryDescription: "",
                                  });
                                  setErrors(errors);
                                }}
                              />
                              <span className="text-danger d-block">
                                {errors.blogCategoryDescription}
                              </span>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div class="modal-btn">
                              <Link
                                onClick={(e) => addUpdateCategory(e)}
                                class="btn btn-primary"
                              >
                                {" "}
                                {blogCategoryId ? "Update" : "Add"}{" "}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal.Body>
                  </Modal>
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
                          <th className="all">
                            <b>Category</b>
                          </th>
                          <th className="all">
                            <b>Description</b>
                          </th>
                          <th className="all">
                            <b>Count</b>
                          </th>
                          {showAddOption && (
                            <th className="all">
                              <b>Add blog</b>
                            </th>
                          )}
                          <th className="all">
                            <b>Status</b>
                          </th>
                          <th className="all">
                            <b>Action</b>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogCategoryListing &&
                          blogCategoryListing.length === 0 && (
                            <tr className="text-center text-danger not-found-txt">
                              <td colSpan="6">
                                {loading && <Loader />}
                                {!loading && (
                                  <h6
                                    className="text-center text-danger not-found-txt"
                                    colSpan="6"
                                  >
                                    No Records found!
                                  </h6>
                                )}
                              </td>
                            </tr>
                          )}
                        {blogCategoryListing &&
                          blogCategoryListing.length > 0 &&
                          blogCategoryListing.map((item, key) => {
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
                                <td>{item.blogCategoryTitle}</td>
                                <td>{item.blogCategoryDescription}</td>
                                <td>{item.count}</td>
                                {showAddOption && (
                                  <td>
                                    <div
                                      className="modalTitle"
                                      onClick={() =>
                                        props.history.push("/addBlog")
                                      }
                                    >
                                      <span class="bx bxs-plus-circle"></span>
                                    </div>
                                  </td>
                                )}
                                <td>
                                  <div className="custom-control custom-switch light">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      id={item._id}
                                      checked={
                                        item.status ? item.status : false
                                      }
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
                                    {showEditOption && (
                                      <Link className="cursor-pointer mr-3">
                                        <i
                                          class="bx bx-edit"
                                          onClick={() => {
                                            getBlogCategory(item._id);
                                            setBlogCategoryId(item._id);
                                          }}
                                        />
                                      </Link>
                                    )}
                                    {showDeleteOption && (
                                      <Link className="cursor-pointer mr-3">
                                        <i
                                          className="bx bx-trash-alt"
                                          onClick={() =>
                                            deleteCategoriesHandler(item._id)
                                          }
                                        />
                                      </Link>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  <div className="table-footer mt-2 mt-sm-3 d-flex align-items-center justify-content-between">
                    <div>
                      <label className="mr-2">Showing</label>
                      <Select
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
                  {/* datatable ends */}
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
  admindata: state.admin.adminData,
  language: state.admin.language,
});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, { callApi })(BlogCategory);
