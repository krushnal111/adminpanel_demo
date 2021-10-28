import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as _ from "lodash";
import API from "../../api/Routes";
import Layout from "../../components/Layout/Layout";
import { callApi } from "../../api"; // Used for api call
import errorMessages from "../../utils/ErrorMessages";
import { connect } from "react-redux";
import { showMessageNotification } from "./../../utils/Functions"; //Utility functions
import { ADMIN_URL } from "../../config";

/******************* 
@Purpose : Used for add user role
@Parameter : props
@Author : INIC
******************/
function Roles(props) {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [, setIsFormValid] = useState("");
  const [userCheckbox] = useState([
    { id: 1, perm: "read" },
    { id: 2, perm: "edit" },
    { id: 3, perm: "create" },
    { id: 4, perm: "delete" },
  ]);
  const [userSelectList, setUserSelectList] = useState({
    category: "userAccess",
    read: false,
    edit: false,
    create: false,
    delete: false,
  });
  const [contentCheckbox] = useState([
    { id: 5, perm: "read" },
    { id: 6, perm: "edit" },
    { id: 7, perm: "create" },
    { id: 8, perm: "delete" },
  ]);
  const [contentSelectList, setContentSelectList] = useState({
    category: "cmsPagesAccess",
    read: false,
    edit: false,
    create: false,
    delete: false,
  });
  const [emailTempCheckBox] = useState([
    { id: 9, perm: "read" },
    { id: 10, perm: "edit" },
    { id: 11, perm: "create" },
    { id: 12, perm: "delete" },
  ]);
  const [emailTempList, setEmailTempList] = useState({
    category: "emailTemplateAccess",
    read: false,
    edit: false,
    create: false,
    delete: false,
  });
  let [errors, setErrors] = useState({});

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
  @Purpose : Used for save data
  @Parameter : {}
  @Author : INIC
  ******************/
  const handleSaveChanges = async () => {
    if (validateForm()) {
      let allPermissions = [
        { ...contentSelectList },
        { ...userSelectList },
        { ...emailTempList },
      ];
      let body = {
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
        showMessageNotification("Role added successfully", "success");
      } else {
        showMessageNotification("Something went wrong", "success");
      }
      props.history.push("/rolesList");
    }
  };
  /******************* 
  @Purpose : Used for handle content checkbox
  @Parameter : val
  @Author : INIC
  ******************/
  const handleContentCheckbox = (val) => {
    let tempList = { ...contentSelectList };

    if (tempList[val]) {
      if (
        val === "read" &&
        (tempList["create"] || tempList["edit"] || tempList["delete"])
      ) {
        tempList[val] = false;
        tempList["create"] = false;
        tempList["edit"] = false;
        tempList["delete"] = false;
      } else {
        tempList[val] = false;
      }
    } else {
      tempList[val] = true;
    }

    setContentSelectList(tempList);
  };
  /******************* 
  @Purpose : Used for handle email checkbox
  @Parameter : val
  @Author : INIC
  ******************/
  const handleEmailCheckbox = (val) => {
    let tempList = { ...emailTempList };

    if (tempList[val]) {
      if (
        val === "read" &&
        (tempList["create"] || tempList["edit"] || tempList["delete"])
      ) {
        tempList[val] = false;
        tempList["create"] = false;
        tempList["edit"] = false;
        tempList["delete"] = false;
      } else {
        tempList[val] = false;
      }
    } else {
      tempList[val] = true;
    }
    setEmailTempList(tempList);
  };
  /******************* 
  @Purpose : Used for handle checkbox
  @Parameter : val
  @Author : INIC
  ******************/
  const handleUserCheckbox = (val) => {
    let tempList = { ...userSelectList };

    if (tempList[val]) {
      if (
        val === "read" &&
        (tempList["create"] || tempList["edit"] || tempList["delete"])
      ) {
        tempList[val] = false;
        tempList["create"] = false;
        tempList["edit"] = false;
        tempList["delete"] = false;
      } else {
        tempList[val] = false;
      }
    } else {
      tempList[val] = true;
    }
    setUserSelectList(tempList);
  };
  /******************* 
  @Purpose : Used for multi select checkbox
  @Parameter : e
  @Author : INIC
  ******************/
  const handleMultiselect = (e) => {
    let val = e.target.value;
    let tempUser = { ...userSelectList };
    let tempEmail = { ...emailTempList };
    let tempContent = { ...contentSelectList };
    let tempPerms = ["read", "edit", "create", "delete"];
    let newArr = [];

    for (let i in tempUser) {
      tempPerms.forEach((item) => {
        if (item === i) {
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

    setUserSelectList(tempUser);
    setEmailTempList(tempEmail);
    setContentSelectList(tempContent);
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
                  Add Role
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
                                userSelectList["read"] &&
                                contentSelectList["read"] &&
                                emailTempList["read"]
                              }
                              onChange={(e) => handleMultiselect(e)}
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
                                userSelectList["edit"] &&
                                contentSelectList["edit"] &&
                                emailTempList["edit"]
                              }
                              onChange={(e) => handleMultiselect(e)}
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
                                userSelectList["create"] &&
                                contentSelectList["create"] &&
                                emailTempList["create"]
                              }
                              onChange={(e) => handleMultiselect(e)}
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
                                userSelectList["delete"] &&
                                contentSelectList["delete"] &&
                                emailTempList["delete"]
                              }
                              onChange={(e) => handleMultiselect(e)}
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
                      {userCheckbox.map((box, index) => {
                        return (
                          <td key={box.id}>
                            <div className="custom-checkbox">
                              <label htmlFor={box.id}>
                                <input
                                  type="checkbox"
                                  name="csscheckbox"
                                  id={box.id}
                                  checked={userSelectList[box.perm]}
                                  value={box.perm}
                                  onChange={() => handleUserCheckbox(box.perm)}
                                />
                                <span />
                              </label>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td>Content</td>
                      {contentCheckbox.map((box, index) => {
                        return (
                          <td key={box.id}>
                            <div className="custom-checkbox">
                              <label htmlFor={box.id}>
                                <input
                                  type="checkbox"
                                  name="csscheckbox"
                                  id={box.id}
                                  checked={contentSelectList[box.perm]}
                                  value={box.perm}
                                  onChange={() =>
                                    handleContentCheckbox(box.perm)
                                  }
                                />
                                <span />
                              </label>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td>Email Templates</td>
                      {emailTempCheckBox.map((box, index) => {
                        return (
                          <td key={box.id}>
                            <div className="custom-checkbox">
                              <label htmlFor={box.id}>
                                <input
                                  type="checkbox"
                                  name="csscheckbox"
                                  id={box.id}
                                  checked={emailTempList[box.perm]}
                                  value={box.perm}
                                  onChange={() => handleEmailCheckbox(box.perm)}
                                />
                                <span />
                              </label>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-right mt-md-5 mt-3">
              <button
                className="btn btn-primary mr-3"
                onClick={handleSaveChanges}
              >
                Save
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
export default connect(null, { callApi })(Roles);
