import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { callApi } from "../../api"; // Used for api call
import API from "../../api/Routes";
import { ADMIN_URL, IMG_URL } from "../../config";
import parser from "html-react-parser";
import moment from "moment";
import swal from "sweetalert";
import Loader from "../../components/Loader/Loader";
import { showMessageNotification } from "./../../utils/Functions"; //Utility functions
import { useSorting } from "../../hooks";
/******************* 
@Purpose : Used for static page preivew
@Parameter : props
@Author : INIC
******************/
function StaticPagePreview(props) {
  const [page] = useState(1);
  const [pagesize] = useState(10);
  const [, sort] = useSorting();
  const [blogListing, setBlogListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFormatUI, setDateFormatUI] = useState("");
  const [timeFormatUI, setTimeFormatUI] = useState("");
  const [timeZoneUI, setTimeZoneUI] = useState("");
  const blogStaticId = props.match.params.slug;

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
  @Purpose : Used for delete blog
  @Parameter : id
  @Author : INIC
  ******************/
  const deleteBlog = (id) => {
    swal({
      title: "Are you sure,You Want To Delete ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        var body = { ids: [id] };
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
          setTimeout(() => {
            props.history.push("/staticPage");
          }, 1000);
          getAllBlogs();
        }
      }
    });
  };
  /******************* 
  @Purpose : Used for get all blogs
  @Parameter : filterObj
  @Author : INIC
  ******************/
  const getAllBlogs = async (filterObj) => {
    var body = {
      page,
      pagesize,
      sort,
      columnKey: "cmsListing",
      filter: filterObj ? filterObj : "",
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
      setLoading(false);
    }
  };
  /******************* 
  @Purpose : Used for Date Time TimeZone Conversion based on setting in General Settings
  @Parameter : filterObj
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
                      props.history.push("/staticPage");
                    }}
                  >
                    Static Pages
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Static Preview
                </li>
              </ol>
            </nav>

            <div className="blog-page">
              <div className="back-btn d-flex align-items-center mb-3"></div>
              <div className="container">
                {loading ? (
                  <Loader />
                ) : (
                  blogListing.length &&
                  blogListing
                    .filter((item, key) => item._id === blogStaticId)
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
                            {item.pageTitle}

                            <div className="edit-btns">
                              <Link
                                className="btn btn-primary mr-0 mr-sm-2"
                                onClick={() =>
                                  props.history.push(
                                    `/editStatic/${blogStaticId}`
                                  )
                                }
                              >
                                Edit
                              </Link>
                              <Link
                                className="btn btn-light-primary"
                                onClick={() => deleteBlog(blogStaticId)}
                              >
                                Delete
                              </Link>
                            </div>
                          </div>
                         
                          <div className="blog-description inner-width">
                            <p>{parser(item.gjsHtml)}</p>
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
export default connect(mapStateToProps, { callApi })(StaticPagePreview);
