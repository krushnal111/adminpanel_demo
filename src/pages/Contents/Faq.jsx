import React, { useState, useEffect } from "react";
import { Tab, Tabs, Button, Modal } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { callApi } from "../../api"; // Used for api call
import { Link } from "react-router-dom";
import Select from "react-select";
import swal from "sweetalert";
import * as _ from "lodash";
import { useSorting } from "../../hooks";
import API from "../../api/Routes";
import { showMessageNotification } from "./../../utils/Functions"; //Utility functions
import Loader from "../../components/Loader/Loader";
import { ADMIN_URL } from "../../config";
/******************* 
@Purpose : Used for FAQ pages
@Parameter : props
@Author : INIC
******************/
function Faq(props) {
  const [lang] = useTranslation("language");
  const [faqID, setFaqID] = useState("");
  const [faqCategoryName, setFaqCategoryName] = useState("");
  const [faqCategory, setFaqCategory] = useState("");
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [, setTotal] = useState(1);
  const [showCategory, setShowCategory] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [eventKey, setEventKey] = useState("faqList");
  const [, setIsFormValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [faqListing, setFaqListing] = useState([]);
  const [faqCategoryID, setFaqCategoryID] = useState("");
  const [categoryListing, setCategoryListing] = useState([]);
  const [faqPageSize] = useState(10);
  const [faqPage] = useState(1);
  const [, setFaqTotal] = useState(1);
  const [, setFaqLength] = useState(1);
  const [, setCategoryLength] = useState(1);
  const [categoryPage] = useState(1);
  const [categoryPageSize] = useState(10);
  const [, setCategoryTotal] = useState(1);
  const [, sort] = useSorting();
  const [condition] = useState("");
  const [multipleDelete] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showEditOption, setShowEditOption] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [showAddOption, setShowAddOption] = useState(false);
  let [errors, setErrors] = useState("");

  useEffect(() => {
    if (props.CmsPagesAccess && !_.isEmpty(props.CmsPagesAccess)) {
      let { CmsPagesAccess } = props;
      setShowEditOption(CmsPagesAccess.edit);
      setShowDeleteOption(CmsPagesAccess.delete);
      setShowAddOption(CmsPagesAccess.create);
    }
    getFAQCategoryListing();
    getFAQListDetails();
  }, []);
  /******************* 
  @Purpose : Used for validate form
  @Parameter : type
  @Author : INIC
  ******************/
  const validateForm = (type) => {
    let error = {
      faqCategoryName: "",
      faqQuestion: "",
      faqAnswer: "",
      faqCategory: "",
    };
    let isFormValid = true;

    if (type === "faqCategory") {
      if (!faqCategoryName.trim())
        error.faqCategoryName = "*FAQ category is required";
      else error.faqCategoryName = "";
    } else if (type === "faqList") {
      if (!faqCategory) error.faqCategory = "*FAQ category is required";
      else error.faqCategory = "";

      if (!faqQuestion) error.faqQuestion = "*FAQ question is required";
      else if (faqQuestion.length < 10)
        error.faqQuestion = "Question must be minimum 10 characters.";
      else error.faqQuestion = "";

      if (!faqAnswer) error.faqAnswer = "*FAQ answer is required";
      else if (faqAnswer.length < 20)
        error.faqAnswer = "Answer must be minimum 20 characters.";
      else error.faqAnswer = "";
    }

    if (
      error.faqCategoryName !== "" ||
      error.faqQuestion !== "" ||
      error.faqAnswer !== ""
    )
      isFormValid = false;

    setErrors(error);
    setIsFormValid(isFormValid);

    return isFormValid;
  };
  /******************* 
  @Purpose : Used for FAQ categories
  @Parameter : {}
  @Author : INIC
  ******************/
  const getFAQCategoryListing = async () => {
    let body = {
      page: categoryPage,
      pagesize: categoryPageSize,
      sort,
      columnKey: "faqCategoriesListing",
      condition: condition,
    };

    try {
      const response = await props.callApi(
        API.FAQ_CATEGORY_LISTING,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        setCategoryListing(
          response.data.listing.map((item) => ({ ...item, isChecked: false }))
        );
        setCategoryTotal(response.total);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  /******************* 
  @Purpose : Used for FAQ categories details
  @Parameter : id
  @Author : INIC
  ******************/
  const getFAQCategoryDetails = async (id) => {
    setShowCategory(true);
    const response = await props.callApi(
      API.GET_FAQ_CATEGORY_DETAILS + id,
      "",
      "get",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      let { faqCategoryName: categoryName } = response.data;
      setFaqCategoryName(categoryName);
    }
  };
  /******************* 
  @Purpose : Used for add FAQ categories
  @Parameter : e
  @Author : INIC
  ******************/
  const addFAQCategory = async (e) => {
    e.preventDefault();
    setShowCategory(true);
    if (validateForm("faqCategory")) {
      let body = {
        faqCategoryName,
      };
      const response = await props.callApi(
        API.ADD_UDPATE_FAQ_CATEGORY,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Category added successfully", "success");
      }
      setShowCategory(false);
      setFaqCategoryName("");
      getFAQCategoryListing();
    }
  };
  /******************* 
  @Purpose : Used for delete FAQ categories
  @Parameter : bId
  @Author : INIC
  ******************/
  const deleteFaqCategory = async (bId) => {
    let delArr = multipleDelete;
    let body;
    delArr = _.compact(delArr);
    swal({
      title: "Are you sure, you want to delete ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        if (delArr.length > 0) {
          body = { ids: delArr };
        } else {
          body = { faqCategoriesIds: [bId] };
        }
        const response = await props.callApi(
          API.DELETE_FAQ_CATEGORY,
          body,
          "post",
          null,
          true,
          false,
          ADMIN_URL
        );
        if (response.status === 1) {
          showMessageNotification("Category Deleted successfully", "success");
          getFAQCategoryListing();
        }
      }
    });
  };
  /******************* 
  @Purpose : Used for edit FAQ categories
  @Parameter : id
  @Author : INIC
  ******************/
  const updateFaqCategory = async (id) => {
    if (validateForm("faqCategory")) {
      let body = {
        faqCategoryId: id,
        faqCategoryName,
      };
      const response = await props.callApi(
        API.ADD_UDPATE_FAQ_CATEGORY,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Category updated successfully", "success");
        setShowCategory(false);
        getFAQCategoryListing();
      }
    }
  };
  /******************* 
  @Purpose : Used for FAQ list details
  @Parameter : {}
  @Author : INIC
  ******************/
  const getFAQListDetails = async () => {
    let body = {
      page: faqPage,
      pagesize: faqPageSize,
      sort,
      columnKey: "faqsListing",
      condition: condition,
    };
    try {
      const response = await props.callApi(
        API.FAQ_LISTNG,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        setFaqListing(
          response.data.listing.map((item) => ({ ...item, isChecked: false }))
        );
        setFaqTotal(response.total);
        setFaqLength(response.data.listing.length);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  /******************* 
  @Purpose : Used for add FAQ list
  @Parameter : e
  @Author : INIC
  ******************/
  const addFAQ = async (e) => {
    e.preventDefault();
    setShowFaq(true);
    if (validateForm("faqList")) {
      let body = {
        faqQuestion,
        faqAnswer,
        faqCategoryName: faqCategory.label,
      };
      const response = await props.callApi(
        API.ADD_UPDATE_FAQ,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("New FAQ added successfully", "success");
      }
      setShowFaq(false);
      setFaqCategory("");
      setFaqQuestion("");
      setFaqAnswer("");
      getFAQListDetails();
    }
  };
  /******************* 
  @Purpose : Used for delete FAQ
  @Parameter : bId
  @Author : INIC
  ******************/
  const deleteFaq = async (bId) => {
    let delArr = multipleDelete;
    let body;
    delArr = _.compact(delArr);

    swal({
      title: "Are you sure, you want to delete ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        if (delArr.length > 0) {
          body = { ids: delArr };
        } else {
          body = { faqsIds: [bId] };
        }
        const response = await props.callApi(
          API.DELETE_FAQ,
          body,
          "post",
          null,
          true,
          false,
          ADMIN_URL
        );
        if (response.status === 1) {
          showMessageNotification("FAQ Deleted successfully", "success");
          getFAQListDetails();
        }
      }
    });
  };
  /******************* 
  @Purpose : Used for edit FAQ
  @Parameter : id
  @Author : INIC
  ******************/
  const updateFaq = async (id) => {
    if (validateForm("faqList")) {
      let body = {
        faqId: id,
        faqQuestion,
        faqAnswer,
        faqCategoryName: faqCategory.label,
      };

      const response = await props.callApi(
        API.ADD_UPDATE_FAQ,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("FAQ updated successfully", "success");
        setShowFaq(false);
        getFAQListDetails();
      }
    }
  };
  /******************* 
  @Purpose : Used for get specific FAQ
  @Parameter : id
  @Author : INIC
  ******************/
  const getAllFaqDetailsHandler = async (id) => {
    setShowFaq(true);
    const response = await props.callApi(
      API.GET_FAQ_DETAILS + id,
      "",
      "get",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      let {
        faqCategoryName: categoryName,
        faqQuestion: question,
        faqAnswer: answer,
      } = response.data;

      setFaqCategory({ value: categoryName, label: categoryName });
      setFaqQuestion(question);
      setFaqAnswer(answer);
    }
  };
  /******************* 
  @Purpose : Used for clear form fields
  @Parameter : {}
  @Author : INIC
  ******************/
  const clearInput = () => {
    setSearchText("");
    getFAQCategoryListing();
    getFAQListDetails();
  };
  /******************* 
  @Purpose : Used for search fields
  @Parameter : evtKey
  @Author : INIC
  ******************/
  const searchField = async (evtKey) => {
    if (evtKey === "faqList") {
      let body = {
        page: faqPage,
        pagesize: faqPageSize,
        searchText: searchText && searchText.length > 1 ? searchText : "",
      };

      const response = await props.callApi(
        API.FAQ_LISTNG,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        setFaqListing(response.data.listing);
        setTotal(response.data.total);
      }
    } else if (evtKey === "faqCategory") {
      let body = {
        page: categoryPage,
        pagesize: categoryPageSize,
        searchText: searchText && searchText.length > 1 ? searchText : "",
      };

      const response = await props.callApi(
        API.FAQ_CATEGORY_LISTING,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        setCategoryListing(response.data.listing);
        setTotal(response.data.total);
        setCategoryLength(response.data.listing.length);
      }
    }
  };
  /******************* 
  @Purpose : Used for open category modal
  @Parameter : {}
  @Author : INIC
  ******************/
  const openCategoryModal = () => {
    setShowCategory(true);
    if (faqCategoryID) {
      setFaqCategoryID(null);
      setFaqCategoryName("");
    }
  };
  /******************* 
  @Purpose : Used for close category modal
  @Parameter : {}
  @Author : INIC
  ******************/
  const closeCategoryModal = () => {
    setShowCategory(false);
    setErrors("");
  };
  /******************* 
  @Purpose : Used for open FAQ modal
  @Parameter : {}
  @Author : INIC
  ******************/
  const openFAQModal = () => {
    setShowFaq(true);
    if (faqID) {
      setFaqID(null);
      setFaqCategory(null);
      setFaqQuestion("");
      setFaqAnswer("");
    }
  };
  /******************* 
  @Purpose : Used for close FAQ modal
  @Parameter : {}
  @Author : INIC
  ******************/
  const closeFAQMdal = () => {
    setShowFaq(false);
    setErrors("");
  };
  /******************* 
  @Purpose : Used for add/update category
  @Parameter : e
  @Author : INIC
  ******************/
  const addUpdateCategory = (e) => {
    faqCategoryID ? updateFaqCategory(faqCategoryID) : addFAQCategory(e);
  };
  /******************* 
  @Purpose : Used for add/update FAQ
  @Parameter : e
  @Author : INIC
  ******************/
  const addUpdateFAQ = (e) => {
    faqID ? updateFaq(faqID) : addFAQ(e);
  };
  const options = [];
  categoryListing.forEach((item) => {
    options.push({
      value: item.faqCategoryName,
      label: item.faqCategoryName,
    });
  });

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="content-header-title">
                  {lang("ContentManagement.FAQ.faq")}
                </li>
                <li className="breadcrumb-item">
                  <Link onClick={() => props.history.push("/dashboard")}>
                    <i className="bx bx-home-alt" />
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  {lang("ContentManagement.FAQ.content")}
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {lang("ContentManagement.FAQ.faq")}
                </li>
              </ol>
            </nav>
            <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap">
              <div className="d-flex align-items-center">
                <div className="search position-relative has-icon-left">
                  <input
                    type="search"
                    className="form-control text-capitalize"
                    placeholder={`${lang(
                      "ContentManagement.CMSListing.search"
                    )}`}
                    value={searchText}
                    onChange={(evt) => {
                      searchField(eventKey);
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
                    <em className="bx bx-search" />
                  </div>
                </div>
              </div>
              <div className="button-box mb-sm-0 mb-2  mt-sm-0 mt-2">
                {showAddOption && (
                  <Button
                    type="button"
                    className="btn btn-secondary glow-secondary mr-1"
                    onClick={openCategoryModal}
                  >
                    {lang("ContentManagement.FAQ.addCategory")}
                  </Button>
                )}
                <Modal show={showCategory} onHide={closeCategoryModal}>
                  <Modal.Header closeButton>
                    <div class="d-flex align-items-center">
                      <div class="icon mr-2">
                        <span class="bx bxs-plus-circle"></span>
                      </div>
                      <h5 class="modal-title" id="exampleModalLongTitle">
                        {lang("ContentManagement.FAQ.addCategory")}
                      </h5>
                    </div>
                  </Modal.Header>
                  <Modal.Body closeButton>
                    <div class="notification-form">
                      <div class="row">
                        <div class="col-md-12">
                          <div class="form-group mb-4">
                            <label class="mb-0" for="AddCategory">
                              {lang("ContentManagement.FAQ.addCategory")}
                              <sup className="text-danger">*</sup>
                            </label>

                            <input
                              type="text"
                              className="form-control"
                              id="faqCategoryName"
                              name="faqCategoryName"
                              placeholder={`${lang(
                                "ContentManagement.FAQ.addCategory"
                              )}`}
                              value={faqCategoryName}
                              onChange={(e) => {
                                setFaqCategoryName(e.target.value);
                                errors = Object.assign(errors, {
                                  faqCategoryName: "",
                                });
                                setErrors(errors);
                              }}
                            />

                            <span
                              className="error-msg"
                              style={{ color: "red" }}
                            >
                              {errors.faqCategoryName}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div class="modal-btn">
                            <Link
                              onClick={(event) => addUpdateCategory(event)}
                              class="btn btn-primary"
                            >
                              {faqCategoryID ? "Update" : "Add"}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
                {showAddOption && (
                  <Button
                    type="button"
                    className="btn btn-primary glow-primary"
                    onClick={openFAQModal}
                  >
                    {lang("ContentManagement.FAQ.addNewFAQ")}
                  </Button>
                )}
                <Modal show={showFaq} onHide={closeFAQMdal}>
                  <Modal.Header closeButton>
                    <div class="d-flex align-items-center">
                      <div class="icon mr-2">
                        <span class="bx bxs-plus-circle"></span>
                      </div>
                      <h5 class="modal-title" id="exampleModalLongTitle">
                        {lang("ContentManagement.FAQ.addNewFAQ")}
                      </h5>
                    </div>
                  </Modal.Header>
                  <Modal.Body closeButton>
                    <div class="notification-form">
                      <div class="row">
                        <div class="col-md-12">
                          <div className="form-group mb-md-3 mb-3">
                            <label htmlFor="blogCategory">
                              {lang("ContentManagement.FAQ.category")}
                              <sup className="text-danger">*</sup>
                            </label>
                            <Select
                              className="selectpicker w-100"
                              id="faqCategory"
                              name="faqCategory"
                              placeholder="Select Category"
                              value={faqCategory}
                              options={options}
                              onChange={(e) => {
                                setFaqCategory(e);
                                errors = Object.assign(errors, {
                                  faqCategory: "",
                                });
                                setErrors(errors);
                              }}
                            ></Select>
                            <span
                              className="error-msg"
                              style={{ color: "red" }}
                            >
                              {errors.faqCategory}
                            </span>
                          </div>
                          <div>
                            <div className="modalTitle mb-2">
                              <span
                                class="bx bxs-plus-circle"
                                onClick={openCategoryModal}
                              ></span>
                              <label>Add New Category</label>
                            </div>
                            <Modal
                              show={showCategory}
                              onHide={closeCategoryModal}
                            >
                              <Modal.Header closeButton>
                                <div class="d-flex align-items-center">
                                  <div class="icon mr-2">
                                    <span class="bx bxs-plus-circle"></span>
                                  </div>
                                  <h5
                                    class="modal-title"
                                    id="exampleModalLongTitle"
                                  >
                                    {lang("ContentManagement.FAQ.addCategory")}
                                  </h5>
                                </div>
                              </Modal.Header>
                              <Modal.Body closeButton>
                                <div class="notification-form">
                                  <div class="row">
                                    <div class="col-md-12">
                                      <div class="form-group mb-4">
                                        <label class="mb-0" for="AddCategory">
                                          {lang(
                                            "ContentManagement.FAQ.addCategory"
                                          )}
                                        </label>

                                        <input
                                          type="text"
                                          className="form-control"
                                          id="faqCategoryName"
                                          name="faqCategoryName"
                                          placeholder={`${lang(
                                            "ContentManagement.FAQ.addCategory"
                                          )}`}
                                          value={faqCategoryName}
                                          onChange={(e) => {
                                            setFaqCategoryName(e.target.value);
                                            errors = Object.assign(errors, {
                                              faqCategoryName: "",
                                            });
                                            setErrors(errors);
                                          }}
                                        />

                                        <span
                                          className="error-msg"
                                          style={{ color: "red" }}
                                        >
                                          {errors.faqCategoryName}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-md-12">
                                      <div class="modal-btn">
                                        <Link
                                          onClick={(event) =>
                                            addUpdateCategory(event)
                                          }
                                          class="btn btn-primary"
                                        >
                                          {faqCategoryID ? "Update" : "Add"}
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Modal.Body>
                            </Modal>
                          </div>
                          <div class="form-group mb-4">
                            <label class="mb-0" for="CountryName">
                              {lang("ContentManagement.FAQ.question")}
                              <sup className="text-danger">*</sup>
                            </label>

                            <input
                              type="text"
                              className="form-control"
                              id="faqQuestion"
                              name="faqQuestion"
                              placeholder="Add your question"
                              value={faqQuestion}
                              onChange={(e) => {
                                setFaqQuestion(e.target.value);
                                errors = Object.assign(errors, {
                                  faqQuestion: "",
                                });
                                setErrors(errors);
                              }}
                            />

                            <span
                              className="error-msg"
                              style={{ color: "red" }}
                            >
                              {errors.faqQuestion}
                            </span>
                          </div>
                        </div>
                        <div class="col-md-12">
                          <div class="form-group mb-4">
                            <label class="mb-0" for="CountryName">
                              {lang("ContentManagement.FAQ.answer")}
                              <sup className="text-danger">*</sup>
                            </label>

                            <textarea
                              type="text"
                              className="form-control"
                              style={{ height: "200px" }}
                              id="faqAnswer"
                              name="faqAnswer"
                              placeholder="Add your answer"
                              value={faqAnswer}
                              onChange={(e) => {
                                setFaqAnswer(e.target.value);
                                errors = Object.assign(errors, {
                                  faqAnswer: "",
                                });
                                setErrors(errors);
                              }}
                            />

                            <span
                              className="error-msg"
                              style={{ color: "red" }}
                            >
                              {errors.faqAnswer}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div class="modal-btn">
                            <Link
                              onClick={(event) => addUpdateFAQ(event)}
                              class="btn btn-primary"
                            >
                              {faqID ? "Update" : "Add"}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
            </div>
            <div className="card notification-card tabs-block p-0">
              <Tabs
                defaultActiveKey="faqList"
                id="uncontrolled-tab-example"
                className="pl-5 pt-3"
                onSelect={(evtKey) => setEventKey(evtKey)}
              >
                <Tab
                  eventKey="faqList"
                  title={`${lang("ContentManagement.FAQ.faqList")}`}
                >
                  <div className="card-body content faq-listing">
                    <div class="table-responsive">
                      <table className="table row-border nowrap common-datatable">
                        <thead>
                          <tr>
                            <th className="all">
                              <b>{lang("ContentManagement.FAQ.category")}</b>
                            </th>
                            <th className="all">
                              <b>{lang("ContentManagement.FAQ.question")}</b>
                            </th>
                            <th className="all">
                              <b>{lang("ContentManagement.FAQ.answer")}</b>
                            </th>
                            <th className="all">
                              <b>{lang("ContentManagement.FAQ.action")}</b>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {faqListing && faqListing.length === 0 ? (
                            <tr className="text-center text-danger not-found-txt">
                              <td colSpan="4">
                                {loading ? (
                                  <Loader />
                                ) : (
                                  <h6
                                    className="text-center text-danger not-found-txt"
                                    colSpan="4"
                                  >
                                    No records found!
                                  </h6>
                                )}
                              </td>
                            </tr>
                          ) : (
                            faqListing.map((item, listKey) => {
                              return (
                                <tr key={listKey}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <span>{item.faqCategoryName}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <span>{item.faqQuestion}</span>
                                  </td>
                                  <td>
                                    <span>
                                      {item.faqAnswer.slice(0, 150)}...
                                    </span>
                                  </td>
                                  <td>
                                    <div className="d-flex">
                                      {showEditOption && (
                                        <a
                                          className="cursor-pointer mr-3"
                                          onClick={() => {
                                            getAllFaqDetailsHandler(item._id);
                                            setFaqID(item._id);
                                          }}
                                        >
                                          <i className="bx bx-edit"></i>
                                        </a>
                                      )}
                                      {showDeleteOption && (
                                        <a
                                          className="cursor-pointer mr-3"
                                          onClick={() => deleteFaq(item._id)}
                                        >
                                          <i className="bx bx-trash-alt"></i>
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
                    </div>
                  </div>
                </Tab>
                <Tab
                  eventKey="faqCategory"
                  title={`${lang("ContentManagement.FAQ.faqCategory")}`}
                >
                  <div className="card-body content">
                    <div class="table-responsive">
                      <table
                        className="table row-border nowrap common-datatable"
                        id="master-timezone-listing"
                      >
                        <thead>
                          <tr>
                            <th className="all">
                              <b>Category</b>
                            </th>
                            <th className="all">
                              <b>Action</b>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoryListing && categoryListing.length === 0 ? (
                            <tr className="text-center text-danger not-found-txt">
                              <td colSpan="6">
                                {loading ? (
                                  <Loader />
                                ) : (
                                  <h6
                                    className="text-center text-danger not-found-txt"
                                    colSpan="6"
                                  >
                                    No Records found!
                                  </h6>
                                )}
                              </td>
                            </tr>
                          ) : (
                            categoryListing.map((item, key) => {
                              return (
                                <tr key={key}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <span>{item.faqCategoryName}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="d-flex">
                                      {showEditOption && (
                                        <a
                                          className="cursor-pointer mr-3"
                                          onClick={() => {
                                            getFAQCategoryDetails(item._id);
                                            setFaqCategoryID(item._id);
                                          }}
                                        >
                                          <i className="bx bx-edit"></i>
                                        </a>
                                      )}
                                      {showDeleteOption && (
                                        <a
                                          className="cursor-pointer"
                                          onClick={() =>
                                            deleteFaqCategory(item._id)
                                          }
                                        >
                                          <i className="bx bx-trash-alt"></i>
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
                    </div>
                  </div>
                </Tab>
              </Tabs>
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
  CmsPagesAccess: {edit:true,delete:true,create:true},
  // state.admin.adminData.staticRolePermission.cmsPagesAccess,
  language: state.admin.language,
});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, { callApi })(Faq);
