import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { callApi } from "../../api"; // Used for api call
import { Link } from "react-router-dom";
import Select from "react-select";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import errorMessages from "../../utils/ErrorMessages";
import API from "../../api/Routes";
import "react-datepicker/dist/react-datepicker.css";
import Layout from "../../components/Layout/Layout";
import { showMessageNotification } from "./../../utils/Functions"; //Utility functions
import { ADMIN_URL } from "../../config";

/******************* 
@Purpose : Used for user management (add user) page
@Parameter : props
@Author : INIC
******************/
function AddAdminUser(props) {
  const [lang] = useTranslation("language");
  let [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(true);
  const [rolesList, setRolesList] = useState("");
  const [page] = useState(1);
  const [pageSize] = useState(100);
  const [, setIsFormValid] = useState("");
  let [errors, setErrors] = useState("");

  useEffect(() => {
    getAllRoles();
  }, []);
  /******************* 
  @Purpose : Used for get all roles
  @Parameter : {}
  @Author : INIC
  ******************/
  const getAllRoles = async () => {
    let body = { page, pagesize: pageSize };
    setLoading(true);
    const response = await props.callApi(
      API.LIST_ROLES,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      setRolesList(
        response.data.listing.map((el) => {
          return {
            value: el._id,
            label: el.role,
          };
        })
      );
      setLoading(false);
    }
  };
  /******************* 
  @Purpose : Used for validate form field
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    let errors = { firstName: "", lastName: "", email: "", role: "" };
    let isFormValid = true;

    if (isEmpty(firstName)) errors.firstName = errorMessages.PROVIDE_FIRST_NAME;
    else errors.firstName = "";

    if (isEmpty(lastName)) errors.lastName = errorMessages.PROVIDE_LAST_NAME;
    else errors.lastName = "";

    if (isEmpty(email)) errors.email = errorMessages.PROVIDE_EMAIL;
    else errors.email = "";

    if (isEmpty(role)) errors.role = errorMessages.PROVIDE_ROLE;
    else errors.role = "";

    if (isEmpty(mobile.split("-")[1]))
      errors.mobile = errorMessages.PROVIDE_MOBILE_NUMBER;
    else errors.mobile = "";

    if (
      errors.firstName !== "" ||
      errors.lastName !== "" ||
      errors.email !== "" ||
      errors.role !== ""
    )
      isFormValid = false;
    else isFormValid = true;

    setErrors(errors);
    setIsFormValid(isFormValid);

    return isFormValid;
  };
  /******************* 
  @Purpose : Used for handle add admin process
  @Parameter : {}
  @Author : INIC
  ******************/
  const addAdminHandler = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      let body = {
        firstname: firstName,
        lastname: lastName,
        emailId: email,
        role: role.value,
        status,
      };

      setLoading(true);
      try {
        const response = await props.callApi(
          API.ADD_ADMIN,
          body,
          "post",
          "",
          true,
          false,
          ADMIN_URL
        );
        if (response.status === 1) {
          showMessageNotification("Details successfully", "success")
          props.history.push("/adminusers");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw error;
      }
    }
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block">
            <form>
              <div className="d-flex align-items-center justify-content-between flex-wrap">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="content-header-title">Admin Users</li>
                    <li className="breadcrumb-item">
                      <Link onClick={() => props.history.push("/dashboard")}>
                        <i className="bx bx-home-alt" />
                      </Link>
                    </li>
                    <li className="breadcrumb-item active">
                      <Link onClick={() => props.history.push("/adminusers")}>
                        Admin Users
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Add User
                    </li>
                  </ol>
                </nav>
                <div className="btn-blocks mb-md-0 mb-2">
                  <button
                    className="btn btn-primary glow-primary mr-3"
                    onClick={(e) => addAdminHandler(e)}
                  >
                    <em className="bx bx-revision mr-2" />
                    {loading ? "Adding" : "Add"}
                  </button>
                </div>
              </div>
              <div class="card profile-card mb-5">
                <div className="row">
                  <div className="col-md-10">
                    <div className="row">
                      <div className="col-md-6 mt-3">
                        <div className="user-title-info user-details">
                          <div className="form-group d-flex align-items-center mb-md-4 mb-3">
                            <label className="mb-0" htmlFor="firstName">
                              {
                                lang("Usermanagement.edituser.labels.firsname")
                              }
                              <sup className="text-danger">*</sup>
                            </label>
                            <div className="w-100">
                              <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                name="firstName"
                                placeholder={
                                  lang("Usermanagement.edituser.labels.firsname")
                                }
                                value={firstName}
                                onChange={(e) => {
                                  setFirstName(e.target.value);
                                  errors = Object.assign(errors, {
                                    firstName: "",
                                  });
                                  setErrors(errors);
                                }}
                              />
                              <span className="text-danger d-block">
                                {errors.firstName}
                              </span>
                            </div>
                          </div>

                          <div className="form-group d-flex align-items-center mb-md-4 mb-3">
                            <label className="mb-0" htmlFor="email">
                              {
                                lang("Usermanagement.edituser.labels.email")
                              }
                              <sup className="text-danger">*</sup>
                            </label>
                            <div className="w-100">
                              <input
                                className="form-control"
                                id="email"
                                name="email"
                                placeholder={
                                  lang("Usermanagement.edituser.labels.email")
                                }
                                type="email"
                                value={email}
                                onChange={(e) => {
                                  setEmail(e.target.value);
                                  errors = Object.assign(errors, {
                                    email: "",
                                  });
                                  setErrors(errors);
                                }}
                              />
                              <span className="text-danger d-block">
                                {errors.email}
                              </span>
                            </div>
                          </div>

                          <div className="form-group d-flex align-items-center mb-md-4 mb-3">
                            <label className="mb-0" htmlFor="status">
                              {
                                lang("Usermanagement.edituser.labels.status")
                              }
                              <sup className="text-danger">*</sup>
                            </label>

                            <div class="custom-control custom-switch light w-100">
                              <input
                                type="checkbox"
                                class="custom-control-input"
                                id="checkbox1"
                                onChange={() => setStatus(!status)}
                                checked={status ? status : false}
                              />
                              <label
                                class="custom-control-label"
                                htmlFor="checkbox1"
                              ></label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-5 mt-3">
                        <div className="user-title-info user-details">
                          <div className="form-group d-flex align-items-center mb-md-4 mb-3">
                            <label className="mb-0" htmlFor="lastName">
                              {
                                lang("Usermanagement.edituser.labels.lastname")
                              }
                              <sup className="text-danger">*</sup>
                            </label>
                            <div className="w-100">
                              <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                name="lastName"
                                placeholder={
                                  lang("Usermanagement.edituser.labels.lastname")
                                }
                                value={lastName}
                                onChange={(e) => {
                                  setLastName(e.target.value);
                                  errors = Object.assign(errors, {
                                    lastName: "",
                                  });
                                  setErrors(errors);
                                }}
                              />

                              <span className="text-danger d-block">
                                {errors.lastName}
                              </span>
                            </div>
                          </div>

                          <div className="form-group d-flex align-items-center mb-md-4 mb-3">
                            <label className="mb-0" htmlFor="role">
                              {lang("Usermanagement.edituser.labels.role")}
                              <sup className="text-danger">*</sup>
                            </label>
                            <div className="w-100">
                              <Select
                                className="selectpicker w-100"
                                id="role"
                                name="role"
                                value={role}
                                options={rolesList}
                                onChange={(e) => {
                                  setRole(e);
                                  errors = Object.assign(errors, {
                                    role: "",
                                  });
                                  setErrors(errors);
                                }}
                              ></Select>
                              <span className="text-danger d-block">
                                {errors.role}{" "}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <footer>
            <div className="footer-text d-flex align-items-centerf justify-content-between">
              <span className="d-block">2020 © IndiaNIC</span>
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
  language: state.admin.language,
});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, { callApi })(AddAdminUser);
