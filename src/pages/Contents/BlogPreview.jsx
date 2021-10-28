import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { callApi } from "../../api"; // Used for api call
import API from "../../api/Routes";
import { IMG_URL,ADMIN_URL } from "../../config";
import parser from "html-react-parser";
import { showMessageNotification } from "./../../utils/Functions"; // Utility functions
import swal from "sweetalert";
import moment from "moment";
import "moment-timezone";
import { useSorting } from "../../hooks";
import Loader from "../../components/Loader/Loader";

/******************* 
@Purpose : Used for get blog preview
@Parameter : props
@Author : INIC
******************/
function BlogPreview(props) {
  const [page] = useState(1);
  const [pagesize] = useState(10);
  const [, sort] = useSorting();
  const [blogListing, setBlogListing] = useState([]);
  const [dateFormatUI, setDateFormatUI] = useState("");
  const [timeFormatUI, setTimeFormatUI] = useState("");
  const [timeZoneUI, setTimeZoneUI] = useState("");
  const [loading, setLoading] = useState(true);
  const blogId = props.match.params.slug;

  useEffect(() => {
    getAllBlogs();
  }, []);

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

  /******************* 
  @Purpose : Used for get all blog
  @Parameter : filterObj
  @Author : INIC
  ******************/
  const getAllBlogs = async (filterObj) => {
    var body = {
      page,
      pagesize,
      sort,
      columnKey: "blogListing",
      filter: filterObj ? filterObj : "",
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
        setLoading(false);
      }
  };
  /******************* 
  @Purpose : Date Time TimeZone Conversion based on setting in General Settings
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
  @Purpose : delete cms
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
          setTimeout(() => {
            props.history.push("/blogListing");
          }, 1000);
          getAllBlogs();
        }
      }
    });
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
                  <Link
                    onClick={() => {
                      props.history.push("/dashboard");
                    }}
                  >
                    <i className="bx bx-home-alt" />
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link
                    onClick={() => {
                      props.history.push("/blogListing");
                    }}
                  >
                    Blog Lists
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Blog Preview
                </li>
              </ol>
            </nav>

            <div className="blog-page">
              <div className="container">
                {loading ? (
                  <Loader />
                ) : (
                  blogListing.length &&
                  blogListing
                    .filter((item, key) => item._id === blogId)
                    .map((item, key) => {
                      return (
                        <div className="blog-content">
                          <head>
                            <meta name="meta-title" content={item.metaTitle} />
                            <meta
                              name="meta-keyword"
                              content={item.metaKeyword}
                            />
                            <meta
                              name="meta-description"
                              content={item.metaDescription}
                            />
                          </head>
                          <div className="blog-title mb-3 inner-width text-left d-flex align-items-center justify-content-between">
                            {item.blogTitle}

                            <div className="edit-btns">
                              <Link
                                className="btn btn-primary mr-0 mr-sm-2"
                                onClick={() => {
                                  props.history.push(`/editBlog/${blogId}`);
                                }}
                              >
                                Edit
                              </Link>
                              <Link
                                className="btn btn-light-primary"
                                onClick={() => {
                                  deleteCms(blogId);
                                }}
                              >
                                Delete
                              </Link>
                            </div>
                          </div>
                          <div className="blog-meta mb-5 inner-width text-left">
                            By {item.createdBy} posted on{" "}
                            {item.postDate
                              ? getDateTimeFormat(parseInt(item.postDate))
                              : null}{" "}
                            ,in {item.blogCategory}
                          </div>
                          <div className="hero-img mb-5 text-center inner-width">
                            <img
                              src={ADMIN_URL+ IMG_URL + item.image}
                              alt="blog"
                              className="w-100"
                            />
                          </div>
                          <div className="blog-description inner-width">
                            <p>{parser(item.caption)}</p>
                          </div>
                        </div>
                      );
                    })
                )}
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
export default connect(mapStateToProps, { callApi })(BlogPreview);
