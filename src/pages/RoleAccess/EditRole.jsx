import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as _ from "lodash";
import API from "../../api/Routes";
import Layout from "../../components/Layout/Layout";
import { callApi } from "../../api"; // Used for api call
import errorMessages from "../../utils/ErrorMessages";
import { connect } from "react-redux";
import { showMessageNotification } from "./../../utils/Functions"; //Utility functions
import LoaderShort from "../../components/Loader/LoaderShort";
import { ADMIN_URL } from "../../config";
/******************* 
@Purpose : Used for edit user role
@Parameter : props
@Author : INIC
******************/
function EditRole(props) {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [, setIsFormValid] = useState("");
  const [contentPermissions, setContentPermissions] = useState([]);
  const [emailTempPermissions, setEmailTempPermissions] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  let [errors, setErrors] = useState({});
  const roleId = props.match.params.slug;

  useEffect(() => {
    getPermissionDetails(roleId);
  }, [roleId]);
  /******************* 
  @Purpose : Used for handle permisiion
  @Parameter : id
  @Author : INIC
  ******************/
  const getPermissionDetails = async (id) => {
    setLoading(false);
    const response = await props.callApi(
      API.GET_ROLE_PERMISSION + id,
      "",
      "get",
      null,
      true,
      false,
      ADMIN_URL
    );
    let { role, description, permissions } = response.data;
    if (response.status === 1) {
      setRoleName(role);
      setDescription(description);
      permissions.forEach((eachItem) => {
        if (eachItem.category === "cmsPagesAccess") {
          setContentPermissions(eachItem);
        } else if (eachItem.category === "userAccess") {
          setUserPermissions(eachItem);
        } else if (eachItem.category === "emailTemplateAccess") {
          setEmailTempPermissions(eachItem);
        }
      });
    } else {
      showMessageNotification("Something went wrong", "error");
    }
    setLoading(true);
  };
  /******************* 
  @Purpose : Used for validate form
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateForm = () => {
    let errors = { roleName: "", description: "" };
    let isFormValid = true;

    if (_.isEmpty(roleName)) errors.roleName = errorMessages.PROVIDE_ROLENAME;
    else errors.roleName = "";

    if (_.isEmpty(description))
      errors.description = errorMessages.PROVIDE_DESCRIPTION;
    else errors.description = "";

    if (errors.roleName !== "" || errors.description !== "")
      isFormValid = false;
    else isFormValid = true;

    setErrors(errors);
    setIsFormValid(isFormValid);

    return isFormValid;
  };
  /******************* 
  @Purpose : Used for update data
  @Parameter : {}
  @Author : INIC
  ******************/
  const handleUpdateChanges = async () => {
    if (validateForm()) {
      let allPermissions = [
        { ...userPermissions },
        { ...contentPermissions },
        { ...emailTempPermissions },
      ];

      let body = {
        id: roleId,
        role: roleName,
        description,
        permissions: allPermissions,
      };
      const response = await props.callApi(
        API.ADD_ROLE,
        body,
        "POST",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Role udpated successfully", "success");
        props.history.push("/rolesList");
      } else {
        showMessageNotification("Something went wrong", "error");
      }
    }
  };
  /******************* 
  @Purpose : Used for render user permission
  @Parameter : moduleName
  @Author : INIC
  ******************/
  const renderPermissions = (moduleName) => {
    return _.compact(
      Object.keys(moduleName).map(function (key) {
        if (
          key === "read" ||
          key === "edit" ||
          key === "create" ||
          key === "delete"
        ) {
          return (
            <td key={`${key}_${moduleName["category"]}`}>
              <div className="custom-checkbox">
                <label htmlFor={`${key}_${moduleName["category"]}`}>
                  <input
                    type="checkbox"
                    name="csscheckbox"
                    id={`${key}_${moduleName["category"]}`}
                    checked={moduleName[key]}
                    value={key}
                    onChange={() => handleCheckbox(key, moduleName)}
                  />
                  <span />
                </label>
              </div>
            </td>
          );
        }
      })
    );
  };
  /******************* 
  @Purpose : Used for handle checkbox
  @Parameter : key, module
  @Author : INIC
  ******************/
  const handleCheckbox = (key, module) => {
    let tempPerm = { ...module };

    if (tempPerm[key]) {
      if (
        key === "read" &&
        (tempPerm["create"] || tempPerm["edit"] || tempPerm["delete"])
      ) {
        tempPerm[key] = false;
        tempPerm["create"] = false;
        tempPerm["edit"] = false;
        tempPerm["delete"] = false;
      } else {
        tempPerm[key] = false;
      }
    } else {
      tempPerm[key] = true;
    }

    if (module === userPermissions) {
      setUserPermissions(tempPerm);
    } else if (module === contentPermissions) {
      setContentPermissions(tempPerm);
    } else if (module === emailTempPermissions) {
      setEmailTempPermissions(tempPerm);
    }
  };
  /******************* 
  @Purpose : Used for handle multi checkbox
  @Parameter : key, module
  @Author : INIC
  ******************/
  const handleMultiCheckbox = (val) => {
    let tempUser = { ...userPermissions };
    let tempContent = { ...contentPermissions };
    let tempEmail = { ...emailTempPermissions };

    let tempPerms = ["read", "edit", "create", "delete"];
    let newArr = [];

    for (let i in tempUser) {
      tempPerms.forEach((item) => {
        if (i === item) {
          newArr.push(tempUser[i]);
        }
      });
    }

    if (val === "read" && newArr.includes(true)) {
      tempPerms.forEach((el) => {
        if (el === "read") {
          if (tempUser[el] && tempContent[el] && tempEmail[el]) {
            tempUser[el] = false;
            tempContent[el] = false;
            tempEmail[el] = false;
          } else {
            tempUser[el] = true;
            tempContent[el] = true;
            tempEmail[el] = true;
          }
        } else {
          tempUser[el] = false;
          tempContent[el] = false;
          tempEmail[el] = false;
        }
      });
    } else if (tempUser[val] && tempContent[val] && tempEmail[val]) {
      tempUser[val] = false;
      tempContent[val] = false;
      tempEmail[val] = false;
    } else {
      tempUser[val] = true;
      tempContent[val] = true;
      tempEmail[val] = true;
    }

    setUserPermissions(tempUser);
    setContentPermissions(tempContent);
    setEmailTempPermissions(tempEmail);
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="content-header-title">
                  Roles &amp; Permissions
                </li>
                <li className="breadcrumb-item">
                  <Link onClick={() => props.history.push("/dashboard")}>
                    <i className="bx bx-home-alt" />
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link onClick={() => props.history.push("/rolesList")}>
                    Roles &amp; Permissions
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Edit Role
                </li>
              </ol>
            </nav>
            <div className="card role-card mb-md-5 mb-3">
              <form>
                <div className="form-group mb-md-4 mb-3">
                  <label htmlFor="Name">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="Name"
                    placeholder="Give role a name"
                    value={roleName}
                    onChange={(e) => {
                      setRoleName(e.target.value);
                      errors = Object.assign(errors, { roleName: "" });
                      setErrors(errors);
                    }}
                  />
                  <span className="error-msg" style={{ color: "red" }}>
                    {errors.roleName}
                  </span>
                </div>
                <div className="form-group mb-0">
                  <label htmlFor="Description">Description (Optional)</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    id="Description"
                    placeholder="Describe this role a bit"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      errors = Object.assign(errors, { description: "" });
                      setErrors(errors);
                    }}
                  />
                  <span className="error-msg" style={{ color: "red" }}>
                    {errors.description}
                  </span>
                </div>
              </form>
            </div>
            <div className="card role-card p-0">
              <div className="table-responsive">
                {loading ? (
                  <table className="role-table w-100">
                    <thead>
                      <tr>
                        <th>Module Permission</th>
                        <th>
                          <div className="custom-checkbox">
                            <label htmlFor="read">
                              <input
                                type="checkbox"
                                name="csscheckbox"
                                id="read"
                                value="read"
                                checked={
                                  userPermissions["read"] &&
                                  contentPermissions["read"] &&
                                  emailTempPermissions["read"]
                                }
                                onChange={(e) =>
                                  handleMultiCheckbox(e.target.value)
                                }
                              />
                              <span />
                              View
                            </label>
                          </div>
                        </th>
                        <th>
                          <div className="custom-checkbox">
                            <label htmlFor="edit">
                              <input
                                type="checkbox"
                                name="csscheckbox"
                                id="edit"
                                value="edit"
                                checked={
                                  userPermissions["edit"] &&
                                  contentPermissions["edit"] &&
                                  emailTempPermissions["edit"]
                                }
                                onChange={(e) =>
                                  handleMultiCheckbox(e.target.value)
                                }
                              />
                              <span />
                              Update
                            </label>
                          </div>
                        </th>
                        <th>
                          <div className="custom-checkbox">
                            <label htmlFor="create">
                              <input
                                type="checkbox"
                                name="csscheckbox"
                                id="create"
                                value="create"
                                checked={
                                  userPermissions["create"] &&
                                  contentPermissions["create"] &&
                                  emailTempPermissions["create"]
                                }
                                onChange={(e) =>
                                  handleMultiCheckbox(e.target.value)
                                }
                              />
                              <span />
                              Create
                            </label>
                          </div>
                        </th>
                        <th>
                          <div className="custom-checkbox">
                            <label htmlFor="delete">
                              <input
                                type="checkbox"
                                name="csscheckbox"
                                id="delete"
                                value="delete"
                                checked={
                                  userPermissions["delete"] &&
                                  contentPermissions["delete"] &&
                                  emailTempPermissions["delete"]
                                }
                                onChange={(e) =>
                                  handleMultiCheckbox(e.target.value)
                                }
                              />
                              <span />
                              Delete
                            </label>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>User</td>
                        {renderPermissions(userPermissions)}
                      </tr>
                      <tr>
                        <td>Content</td>
                        {renderPermissions(contentPermissions)}
                      </tr>
                      <tr>
                        <td>Email Templates</td>
                        {renderPermissions(emailTempPermissions)}
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <LoaderShort />
                )}
              </div>
            </div>
            <div className="text-right mt-md-5 mt-3">
              <button
                className="btn btn-primary mr-3"
                onClick={handleUpdateChanges}
              >
                Update
              </button>
              <button
                className="btn btn-light-secondary"
                onClick={() => props.history.push("/rolesList")}
              >
                Cancel
              </button>
            </div>
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
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(null, { callApi })(EditRole);
