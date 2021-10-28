import React, { useEffect, useState, useRef } from "react";
import Layout from "../../components/Layout/Layout";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";
import moment from "moment";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { showMessageNotification, getItem } from "./../../utils/Functions"; //Utility functions
import BlogEditorEdit from "../../components/Editor/BlogEditorEdit";
import { callApi } from "../../api"; // Used for api call
import API from "../../api/Routes";
import { ADMIN_URL, IMG_URL } from "../../config";
import { useSorting } from "../../hooks";

/******************* 
@Purpose : Used for edit blog
@Parameter : props
@Author : INIC
******************/
function EditBlog(props) {
  const [lang] = useTranslation("language");
  const editorRef = useRef();
  const [blogCategory, setBlogCategory] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [metaKeyword, setMetaKeyword] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [postDate, setPostDate] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [, setPreview] = useState("");
  const [, setImageVisible] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [imageName, setImageName] = useState("");
  const [tags, setTags] = useState(["content", "general"]);
  const [blogStatus, setBlogStatus] = useState(false);
  const [blogCategoryListing, setBlogCategoryListing] = useState([]);
  const [, setCreatedBy] = useState("");
  const [, setCreatedById] = useState("");
  const [, setIsFormValid] = useState(true);
  const [pageTitle, setPageTitle] = useState("");
  const [page] = useState(1);
  const [pagesize] = useState(50);
  const [, sort] = useSorting();
  const [dateFormatUI, setDateFormatUI] = useState("");
  const [timeFormatUI, setTimeFormatUI] = useState("");
  const [timeZoneUI, setTimeZoneUI] = useState("");
  const blog_id = props.match.params.slug;
  const metaTitleTrackChanges = useRef(null);
  const metaKeywordTrackChanges = useRef(null);
  const metaDescriptionTrackChanges = useRef(null);
  const blogTitleTrackChanges = useRef(null);
  const pageTitleTrackChanges = useRef(null);
  let [errors, setErrors] = useState({});


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
    if (props.admindata && !_.isEmpty(props.admindata)) {
      let { firstname, lastname, _id } = props.admindata;
      setCreatedBy(firstname + " " + lastname);
      setCreatedById(_id);
    }
    if (blog_id) {
      getBlogDetails(blog_id);
    }
    fetchBlogCategories();
  }, [dateFormatUI,timeZoneUI]);
  /******************* 
  @Purpose : Used for blog title change
  @Parameter : e
  @Author : INIC
  ******************/
  const handleBlogTitleChange = (e) => {
    let maxChar = 70;
    blogTitleTrackChanges.current.textContent = `Maximum ${
      maxChar - e.target.value.length
    } characters is suitable`;
    setBlogTitle(e.target.value);
    errors = Object.assign(errors, { blogTitle: "" });
    setErrors(errors);
  };
  /******************* 
  @Purpose : Used for page title change
  @Parameter : e
  @Author : INIC
  ******************/
  const handlePageTitleChange = (e) => {
    let maxChar = 70;
    pageTitleTrackChanges.current.textContent = `Maximum ${
      maxChar - e.target.value.length
    } characters is suitable`;
    setPageTitle(e.target.value);
    errors = Object.assign(errors, { pageTitle: "" });
    setErrors(errors);
  };
  /******************* 
  @Purpose : Used for meta title change
  @Parameter : e
  @Author : INIC
  ******************/
  const handleMetaTitleChange = (e) => {
    let maxChar = 70;
    metaTitleTrackChanges.current.textContent = `Maximum ${
      maxChar - e.target.value.length
    } characters is suitable`;
    setMetaTitle(e.target.value);
    errors = Object.assign(errors, { metaTitle: "" });
    setErrors(errors);
  };
  /******************* 
  @Purpose : Used for meta keyword change
  @Parameter : e
  @Author : INIC
  ******************/
  const handleMetaKeywordChange = (e) => {
    let maxChar = 150;
    metaKeywordTrackChanges.current.textContent = `Maximum ${
      maxChar - e.target.value.length
    } characters is suitable`;
    setMetaKeyword(e.target.value);
    errors = Object.assign(errors, { metaKeyword: "" });
    setErrors(errors);
  };
  /******************* 
  @Purpose : Used for meta description change
  @Parameter : e
  @Author : INIC
  ******************/
  const handleMetaDescriptionChange = (e) => {
    let maxChar = 250;
    metaDescriptionTrackChanges.current.textContent = `Maximum ${
      maxChar - e.target.value.length
    } characters is suitable`;
    setMetaDescription(e.target.value);
    errors = Object.assign(errors, { metaDescription: "" });
    setErrors(errors);
  };
  /******************* 
  @Purpose : Used for image selector
  @Parameter : e
  @Author : INIC
  ******************/
  const selectImageHandler = async (e) => {
    let reader = new FileReader();
    let file = e.target.files[0];
    setImageName(file.name);
    setImage(file);
    reader.onloadend = () => {
      setImageVisible(true);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  /******************* 
  @Purpose : Used for image upload
  @Parameter : e
  @Author : INIC
  ******************/
  const fileUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", image);
    const response = await props.callApi(
      API.UPLOAD_FILE_BLOG,
      formData,
      "post",
      null,
      true,
      true,
      ADMIN_URL
    );
    if (response.status === 1) {
      setSelectedFile(response.data.filePath);
    }
  };
  /******************* 
  @Purpose : Used for get blog category
  @Parameter : {}
  @Author : INIC
  ******************/
  const fetchBlogCategories = async () => {
    let body = {
      page,
      pagesize,
      sort,
      columnKey: "blogCategoryListing",
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
    }
  };
  /******************* 
  @Purpose : Used for get blog details
  @Parameter : id
  @Author : INIC
  ******************/
  const getBlogDetails = async (id) => {
    const response = await props.callApi(
      API.GET_BLOG + id,
      "",
      "get",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      let {
        blogCategory: category,
        pageTitle: pTitle,
        blogTitle: bTitle,
        blogSlug: bSlug,
        metaTitle: mTitle,
        metaKeyword: mKeyword,
        metaDescription: mDescrp,
        caption: cap,
        image: img,
        tags: tag,
        status,
        postDate: pDate,
      } = response.data;
      let mergedDate;
      pDate = parseInt(pDate);
      // let body = {
      //   loginId: localStorage.getItem("accessToken"),
      // };
      // const responseDate = await props.callApi(
      //   API.GET_DATE_SETTINGS,
      //   body,
      //   "get",
      //   null,
      //   true,
      //   false,
      //   "http://localhost:4041/admin"
      // );
      // if (response.status === 1) {
      //   let { dateFormat, timeFormat, timeZone } = responseDate.data;
      //   setDateFormatUI(dateFormat);
      //   setTimeFormatUI(timeFormat);
      //   let timeZones = timeZone.split(" ")[1];
      //   if (timeFormat === "24 Hours") {
      //     mergedDate = moment(pDate)
      //       .tz(`${timeZones}`)
      //       .format(`${dateFormat} HH:mm `);
      //   } else {
      //     mergedDate = moment(pDate)
      //       .tz(`${timeZones}`)
      //       .format(`${dateFormat} h:mm A `);
      //   }
      //   pDate !== null ? setPostDate(mergedDate) : setPostDate(pDate);
      // }
      let timeZone = timeZoneUI.split(" ")[1];
      if (timeFormatUI === "24 Hours") {
        mergedDate = moment(pDate)
          .tz(`${timeZone}`)
          .format(`${dateFormatUI} HH:mm `);
      } else {
        mergedDate = moment(pDate)
          .tz(`${timeZone}`)
          .format(`${dateFormatUI} h:mm A `);
      }
      pDate !== null ? setPostDate(mergedDate) : setPostDate(pDate);
      setBlogCategory(category);
      setPageTitle(pTitle);
      setBlogTitle(bTitle);
      setBlogSlug(bSlug);
      setMetaKeyword(mKeyword);
      setMetaTitle(mTitle);
      setMetaDescription(mDescrp);
      setCaption(cap);
      setSelectedFile(img);
      setBlogStatus(status);
      setTags(tag);
    }
  };
  /******************* 
  @Purpose : Used for get validate form
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    let error = {
      pageTitle: "",
      blogTitle: "",
      blogSlug: "",
      metaTitle: "",
      metaKeyword: "",
      metaDescription: "",
      blogContent: "",
      caption: "",
    };
    let isFormValid = true;

    if (!pageTitle.trim()) error.pageTitle = "*Page title is required";
    else if (pageTitle.length > 70)
      error.pageTitle = "*Page title can't be more than 70 characters";
    else error.pageTitle = "";

    if (!blogTitle.trim()) error.blogTitle = "*Blog title is required";
    else if (blogTitle.length > 70)
      error.blogTitle = "*Blog title can't be more than 70 characters";
    else error.blogTitle = "";

    if (!blogSlug.trim()) error.blogSlug = "*Slug is required";
    else error.blogSlug = "";

    if (!metaTitle.trim()) error.metaTitle = "*Meta title is required";
    else error.metaTitle = "";

    if (!metaKeyword.trim()) error.metaKeyword = "*Meta keyword is required";
    else error.metaKeyword = "";

    if (!metaDescription.trim())
      error.metaDescription = "*Meta description is required";
    else error.metaDescription = "";

    if (!caption.trim()) error.caption = "*Content is required";
    else if (caption.length < 50)
      error.caption = "*Caption must contain minimum 50 characters";
    else error.caption = "";

    if (
      error.blogTitle !== "" ||
      error.blogSlug !== "" ||
      error.metaKeyword !== "" ||
      error.metaDescription !== "" ||
      error.caption !== "" ||
      error.metaTitle !== ""
    )
      isFormValid = false;

    setErrors(error);
    setIsFormValid(isFormValid);

    return isFormValid;
  };
  /******************* 
  @Purpose : Used for move/update listing
  @Parameter : e
  @Author : INIC
  ******************/
  const updateAndMoveToListing = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      let body = {
        id: blog_id,
        blogCategory,
        pageTitle,
        blogTitle,
        blogSlug,
        metaTitle,
        metaKeyword,
        metaDescription,
        caption,
        image: selectedFile,
        tags,
        status: blogStatus,
        postDate: new Date(postDate).getTime(),
      };

      const response = await props.callApi(
        API.ADD_UPDATE_BLOG,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        props.history.push(`/editBlog/editPreview/${blog_id}`);
      }
    }
  };
  /******************* 
  @Purpose : Used for update cms pages
  @Parameter : e
  @Author : INIC
  ******************/
  const updateCmsPage = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      let body = {
        id: blog_id,
        blogCategory,
        pageTitle,
        blogTitle: blogTitle.trim(),
        blogSlug,
        metaTitle,
        metaKeyword,
        metaDescription,
        caption,
        image: selectedFile,
        tags,
        status: blogStatus,
        postDate: new Date(postDate).getTime(),
      };

      const response = await props.callApi(
        API.ADD_UPDATE_BLOG,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Blog updated successfully", "success");
        setTimeout(() => {
          props.history.push("/blogListing");
        }, 1000);
      }
    }
  };
  /******************* 
  @Purpose : Used for ganarate page slug
  @Parameter : e
  @Author : INIC
  ******************/
  const handleSlugGenerator = async (e) => {
    setBlogTitle(e.target.value);
    let body = {
      blogSlugKey: blogTitle,
    };
    const response = await props.callApi(
      API.ADD_SLUG,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      setBlogSlug(response.blogSlug);
    } else {
      showMessageNotification(response.message, "error");
    }
  };
  /******************* 
  @Purpose : Used for add tags
  @Parameter : e
  @Author : INIC
  ******************/
  const addTags = (e) => {
    if (e.key === "Enter" && e.target.value !== "") {
      setTags([...tags, e.target.value]);
      e.target.value = "";
    }
  };
  /******************* 
  @Purpose : Used for remove tags
  @Parameter : index
  @Author : INIC
  ******************/
  const removeTags = (index) => {
    setTags([...tags.filter((tag) => tags.indexOf(tag) !== index)]);
  };
  /******************* 
  @Purpose : Used for get preview
  @Parameter : content
  @Author : INIC
  ******************/
  const getpreview = (content) => {
    setCaption(content);
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="content-header-title">Edit Page</li>
                <li className="breadcrumb-item">
                  <Link
                    onClick={() => {
                      props.history.push("/dashboard");
                    }}
                  >
                    <i className="bx bx-home-alt" />
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  {" "}
                  <Link
                    onClick={() => {
                      props.history.push("/blogListing");
                    }}
                  >
                    Blog Lists
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {lang("ContentManagement.CMS.edit")}
                </li>
              </ol>
            </nav>
            <div className="d-flex align-items-center justify-content-end mb-2 flex-wrap">
              <span className="author d-lg-none d-flex">
                {lang("ContentManagement.CMS.Author")}
              </span>
            </div>
            <div className="blog-content-block">
              <div className="card card-media">
                <div className="row">
                  <div className="col-md-4">
                    <React.Fragment>
                      <div className="form-group mb-0 d-flex align-items-center flex-wrap">
                        <div className="d-flex align-items-center mb-2">
                          <span className="imageselect-text">
                            Choose Image<sup className="text-danger">*</sup>
                          </span>
                          <label className="img-upload-square sm ml-2">
                            <input
                              type="file"
                              className="form-control-file text-primary d-none"
                              name="image"
                              id="file"
                              accept="image/*"
                              data-title="Drag and drop a file"
                              onChange={selectImageHandler}
                            />
                            <em className="bx bxs-edit-alt position-relative"></em>
                          </label>
                        </div>
                      </div>
                      <label>{imageName ? imageName : null}</label>
                      <div className="button-continer pull-right my-3">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={fileUpload}
                        >
                          {" "}
                          Upload Image
                        </button>
                      </div>
                      <div className="form-group mb-0 mt-3">
                        <label>{lang("ContentManagement.CMS.image")}</label>
                      </div>
                      <div className="row justify-content-between my-2">
                        <div className="col-md-12 select-image">
                          <div className="custom-select-image">
                            <img
                              src={
                                selectedFile
                                  ? ADMIN_URL+ IMG_URL + selectedFile
                                  : "/assets/images/icon/no-image-icon-0.jpg"
                              }
                              width="50px"
                              height="100px"
                              alt="icon"
                            />
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  </div>
                  <div className="col-md-8">
                    <div className="form-group mb-md-5 mb-3">
                      <label htmlFor="blogCategory">
                        {lang("ContentManagement.CMS.category")}
                        <sup className="text-danger">*</sup>
                      </label>
                      <select
                        className="form-control "
                        id="blogCategory"
                        name="blogCategory"
                        value={blogCategory}
                        onChange={(e) => setBlogCategory(e.target.value)}
                      >
                        {blogCategoryListing.map((item, key) => {
                          return (
                            <option
                              key={item._id}
                              value={item.blogCategoryTitle}
                              defaultValue={item.blogCategoryTitle}
                            >
                              {item.blogCategoryTitle}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="form-group mb-md-5 mb-3">
                      <label htmlFor="pageTitle">
                        Page Title<sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="pageTitle"
                        name="pageTitle"
                        placeholder="IndiaNIC Joins the Clutch 1000!"
                        value={pageTitle}
                        maxLength="70"
                        onChange={(e) => handlePageTitleChange(e)}
                      />
                      <small
                        id="pageTitle"
                        className="form-text"
                        ref={pageTitleTrackChanges}
                      >
                        Maximum {70 - pageTitle.length} characters is suitable
                      </small>
                      <span className="text-danger d-block">
                        {errors.pageTitle}
                      </span>
                    </div>
                    <div className="form-group mb-md-5 mb-3">
                      <label htmlFor="Title">
                        {lang("ContentManagement.CMS.blogTitle")}
                        <sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="blogTitle"
                        name="blogTitle"
                        maxLength="70"
                        placeholder="IndiaNIC Joins the Clutch 1000!"
                        value={blogTitle}
                        onChange={(e) => handleBlogTitleChange(e)}
                        onBlur={(e) => handleSlugGenerator(e)}
                      />
                      <small
                        id="blogTitle"
                        className="form-text"
                        ref={blogTitleTrackChanges}
                      >
                        Maximum {70 - blogTitle.length} characters is suitable
                      </small>
                      <span className="text-danger d-block">
                        {errors.blogTitle}
                      </span>
                    </div>
                    <div className="form-group mb-md-5 mb-3">
                      <label htmlFor="Slug">
                        {lang("ContentManagement.CMS.slug")}
                        <sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="blogSlug"
                        name="blogSlug"
                        placeholder="About Company"
                        value={blogSlug}
                        onChange={(e) => {
                          setBlogSlug(e.target.value);
                          errors = Object.assign(errors, { blogSlug: "" });
                          setErrors(errors);
                        }}
                      />
                      <span className="text-danger d-block">
                        {errors.blogSlug}
                      </span>
                    </div>
                    <div className="form-group mb-md-5 mb-3">
                      <label htmlFor="metaTitle">
                        {lang("ContentManagement.CMS.title")}
                        <sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="metaTitle"
                        name="metaTitle"
                        placeholder="Meta title"
                        value={metaTitle}
                        maxLength="70"
                        onChange={(e) => handleMetaTitleChange(e)}
                      />
                      <small
                        id="metaTitle"
                        className="form-text"
                        ref={metaTitleTrackChanges}
                      >
                        Maximum {70 - metaTitle.length} characters is suitable
                      </small>
                      <span className="text-danger d-block">
                        {errors.metaTitle}
                      </span>
                    </div>
                    <div className="form-group mb-md-5 mb-3">
                      <label htmlFor="MetaKeywords">
                        {lang("ContentManagement.CMS.metaKeywords")}
                        <sup className="text-danger">*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="metaKeyword"
                        name="metaKeyword"
                        placeholder="Keywords here!"
                        maxLength="150"
                        value={metaKeyword}
                        onChange={(e) => handleMetaKeywordChange(e)}
                      />
                      <small
                        id="MetaKeyword"
                        className="form-text"
                        ref={metaKeywordTrackChanges}
                      >
                        Maximum {150 - metaKeyword.length} characters is
                        suitable
                      </small>
                      <span className="text-danger d-block">
                        {errors.metaKeyword}
                      </span>
                    </div>
                    <div className="form-group mb-md-5 mb-3">
                      <label htmlFor="Description">
                        {lang("ContentManagement.CMS.metaDescription")}
                        <sup className="text-danger">*</sup>
                      </label>
                      <textarea
                        rows="6"
                        class="form-control"
                        placeholder="Describe this a bit"
                        id="metaDescription"
                        name="metaDescription"
                        value={metaDescription}
                        maxLength="250"
                        onChange={(e) => handleMetaDescriptionChange(e)}
                      />
                      <small
                        id="metaDescription"
                        className="form-text"
                        ref={metaDescriptionTrackChanges}
                      >
                        Maximum {250 - metaDescription.length} characters is
                        suitable
                      </small>
                      <span className="text-danger d-block">
                        {errors.metaDescription}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="content-img-block">
                  <div className="img-drag-section">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group mb-0">
                          <label htmlFor="caption">
                            {lang("ContentManagement.CMS.content")}
                            <sup className="text-danger">*</sup>
                          </label>
                          {
                            <BlogEditorEdit
                              className="form-control mx-auto"
                              editContent={caption}
                              ref={editorRef}
                              getPreview={getpreview}
                            />
                          }
                          <span className="text-danger d-block">
                            {errors.caption}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-end mt-3">
                  <div className="form-group">
                    <div className="button-group-container">
                      <a
                        className="btn btn-primary mr-3 mb-sm-0 mb-2"
                        onClick={(e) => {
                          updateAndMoveToListing(e);
                        }}
                      >
                        Preview
                      </a>
                      <a
                        className="btn btn-primary mr-3 mb-sm-0 mb-2"
                        onClick={(e) => {
                          updateCmsPage(e);
                        }}
                      >
                        {" "}
                        <span>Update</span>
                      </a>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => {
                          props.history.push("/blogListing");
                        }}
                      >
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="blog-sidebar">
              <div className="card card-profile">
                <div className="form-group">
                  <label>{lang("ContentManagement.CMS.postDate")}</label>
                  <div className="row">
                    <div className="col-md-12">
                      <fieldset className="form-group position-relative has-icon-left">
                        <Datetime
                          className="d-block w-100"
                          inputProps={{
                            placeholder: "Select date & time",
                          }}
                          dateFormat={dateFormatUI}
                          timeFormat={
                            timeFormatUI === "24 Hours" ? "HH:mm" : "h:mm A"
                          }
                          value={postDate ? new Date(postDate) : ""}
                          onChange={(date) => setPostDate(date)}
                        />
                      </fieldset>
                    </div>
                  </div>
                </div>
                <div className="form-group site-logo">
                  <label htmlFor="tag">
                    {lang("ContentManagement.CMS.tag")}
                  </label>
                  <div className="tags-input">
                    <ul id="tags">
                      {tags.map((tag, index) => (
                        <li key={index} className="tag">
                          <span className="tag-title">{tag}</span>
                          <span
                            className="tag-close-icon"
                            onClick={() => removeTags(index)}
                          >
                            x
                          </span>
                        </li>
                      ))}
                    </ul>
                    <input
                      type="text"
                      className="form-control"
                      id="tag"
                      onKeyUp={(e) => (e.key = "Enter" ? addTags(e) : null)}
                      placeholder="Press enter to add tags"
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <label className="mb-0">
                    {lang("ContentManagement.CMS.status")}
                  </label>
                  <span>
                    <div className="custom-control custom-switch light">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="blogStatus"
                        checked={blogStatus}
                        onChange={() => setBlogStatus(!blogStatus)}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="blogStatus"
                      />
                    </div>
                  </span>
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
export default connect(mapStateToProps, { callApi })(EditBlog);
