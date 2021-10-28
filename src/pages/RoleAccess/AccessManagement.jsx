import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { connect } from "react-redux";
import "antd/dist/antd.css";
import { Select } from "antd";
import Pagination from "rc-pagination";
import { editUser } from "../../store/Actions";
import { callApi } from "../../api"; // Used for api call
import Loader from "../../components/Loader/Loader";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import API from "../../api/Routes";
import { showMessageNotification } from "./../../utils/Functions"; //Utility functions
import { ADMIN_URL } from "../../config";
var { Option } = Select;
/******************* 
@Purpose : Used for Access managements view
@Parameter : props
@Author : INIC
******************/
function AccessManagement(props) {
  const [rolesList, setRolesList] = useState([]);
  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [total, setTotal] = useState(1);
  const [length, setLength] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterArray] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isCheckboxSelected, setIsCheckBoxSelected] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [toggleStatus, setToggleStatus] = useState(false);

  useEffect(() => {
    getAllRoles();
  }, [page, pagesize]);

  /******************* 
  @Purpose : Used for get user role
  @Parameter : {}
  @Author : INIC
  ******************/
  const getAllRoles = async () => {
    let body = { page, pagesize };
    if (filterArray.length) body["filter"] = filterArray;

    const response = await props.callApi(
      API.LIST_ROLES,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1 && response.data && response.data?.listing?.length) {
      setRolesList(
        response.data.listing.map((item) => ({ ...item, isChecked: false }))
      );
      setTotal(response.total);
      setLength(response.data.listing.length);
      setLoading(false);
    } else {
      setTotal(0);
      setLength(0);
      setLoading(false);
    }
  };
  /******************* 
  @Purpose : Used for role change
  @Parameter : status, userId
  @Author : INIC
  ******************/
  const handleRoleStatus = async (status, userId) => {
    var body = { ids: [userId], status };
    const response = await props.callApi(
      API.CHANGE_ROLE_STATUS,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      showMessageNotification("Status updated successfully", "success");
      getAllRoles();
    }
  };
  /******************* 
  @Purpose : Used for delete role
  @Parameter : id
  @Author : INIC
  ******************/
  const handleDeleteRole = (id) => {
    swal({
      title: "Are you sure, you want to delete?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        let body;
        body = { ids: [id] };
        const response = await props.callApi(
          API.DELETE_ROLE,
          body,
          "post",
          null,
          true,
          false,
          ADMIN_URL
        );
        if (response.status === 1) {
          getAllRoles();
          showMessageNotification("Role deleted successfully", "success");
          
        }
      }
    });
  };
  /******************* 
  @Purpose : Used for search handle
  @Parameter : {}
  @Author : INIC
  ******************/
  const searchHandler = async () => {
    let body = {
      page,
      pagesize,
      searchText: searchText && searchText.length > 1 ? searchText : "",
    };
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
      setRolesList(response.data.listing);
      setTotal(response.data.total);
    }
  };
  /******************* 
  @Purpose : Used for display pagination by role
  @Parameter : page, pagesize
  @Author : INIC
  ******************/
  const rolePagination = (page, pagesize) => {
    setPage(page);
    setPagesize(pagesize);
    getAllRoles();
  };
  /******************* 
  @Purpose : Used for clear form field data
  @Parameter : {}
  @Author : INIC
  ******************/
  const clearInput = () => {
    setSearchText("");
    getAllRoles();
  };
  /******************* 
  @Purpose : Used for change checkbox
  @Parameter : e
  @Author : INIC
  ******************/
  const handleChangeCheckbox = (e) => {
    let tempList = [...rolesList];
    let checkedAll = allChecked;
    if (e.target.value === "checkAll") {
      tempList.forEach((item) => {
        item.isChecked = e.target.checked;
        checkedAll = e.target.checked;
      });
    } else {
      tempList.find(({ _id }) => _id === e.target.value).isChecked =
        e.target.checked;
      let newList = tempList.filter((item) => item.isChecked);
      if (newList.length === tempList.length) {
        checkedAll = true;
      } else {
        checkedAll = false;
      }
    }

    setRolesList(tempList);
    setAllChecked(checkedAll);
    setIsCheckBoxSelected(rolesList.filter((el) => el.isChecked));
  };
  /******************* 
  @Purpose : Used for toggle change
  @Parameter : {}
  @Author : INIC
  ******************/
  const toggleStatusHandler = () => {
    setToggleStatus(!toggleStatus);
    let tempList = rolesList;
    setRolesList(tempList);
    bulkStatusChange();
  };
  /******************* 
  @Purpose : Used for bulk toggle change
  @Parameter : {}
  @Author : INIC
  ******************/
  const bulkStatusChange = () => {
    let tempList = rolesList.filter(({ isChecked }) => isChecked);
    tempList.forEach((item) => (item.status = !item.status));

    if (rolesList.length > 0) {
      showMessageNotification("Status updated successfully", "success");
    }
    setAllChecked(false);
    setIsCheckBoxSelected([]);
    let newList = rolesList.map((item) => ({ ...item, isChecked: false }));
    setRolesList(newList);
  };

  const numbers = [2, 5, 10, 15, 25, 50, 100].filter(
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
                <li className="content-header-title">
                  Roles &amp; Permissions
                </li>
                <li className="breadcrumb-item">
                  <Link onClick={() => props.history.push("/dashboard")}>
                    <i className="bx bx-home-alt" />
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Roles &amp; Permissions
                </li>
              </ol>
            </nav>
            <div class="d-flex align-items-center justify-content-between flex-wrap mb-2">
              <div className="left-buttons d-flex align-items-center flex-wrap">
                <div class="search position-relative has-icon-left">
                  <input
                    type="search"
                    class="form-control text-capitalize"
                    placeholder="search"
                    value={searchText}
                    onChange={(e) => {
                      searchHandler();
                      setSearchText(e.target.value);
                    }}
                  />
                  {searchText && searchText.length > 0 ? (
                    <div className="clear">
                      <span onClick={() => clearInput()}>
                        <em className="bx bx-x"></em>
                      </span>
                    </div>
                  ) : null}
                  <div class="form-control-position">
                    <em class="bx bx-search"></em>
                  </div>
                </div>
                {isCheckboxSelected.length > 0 && (
                  <div className="position-relative d-flex flex-wrap">
                    <div className="custom-checkbox mx-1">
                      <label className="status-switch">
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
              <div className="right-buttons d-flex justify-content-end">
                <button
                  id="addNewUser"
                  type="button"
                  className="btn glow-primary btn-primary mr-0"
                  onClick={() => props.history.push("/addRole")}
                >
                  <i className="bx bx-user-plus d-lg-none" />
                  <span className="d-none d-sm-none d-lg-inline-block">
                    Add Role
                  </span>
                </button>
              </div>
            </div>

            <table
              className="table row-border nowrap common-datatable mb-0"
              id="role-permission-listing"
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
                  <th>
                    <b>Role</b>
                  </th>
                  <th>
                    <b>Description</b>
                  </th>
                  <th>
                    <b>No. of Users</b>
                  </th>
                  <th>
                    <b>Status</b>
                  </th>
                  <th className="all">
                    <b>Action</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rolesList && rolesList.length === 0 ? (
                  <tr className="text-center text-danger not-found-txt">
                    <td colSpan="6">
                      {loading ? <Loader /> : null}

                      {!loading ? (
                        <h6
                          className="text-center text-danger not-found-txt"
                          colSpan="6"
                        >
                          No Records found!
                        </h6>
                      ) : null}
                    </td>
                  </tr>
                ) : (
                  rolesList &&
                  Array.isArray(rolesList) &&
                  rolesList.map((item, key) => {
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
                            <span>{item.role}</span>
                          </div>
                        </td>
                        <td>
                          <span>{item.description}</span>
                        </td>
                        <td>
                          <span className="dob-date d-block">
                            {item.noOfUsers}
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
                                handleRoleStatus(item.status, item._id);
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
                              onClick={() => {
                                props.history.push(`/editRole/${item._id}`);
                              }}
                            >
                              <i class="bx bx-edit" />
                            </Link>
                            <Link
                              className="cursor-pointer mr-3"
                              onClick={() => handleDeleteRole(item._id)}
                            >
                              <i className="bx bx-trash-alt" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
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
                  onChange={rolePagination}
                />
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
  RolesAccess: state.admin.adminData?.staticRolePermission?.rolesAccess,
});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, { callApi, editUser })(
  AccessManagement
);
