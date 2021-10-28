import React, { useState, useEffect, useRef, useCallback } from "react";
import Layout from "../../components/Layout/Layout";
import { connect } from "react-redux";
import "antd/dist/antd.css";
import { Select, Button } from "antd";
import "rc-pagination/assets/index.css";
import Pagination from "rc-pagination";
import { editUser } from "../../store/Actions";
import { callApi } from "../../api"; // Used for api call
import swal from "sweetalert";
import _, { filter } from "lodash";
import { Link } from "react-router-dom";
import { ADMIN_URL, IMG_URL, PUBLIC_FILE_URL } from "../../config";
import $ from "jquery";
import Loader from "../../components/Loader/Loader";
import errorMessages from "../../utils/ErrorMessages";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API from "../../api/Routes";
import moment from "moment";
import { showMessageNotification } from "./../../utils/Functions"; //Utility functions
import { useOnClickOutside, useSorting } from "../../hooks";
$.DataTable = require("datatables.net");
require("datatables.net-responsive");
var { Option } = Select;
/******************* 
@Purpose : Used for users list view
@Parameter : props
@Author : INIC
******************/
function UsersList(props) {
  const [columnSettingsArr, setColumnSettingsArr] = useState([]);
  const [columnSettings, setColumnSettings] = useState({
    photo: true,
    firstname: true,
    lastname: true,
    emailId: true,
    mobile: true,
    emailVerificationStatus: true,
    status: true,
  });
  const [usersList, setUsersList] = useState([]);
  const [pagesize, setPagesize] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [length, setLength] = useState(1);
  const [loading, setLoading] = useState(true);
  const [, setSelectAll] = useState(false);
  let [filterName, setFilterName] = useState("");
  const [getFilterValues, setGetFilterValues] = useState([]);
  const [addedFilter, setaddedFilter] = useState([]);
  const [searchFilter, setSearchAddedfilter] = useState([]);
  const [, setUserAccess] = useState({});
  const [, setBgColor] = useState("");
  const [tempName, setTempName] = useState("");
  const [savedTemp, setSavedTemp] = useState([]);
  const [, setIsFormValid] = useState(true);
  let [errors, setErrors] = useState({});
  const [, setLatestColumnsArr] = useState([]);
  const [filterObj, setFilterObj] = useState([
    {
      key: "",
      type: "",
      input: "",
      value: { startDate: "", endDate: "" },
      condition: "$and",
    },
  ]);
  const [condition, setCondition] = useState("$and");
  const [templateSettings, setTemplateSettings] = useState([
    {
      key: "photo",
      status: false,
    },
    { key: "firstname", status: false },
    { key: "lastname", status: false },
    { key: "emailId", status: false },
    { key: "mobile", status: false },
    { key: "emailVerificationStatus", status: false },
    { key: "status", status: false },
    { key: "dob", status: false },
    { key: "website", status: false },
    { key: "gender", status: false },
    { key: "address", status: false },
  ]);
  const [, setSelectedOption] = useState("");
  const [, setUserStatus] = useState("");
  const [, setVal] = useState(false);
  const [sortData, sort, onSort] = useSorting();
  const [filterColor, SetFiltercolor] = useState("green");
  const [templateColor, SetTemplatecolor] = useState("green");
  const [allChecked, setAllChecked] = useState(false);
  const [loadingcheckbox, setLoadingcheckbox] = useState(false);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [filterpopup, openFilterpopup] = useState(false);
  const [downloadpopup, openDownloadpopup] = useState(false);
  const [filterID, editFilter] = useState("");
  const [togglestatus, setTogglestatus] = useState(false);
  const [errorsLicence, setErrorsLicence] = useState([
    {
      key: "",
      type: "",
      input: "",
      value: { startDate: "", endDate: "" },
    },
  ]);
  const refFilter = useRef();
  const refDownload = useRef();
  const onCloseFilter = useCallback(() => openFilterpopup(false), []);
  useOnClickOutside(refFilter, onCloseFilter);
  const onCloseDownload = useCallback(() => openDownloadpopup(false), []);
  useOnClickOutside(refDownload, onCloseDownload);

  useEffect(() => {
    (async () => {
      if (
        props.UserAccess &&
        !_.isEmpty(props.UserAccess) &&
        (await props.UserAccess.viewList) === false
      ) {
        props.history.push("/dashboard");
      } else {
        await setUserAccess(props.UserAccess ? props.UserAccess : {});
      }
      await getAllUsers();
      let settings = columnSettings;
      _.map(settings, (val, column) => {
        let columnSetting = _.find(columnSettingsArr, (setting) => {
          return _.isEqual(setting.key, column);
        });
        settings[column] = columnSetting ? columnSetting.status : val;
        setColumnSettings({ ...settings });
      });
      $(".filterlink").click(function () {
        $("#itemlist").hide();
        $("#filterlist").stop().slideToggle();
      });
      $(".listlink").click(function () {
        $("#filterlist").hide();
        $("#itemlist").stop().slideToggle();
      });
    })();
  }, [page, pagesize, sort]);

  /******************* 
  @Purpose : Used for get all users
  @Parameter : filterObj
  @Author : INIC
  ******************/
  const getAllUsers = async (filterObj) => {
    var body = {
      page,
      pagesize,
      sort,
      columnKey: "userListing",
      filter: filterObj ? filterObj : "",
    };
    const response = await props.callApi(
      API.USERS_LIST,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      var result = response.data.listing.map(function (el) {
        var o = Object.assign({}, el);
        o.isChecked = false;
        return o;
      });
      setUsersList(result);
      setColumnSettingsArr(response.data.columnSettings);
      setSavedTemp(response.data.templateSettings);
      setLatestColumnsArr(response.data.latestColumns);
      setGetFilterValues(response.data.filterSettings);
      setTotal(response.total);
      setLength(response.data.listing.length);
      setLoading(false);
    }
  };
  /******************* 
  @Purpose : Used for pagination
  @Parameter : page, pagesize
  @Author : INIC
  ******************/
  const paginationChange = (page, pagesize) => {
    setPage(page);
    setPagesize(pagesize);
  };
  /******************* 
  @Purpose : Used for user status change
  @Parameter : status, userId
  @Author : INIC
  ******************/
  const userStatusChange = async (status, userId) => {
    var body = { userIds: [userId], status };
    const response = await props.callApi(
      API.USERS_STATUS,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      showMessageNotification("Status updated successfully", "success");
    }
  };
  /******************* 
  @Purpose : Used for delete users
  @Parameter : uid
  @Author : INIC
  ******************/
  const deleteUser = async (uid) => {
    let data = usersList.filter((rec) => rec.isChecked == true);
    let result = data.map(({ masterId }) => masterId);
    if (result.length > 0) {
      swal({
        title: "Are you sure,You Want To Delete ?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          if (result.length > 0) {
            var body = { userIds: result };
          } else {
            body = { userIds: result };
          }
          const response = await props.callApi(
            API.DELETE_USERS,
            body,
            "post",
            null,
            true,
            false,
            ADMIN_URL
          );
          if (response.status === 1) {
            showMessageNotification("Deleted successfully", "success");
            setPage(1);
            setPagesize(10);
            getAllUsers();
          }
        }
      });
    }
  };
  /******************* 
  @Purpose : Used for bulk actions
  @Parameter : {}
  @Author : INIC
  ******************/
  const applyBulkActions = async () => {
    let data = usersList.filter((rec) => rec.isChecked == true);
    let delArr = data.map(({ masterId }) => masterId);

    if (delArr.length > 0) {
      delArr = _.compact(delArr);
      if (!togglestatus) {
        var body = { userIds: delArr, status: true };
      } else {
        body = { userIds: delArr, status: false };
      }
      const response = await props.callApi(
        API.USERS_STATUS,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        setSelectedOption("Select here");
        setSelectAll(false);
        setVal(false);
        showMessageNotification("Updated successfully", "success");
        getAllUsers();
      }
    } else {
      showMessageNotification("Please select Records to change status", "error");
    }
  };
  /******************* 
  @Purpose : Used for get saved filter
  @Parameter : value
  @Author : INIC
  ******************/
  const getsavedfilter = async (value) => {
    setaddedFilter(value);
    setSearchAddedfilter([]);
    var body = {
      page: 1,
      pagesize: 10,
      filter: value.filter,
      sort,
      columnKey: "userListing",
    };
    const response = await props.callApi(
      "/user/userListing",
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      setUsersList(response.data.listing);
      setColumnSettingsArr(response.data.columnSettings);
      setLatestColumnsArr(response.data.latestColumns);
      setGetFilterValues(response.data.filterSettings);
      setTotal(response.total);
      setLength(response.data.listing.length);
      openFilterpopup(false);
      setLoading(false);
    }
  };
  /******************* 
  @Purpose : Used for apply filter
  @Parameter : tab
  @Author : INIC
  ******************/
  const ApplyFilter = async (tab) => {
    setaddedFilter([]);
    const isValidateFiltersearch = validateFiltersearch();
    if (isValidateFiltersearch) {
      filterObj.forEach(function (obj) {
        if (obj.type !== "date") {
          delete obj.value;
          obj.value = obj.input;
        } else {
          delete obj.input;
        }
      });
      var result = filterObj.map(function (obj) {
        return {
          key: obj.key,
          value: obj.value,
          type: obj.type,
          condition: obj.condition,
        };
      });
      setSearchAddedfilter(filterObj);
      await getAllUsers(result);
      openFilterpopup(false);
      setFilterName("");
    }
  };
  /******************* 
  @Purpose : Used for serch filter
  @Parameter : tab, i
  @Author : INIC
  ******************/
  const filterSearch = async (tab, i) => {
    if (searchFilter.length <= 1) {
      resetFilter();
    } else {
      var array = [...filterObj];
      array.splice(i, 1);
      setFilterObj(array);
      var array1 = [...errorsLicence];
      array1.splice(i, 1);
      setErrorsLicence(array1);
      array.forEach(function (obj) {
        if (obj.type !== "date") {
          delete obj.value;
          obj.value = obj.input;
        } else {
          delete obj.input;
        }
      });
      var result = array.map(function (obj) {
        return {
          key: obj.key,
          value: obj.value,
          type: obj.type,
          condition: obj.condition,
        };
      });
      setSearchAddedfilter(array);
      await getAllUsers(result);
      openFilterpopup(false);
      setFilterName("");
    }
  };
  /******************* 
  @Purpose : Used for serch filter
  @Parameter : tab, i
  @Author : INIC
  ******************/
  const resetFilter = async () => {
    setCondition("$and");
    SetFiltercolor("green");
    openFilterpopup(false);
    var body = { page, pagesize, columnKey: "userListing" };
    const response = await props.callApi(
      API.USERS_LIST,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      setUsersList(response.data.listing);
      setGetFilterValues(response.data.filterSettings);
      setColumnSettingsArr(response.data.columnSettings);
      setTotal(response.total);
      setLength(response.data.listing.length);
      setLoading(false);
      setFilterObj([
        {
          key: "",
          type: "",
          input: "",
          value: { startDate: "", endDate: "" },
          condition: "$and",
        },
      ]);
    }
    setaddedFilter([]);
    setFilterName("");
    setSearchAddedfilter([]);
  };
  /******************* 
  @Purpose : Used for save filter
  @Parameter : e, tab
  @Author : INIC
  ******************/
  const SaveFilter = async (e, tab) => {
    let isvalidateFilter = validateFilter();
    if (isvalidateFilter) {
      openFilterpopup(false);
      filterObj.forEach(function (obj) {
        if (obj.type === "date") {
          delete obj.input;
        } else {
          obj.value = obj.input;
          delete obj.input;
        }
      });

      var body = {
        description: filterName,
        condition,
        filter: filterObj,
        key: "userListing",
        color: filterColor,
      };

      if (filterID !== "") {
        body.filterId = filterID;
      }
      const response = await props.callApi(
        API.SAVED_FILTER,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Filter saved successfully", "success");
        setSearchAddedfilter([]);
        openFilterpopup(false);
        let body = {
          page: 1,
          pagesize: 10,
          filter: filterObj,
          sort,
          columnKey: "userListing",
        };
        const response = await props.callApi(
          "/user/userListing",
          body,
          "post",
          null,
          true,
          false,
          ADMIN_URL
        );
        if (response.status === 1) {
          setUsersList(response.data.listing);
          setColumnSettingsArr(response.data.columnSettings);
          setLatestColumnsArr(response.data.latestColumns);
          setGetFilterValues(response.data.filterSettings);
          setTotal(response.total);
          setLength(response.data.listing.length);
          setLoading(false);
        }
        setFilterObj([
          {
            key: "",
            type: "",
            input: "",
            value: { startDate: "", endDate: "" },
            condition: "$and",
          },
        ]);
        setFilterName("");
        editFilter("");
        let obj = {
          description: filterName,
        };
        setaddedFilter(obj);
      } else {
        showMessageNotification("Please send proper data", "error");
      }
    }
  };
  /******************* 
  @Purpose : Used for delete filter
  @Parameter : id
  @Author : INIC
  ******************/
  const DeleteFilter = async (id) => {
    swal({
      title: "Are you sure,You Want To Delete ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const response = await props.callApi(
          API.DELETE_FILTER + id,
          "",
          "delete",
          null,
          true,
          false,
          ADMIN_URL
        );
        if (response.status === 1) {
          showMessageNotification("Details are deleted successfully", "success");
          getAllUsers();
          setFilterObj([
            {
              key: "",
              type: "",
              input: "",
              value: { startDate: "", endDate: "" },
              condition: "$and",
            },
          ]);
        }
      }
    });
  };
  /******************* 
  @Purpose : Used for delete filter
  @Parameter : id
  @Author : INIC
  ******************/
  const DeleteTemp = async (id) => {
    swal({
      title: "Are you sure,You Want To Delete ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const response = await props.callApi(
          API.DELETE_TEMP + id,
          "",
          "delete",
          null,
          true,
          false,
          ADMIN_URL
        );
        if (response.status === 1) {
          showMessageNotification("Details are deleted successfully", "success");
          getAllUsers();
          setTemplateSettings([
            {
              key: "photo",
              status: false,
            },
            { key: "firstname", status: false },
            { key: "lastname", status: false },
            { key: "emailId", status: false },
            { key: "mobile", status: false },
            { key: "emailVerificationStatus", status: false },
            { key: "status", status: false },
            { key: "dob", status: false },
            { key: "website", status: false },
            { key: "gender", status: false },
            { key: "address", status: false },
            { key: "address", status: false },
          ]);
        }
      }
    });
  };
  /******************* 
  @Purpose : Used for save templetes
  @Parameter : {}
  @Author : INIC
  ******************/
  const saveTemplets = async () => {
    if (validateForm()) {
      var body = {
        key: "userListing",
        description: tempName,
        columns: templateSettings,
        color: templateColor,
      };
      const response = await props.callApi(
        API.SAVED_TEMP_Settings,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Filter saved Successfully", "success");
        setBgColor("");
        setTempName("");
        setTemplateSettings([
          {
            key: "photo",
            status: false,
          },
          { key: "firstname", status: false },
          { key: "lastname", status: false },
          { key: "emailId", status: false },
          { key: "mobile", status: false },
          { key: "emailVerificationStatus", status: false },
          { key: "status", status: false },
          { key: "dob", status: false },
          { key: "website", status: false },
          { key: "gender", status: false },
          { key: "address", status: false },
          { key: "address", status: false },
        ]);
        getAllUsers();
      } else {
        showMessageNotification("Please send proper data", "error");
      }
    }
  };
  /******************* 
  @Purpose : Used for edit saved templetes
  @Parameter : value
  @Author : INIC
  ******************/
  const editSavedTemplates = (value) => {
    let tempArray = [];
    value &&
      value.columns.map((each) => {
        return tempArray.push({ key: each.key, status: each.status });
      });
    setTemplateSettings(tempArray);
    setTempName(value.description);
    SetTemplatecolor(value.color);
  };
  /******************* 
  @Purpose : Used for download user files
  @Parameter : tab
  @Author : INIC
  ******************/
  const downloadUserFiles = async (tab) => {
    var array = [];
    templateSettings.forEach((o, key) => {
      if (o.status === true) {
        array.push(o.key);
      }
    });
    var body = {
      filteredFields: array,
      type: tab,
    };
    const response = await props.callApi(
      API.DOWNLOAD_FILE,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      if (tab === "csv") {
        var data1 = PUBLIC_FILE_URL + "/csv/" + response.data.filePathAndName;
      } else if (tab === "excel") {
        var data1 = PUBLIC_FILE_URL + "/excel/" + response.data.filePathAndName;
      } else if (tab === "pdf") {
        var data1 = PUBLIC_FILE_URL + "/pdf/" + response.data.filePathAndName;
      } else if (tab === "print") {
        var data1 = PUBLIC_FILE_URL + "/print/" + response.data.filePathAndName;
      }
      setTemplateSettings([
        {
          key: "photo",
          status: false,
        },
        { key: "firstname", status: false },
        { key: "lastname", status: false },
        { key: "emailId", status: false },
        { key: "mobile", status: false },
        { key: "emailVerificationStatus", status: false },
        { key: "status", status: false },
        { key: "dob", status: false },
        { key: "website", status: false },
        { key: "gender", status: false },
        { key: "address", status: false },
        { key: "address", status: false },
      ]);
      window.open(data1, "_blank");
      showMessageNotification("Downloaded file successfully", "success");
    }
  };
  /******************* 
  @Purpose : Used for validate form field
  @Parameter : type
  @Author : INIC
  ******************/
  const validateForm = (type) => {
    let errors = { tempName, filterName };
    let isFormValid = true;
    if (type === "filter") {
      if (!filterName.trim()) errors.filterName = errorMessages.PROVIDE_NAME;
      else if (filterName.length >= 10)
        errors.filterName = "*Name shouldn't be more than than 10 characters.";
      else errors.filterName = "";

      if (errors.filterName !== "") isFormValid = false;
      else isFormValid = true;
      setErrors(errors);
      setIsFormValid(isFormValid);
      return isFormValid;
    } else {
      if (!tempName.trim()) errors.tempName = errorMessages.PROVIDE_NAME;
      else if (tempName.length >= 10)
        errors.tempName = "*Name shouldn't be more than than 10 characters.";
      else errors.tempName = "";

      let validCheckbox = templateSettings.filter(
        (vendor) => vendor["status"] === true
      );
      if (validCheckbox.length <= 0) errors.checkbox = "Please select checkbox";
      else errors.checkbox = "";

      if (errors.tempName !== "" || errors.checkbox !== "") isFormValid = false;
      else isFormValid = true;
      setErrors(errors);
      setIsFormValid(isFormValid);
      return isFormValid;
    }
  };
  /******************* 
  @Purpose : Used for validate filter
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateFilter = () => {
    let isFormValid1 = true;
    var mailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|(^\d{10}$)+$/;
    if (!filterName.trim()) errors.filterName = errorMessages.PROVIDE_NAME;
    else if (filterName.length >= 10)
      errors.filterName = "*Name shouldn't be more than than 10 characters.";
    else errors.filterName = "";
    if (errors.filterName !== "") isFormValid1 = false;
    else isFormValid1 = true;

    setErrors(errors);
    setIsFormValid(isFormValid1);
    filterObj.forEach((each, key) => {
      //user key
      if (_.isEmpty(each.key) && errorsLicence[key]) {
        errorsLicence[key].key = "Enter field";
        isFormValid1 = false;
      } else if (errorsLicence[key]) delete errorsLicence[key].key;

      //type
      if (_.isEmpty(each.type) && errorsLicence[key]) {
        errorsLicence[key].type = "Enter  date or user";
        isFormValid1 = false;
      } else if (errorsLicence[key]) delete errorsLicence[key].type;

      if (
        each.type === "contains" ||
        each.type === "greaterThan" ||
        each.type === "lessThan"
      ) {
        if (each.input === "" && errorsLicence[key] && each.type != "date") {
          errorsLicence[key].input = "Enter  input";
          isFormValid1 = false;
        } else if (each.key === "emailId") {
          if (!mailFormat.test(each.input)) {
            errorsLicence[key].input = "Please enter vaild email";
            isFormValid1 = false;
          }
        } else {
          delete errorsLicence[key].input;
        }
      }
      if (each.type === "date") {
        if (
          each.value &&
          each.value.startDate === "" &&
          errorsLicence[key] &&
          each.type === "date"
        ) {
          errorsLicence[key].value.startDate = "Enter start date";
          isFormValid1 = false;
        } else if (errorsLicence[key])
          delete errorsLicence[key].value.startDate;

        if (
          each.value &&
          each.value.endDate === "" &&
          errorsLicence[key] &&
          each.type === "date"
        ) {
          errorsLicence[key].value.endDate = "Enter end date";
          isFormValid1 = false;
        } else if (
          Date.parse(each.value && each.value.endDate) <
          Date.parse(each.value && each.value.startDate)
        ) {
          errorsLicence[key].value.endDate = errorMessages.START_END_DATE_ERROR;
          isFormValid1 = false;
        } else {
          delete errorsLicence[key].value.endDate;
        }
      }
      return setErrorsLicence([...errorsLicence]);
    });

    return isFormValid1;
  };
  /******************* 
  @Purpose : Used for toggle status change
  @Parameter : {}
  @Author : INIC
  ******************/
  const toggleStatus = () => {
    setTogglestatus(!togglestatus);
    applyBulkActions();
  };
  /******************* 
  @Purpose : Used for search filter validate
  @Parameter : {}
  @Author : INIC
  ******************/
  const validateFiltersearch = () => {
    let isFormValid1 = true;
    var mailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|(^\d{10}$)+$/;
    setErrors(errors);
    setIsFormValid(isFormValid1);
    filterObj.forEach((each, key) => {
      //user key
      if (_.isEmpty(each.key) && errorsLicence[key]) {
        errorsLicence[key].key = "Enter  field";
        isFormValid1 = false;
      } else if (errorsLicence[key]) delete errorsLicence[key].key;

      //type
      if (_.isEmpty(each.type) && errorsLicence[key]) {
        errorsLicence[key].type = "Enter  date or user";
        isFormValid1 = false;
      } else if (errorsLicence[key]) delete errorsLicence[key].type;

      if (
        each.type === "contains" ||
        each.type === "greaterThan" ||
        each.type === "lessThan"
      ) {
        if (each.input === "" && errorsLicence[key] && each.type != "date") {
          errorsLicence[key].input = "Enter Input";
          isFormValid1 = false;
        } else if (each.key === "emailId") {
          if (!mailFormat.test(each.input)) {
            errorsLicence[key].input = "Please enter vaild email";
            isFormValid1 = false;
          }
        } else {
          delete errorsLicence[key].input;
        }
      }

      if (each.type === "date") {
        if (
          each.value &&
          each.value.startDate === "" &&
          errorsLicence[key] &&
          each.type === "date"
        ) {
          errorsLicence[key].value.startDate = "Enter start date";
          isFormValid1 = false;
        } else if (errorsLicence[key])
          delete errorsLicence[key].value.startDate;

        if (
          each.value &&
          each.value.endDate === "" &&
          errorsLicence[key] &&
          each.type === "date"
        ) {
          errorsLicence[key].value.endDate = "Enter end date";
          isFormValid1 = false;
        } else if (
          Date.parse(each.value && each.value.endDate) <
          Date.parse(each.value && each.value.startDate)
        ) {
          errorsLicence[key].value.endDate = errorMessages.START_END_DATE_ERROR;
          isFormValid1 = false;
        } else {
          delete errorsLicence[key].value.endDate;
        }
      }
      return setErrorsLicence([...errorsLicence]);
    });

    return isFormValid1;
  };
  /******************* 
  @Purpose : Used for search value
  @Parameter : keyword
  @Author : INIC
  ******************/
  const searchField = async (keyword) => {
    var body = {
      searchText: keyword,
      page,
      pagesize,
      sort,
      columnKey: "userListing",
    };
    const response = await props.callApi(
      API.USERS_LIST,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      if (response.status === 1) {
        setUsersList(response.data.listing);
        setColumnSettingsArr(response.data.columnSettings);
        setSavedTemp(response.data.templateSettings);
        setLatestColumnsArr(response.data.latestColumns);
        setGetFilterValues(response.data.filterSettings);
        setTotal(response.total);
        setLength(response.data.listing.length);
        setLoading(false);
      }
    }
  };
  /******************* 
  @Purpose : Used for add new filter records
  @Parameter : e
  @Author : INIC
  ******************/
  const addNewRow = (e) => {
    setErrorsLicence([
      ...errorsLicence,
      {
        key: "",
        type: "",
        input: "",
        value: { startDate: "", endDate: "" },
        condition: "$and",
      },
    ]);
    setFilterObj([
      ...filterObj,
      {
        key: "",
        type: "",
        input: "",
        value: { startDate: "", endDate: "" },
        condition: "$and",
      },
    ]);
  };
  /******************* 
  @Purpose : Used for remove filter records
  @Parameter : index
  @Author : INIC
  ******************/
  const removeRow = (index) => {
    var array = [...filterObj];
    array.splice(index, 1);
    setFilterObj(array);
    var array = [...errorsLicence];
    array.splice(index, 1);
    setErrorsLicence(array);
    setTimeout(function () {
      setLoadingFilter(true);
    }, 100);
  };
  /******************* 
  @Purpose : Used for Edit filter records
  @Parameter : index
  @Author : INIC
  ******************/
  const EditSaveFilteredRecords = async (value) => {
    value.filter &&
      value.filter.forEach(function (obj) {
        if (obj.type === "date") {
          delete obj.input;
        } else {
          obj.input = obj.value;
          delete obj.value;
        }
      });
    editFilter(value._id);
    setFilterObj(value.filter);
    SetFiltercolor(value.color);
    setFilterName(value.description);
  };
  /******************* 
  @Purpose : Used for change color
  @Parameter : value
  @Author : INIC
  ******************/
  const handleChangeColor = (value) => {
    SetFiltercolor(value);
  };
  /******************* 
  @Purpose : Used for change template color
  @Parameter : value
  @Author : INIC
  ******************/
  const handleChangeTempaletColor = (value) => {
    SetTemplatecolor(value);
  };
  /******************* 
  @Purpose : Used for handle checkbox
  @Parameter : e
  @Author : INIC
  ******************/
  const handleChangeCheckbox2 = (e) => {
    let list = usersList;
    var checkedALL = allChecked;
    if (e.target.value === "checkAll") {
      list.forEach((item) => {
        item.isChecked = e.target.checked;
        checkedALL = e.target.checked;
      });
    } else {
      list.find((item) => item.firstname === e.target.name).isChecked =
        e.target.checked;
      let magenicVendors = list.filter(
        (vendor) => vendor["isChecked"] === false
      );
      if (magenicVendors.length <= 0) {
        checkedALL = true;
      } else {
        checkedALL = false;
      }
    }
    setUsersList(list);
    setAllChecked(checkedALL);
    setTimeout(function () {
      setLoadingcheckbox(!loadingcheckbox);
    }, 100);
  };
  /******************* 
  @Purpose : Used for display filtered data
  @Parameter : {}
  @Author : INIC
  ******************/
  const renderFilter = () => {
    return (
      <div class="custom-dropdown-menu w-100 dropdown-icon">
        <div class="container-fluid">
          <div className="row">
            <div class="col-md-9">
              <div class="row">
                <div class="col-md-12">
                  <div className="form-repeat">
                    {filterObj &&
                      filterObj.length > 0 &&
                      filterObj.map((o, i) => {
                        return (
                          <form
                            key={i}
                            class="form repeater-default"
                            data-limit="5"
                          >
                            <div className="field-form">
                              <div className="and-or-data text-center mt-1 mb-2">
                                {i >= 1 ? (
                                  <Button
                                    className={
                                      o.condition === "$and"
                                        ? " btn btn-outline-primary mr-3 condition-text"
                                        : "btn btn-outline-primary mr-3"
                                    }
                                    onClick={() => {
                                      o.condition = "$and";
                                      setFilterObj([...filterObj]);
                                    }}
                                  >
                                    AND
                                  </Button>
                                ) : null}
                                {i >= 1 ? (
                                  <Button
                                    className={
                                      o.condition === "$or"
                                        ? " btn btn-outline-primary condition-text"
                                        : "btn btn-outline-primary"
                                    }
                                    onClick={() => {
                                      o.condition = "$or";
                                      setFilterObj([...filterObj]);
                                    }}
                                  >
                                    OR
                                  </Button>
                                ) : null}
                              </div>
                              <div>
                                <div class="target-form">
                                  <div class="target-details">
                                    <div class="row align-items-start">
                                      <div class="form-group col-md-6 col-lg-3 mb-2">
                                        <label className="text-left">
                                          Select Field
                                        </label>

                                        <Select
                                          showSearch
                                          placeholder="Enter Field"
                                          optionFilterProp="children"
                                          className="w-100 custom-input filter-select"
                                          value={o.key}
                                          onChange={(value) => {
                                            o.key = value;
                                            setFilterObj([...filterObj]);
                                            if (errorsLicence[i])
                                              delete errorsLicence[i].key;
                                          }}
                                        >
                                          <Option value="firstname">
                                            First Name
                                          </Option>
                                          <Option value="lastname">
                                            Last Name{" "}
                                          </Option>
                                          <Option value="emailId">Email</Option>
                                          <Option value="mobile">Mobile</Option>
                                        </Select>

                                        <span className="text-danger error-msg">
                                          {errorsLicence[i] &&
                                            errorsLicence[i].key}
                                        </span>
                                      </div>
                                      <div class="form-group col-md-6 col-lg-3 mb-2">
                                        <label className="text-left">
                                          Select Content
                                        </label>
                                        <Select
                                          showSearch={false}
                                          placeholder="Select Type"
                                          className="w-100 custom-input filter-select"
                                          optionFilterProp="children"
                                          value={o.type}
                                          onChange={(value) => {
                                            o.type = value;
                                            if (o.type === "date") {
                                              delete o.value;
                                              o.value = {
                                                startDate: "",
                                                endDate: "",
                                              };
                                            }
                                            setFilterObj([...filterObj]);
                                            if (errorsLicence[i])
                                              delete errorsLicence[i].type;
                                          }}
                                        >
                                          <Option value="contains">
                                            Content
                                          </Option>
                                          <Option value="greaterThan">
                                            {" "}
                                            {`>=`}{" "}
                                          </Option>
                                          <Option value="lessThan">{`<=`}</Option>
                                          <Option value="date">Date</Option>
                                        </Select>
                                        <span className="text-danger error-msg">
                                          {errorsLicence[i] &&
                                            errorsLicence[i].type}
                                        </span>
                                      </div>

                                      <div class="col-md-6 col-lg-6 mb-2 ">
                                        <div className="input-daterange custom-daterange input-control">
                                          {o.type === "date" ? (
                                            <div className="row">
                                              <div className="col-md-6">
                                                <label className="text-left">
                                                  Select Start date
                                                </label>
                                                <DatePicker
                                                  selected={
                                                    o.value.startDate
                                                      ? new Date(
                                                          o.value.startDate
                                                        )
                                                      : ""
                                                  }
                                                  placeholderText="Select Start Date"
                                                  dateFormat="MMM d yyyy"
                                                  className="form-control w-100"
                                                  onChange={(evt) => {
                                                    o.value.startDate = evt;
                                                    setFilterObj([
                                                      ...filterObj,
                                                    ]);
                                                    if (errorsLicence[i])
                                                      delete errorsLicence[i]
                                                        .value.startDate;
                                                  }}
                                                />
                                                <span className="text-danger error-msg">
                                                  {errorsLicence[i] &&
                                                    errorsLicence[i].value
                                                      .startDate}
                                                </span>
                                              </div>
                                              <div className="col-md-6">
                                                <label className="text-left">
                                                  Select end date
                                                </label>

                                                <DatePicker
                                                  selected={
                                                    o.value.endDate
                                                      ? new Date(
                                                          o.value.endDate
                                                        )
                                                      : ""
                                                  }
                                                  dateFormat="MMM d yyyy"
                                                  placeholderText="Select End Date"
                                                  className="form-control w-100"
                                                  onChange={(evt) => {
                                                    o.value.endDate = evt;
                                                    setFilterObj([
                                                      ...filterObj,
                                                    ]);
                                                    if (errorsLicence[i])
                                                      delete errorsLicence[i]
                                                        .value.endDate;
                                                  }}
                                                />
                                                <span className="text-danger error-msg">
                                                  {errorsLicence[i] &&
                                                    errorsLicence[i].value
                                                      .endDate}
                                                </span>
                                              </div>
                                            </div>
                                          ) : null}

                                          {o.type === "contains" ||
                                          o.type === "greaterThan" ||
                                          o.type === "lessThan" ? (
                                            <div className="row">
                                              <div className="col-md-4">
                                                <div className="form-group mb-0">
                                                  <label className="text-left">
                                                    Input
                                                  </label>
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    name={o.input}
                                                    value={o.input}
                                                    placeholder="Enter input"
                                                    onChange={(evt) => {
                                                      o.input =
                                                        evt.target.value;
                                                      setFilterObj([
                                                        ...filterObj,
                                                      ]);
                                                      if (errorsLicence[i])
                                                        delete errorsLicence[i]
                                                          .input;
                                                    }}
                                                  />
                                                  <span className="text-danger error-msg">
                                                    {errorsLicence[i] &&
                                                      errorsLicence[i].input &&
                                                      errorsLicence[i].input}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="add-row">
                                    {filterObj && filterObj.length >= 2 ? (
                                      <span
                                        class="bx bxs-minus-circle mr-1 text-danger"
                                        onClick={() => removeRow(i)}
                                        type="button"
                                      ></span>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="add-row add-plus">
                              <span
                                className="add-ic"
                                onClick={(e) => addNewRow(e)}
                                class="bx bxs-plus-circle text-success"
                                type="button"
                              ></span>
                            </div>
                          </form>
                        );
                      })}
                  </div>
                </div>

                {loadingcheckbox ? <div></div> : null}

                {loadingFilter ? <div></div> : null}

                <div class="col-md-12">
                  <form class="form-inline align-items-start mt-3">
                    <div class="form-group mr-sm-2 mb-2">
                      <button
                        onClick={(evt) => ApplyFilter(evt)}
                        type="button"
                        class="btn btn-primary"
                      >
                        Search
                      </button>
                    </div>
                    <div class="form-group mx-sm-2 mb-2">
                      <button
                        onClick={resetFilter}
                        type="button"
                        class="btn btn-secondary disabled"
                      >
                        Clear
                      </button>
                    </div>

                    <div class="form-group mx-sm-2 mb-2 d-flex flex-column">
                      <div class="input-group">
                        <input
                          type="text"
                          name="filterName"
                          name="filterName"
                          className="form-control"
                          value={filterName}
                          placeholder="Enter Name to Save Fliter"
                          onChange={(e) => {
                            setFilterName(e.target.value);
                            errors = Object.assign(errors, { filterName: "" });
                            setErrors(errors);
                          }}
                        />

                        <div class="input-group-append">
                          <button
                            onClick={(evt) => SaveFilter(evt)}
                            class="btn btn-default"
                            type="button"
                          >
                            Save &amp; Search
                          </button>
                        </div>
                      </div>
                      <span className="error-block text-danger error-msg d-block text-left w-100 mt-1">
                        {" "}
                        {errors.filterName}{" "}
                      </span>
                    </div>
                    <div class="form-group mx-sm-2 mb-2">
                      <Select
                        showSearch={false}
                        selected={filterColor}
                        defaultValue="green"
                        value={filterColor}
                        className="custom-input color-dropdown"
                        style={{ width: 140 }}
                        onChange={handleChangeColor}
                      >
                        <Option value="gray">
                          <a class="dropdown-item" href="#">
                            <span class="color-shade bg-gray"></span>
                            <span class="color-text">Gray</span>
                          </a>
                        </Option>
                        <Option value="yellow">
                          <a class="dropdown-item" href="#">
                            <span class="color-shade bg-yellow"></span>
                            <span class="color-text">Yellow</span>
                          </a>
                        </Option>
                        <Option value="green">
                          {" "}
                          <a class="dropdown-item" href="#">
                            <span class="color-shade bg-green"></span>
                            <span class="color-text">Green</span>
                          </a>
                        </Option>
                        <Option value="purple">
                          {" "}
                          <a class="dropdown-item" href="#">
                            <span class="color-shade bg-purple"></span>
                            <span class="color-text">Purple</span>
                          </a>
                        </Option>
                        <Option value="rose">
                          <a class="dropdown-item" href="#">
                            <span class="color-shade bg-rose"></span>
                            <span class="color-text">Rose</span>
                          </a>
                        </Option>
                        <Option value="skyblue">
                          <a class="dropdown-item" href="#">
                            <span class="color-shade bg-skyblue"></span>
                            <span class="color-text">Skyblue</span>
                          </a>
                        </Option>
                      </Select>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="label-container d-flex flex-wrap">
                {getFilterValues && getFilterValues.length ? (
                  getFilterValues.map((filter, key) => {
                    return (
                      <div className="d-flex align-items-center flex-wrap">
                        <span class="user-save label d-flex align-items-center border rounded text-nowrap p-2 mr-2 mb-2">
                          {filter && filter.color ? (
                            <span
                              class={`label-color-dot ${filter.color} border rounded-circle`}
                            ></span>
                          ) : null}
                          <span
                            onClick={() => getsavedfilter(filter)}
                            data-toggle="popover"
                            data-toggle="popover"
                            className="text-capitalize"
                          >
                            {filter.description}
                          </span>
                        </span>
                        <buttom onClick={() => EditSaveFilteredRecords(filter)}>
                          <em className="bx bx-edit text-primary cursor-pointer"></em>
                        </buttom>
                        <span>
                          <em
                            onClick={() => DeleteFilter(filter._id)}
                            className="bx bx-trash-alt text-danger cursor-pointer"
                          ></em>
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="filter-title">No saved Filters</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  let validCheckbox = templateSettings.filter(
    (vendor) => vendor["status"] === true
  );
  let { photo } = columnSettings;
  let isSelected = usersList.filter((rec) => rec.isChecked === true);
  let isCheckboxSelected = isSelected.map(({ masterId }) => masterId);
  const numbers = [2, 5, 10, 15, 25, 50, 100, 200, 500].filter(
    (number) => number < total
  );

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="main-content-area">
          <div className="overlay" />
          <div className="main-content-block overflow-auto">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="content-header-title">Users</li>
                <li class="breadcrumb-item">
                  <Link onClick={() => props.history.push("/dashboard")}>
                    <i class="bx bx-home-alt"></i>
                  </Link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  users
                </li>
              </ol>
            </nav>

            <div class="content-area position-relative">
              <div class="grid">
                <div class="grid-content">
                  {/* <!-- filterbar buttons --> */}
                  <div class="user-listing-filterOptions mb-2 d-block">
                    <div class="row mb-2">
                      <div class="col-sm-8 position-static">
                        <div class="left-buttons d-flex ">
                          <label>
                            <div className="search-input-wrapper position-relative">
                              <i className="bx bx-search"></i>{" "}
                              <input
                                type="search"
                                className="form-control text-capitalize"
                                placeholder="search"
                                onChange={(evt) =>
                                  searchField(evt.target.value)
                                }
                              />
                            </div>
                          </label>

                          <div
                            id="container1"
                            class={
                              filterpopup
                                ? "custom-dropdown filter-data-dropdown position-static ml-2 open"
                                : "custom-dropdown filter-data-dropdown position-static ml-2"
                            }
                          >
                            <button
                              onClick={() => {
                                openFilterpopup(!filterpopup);
                                openDownloadpopup(false);
                              }}
                              class="btn btn-default dropdown-toggle minW-md-0 btn-bg-white"
                              type="button"
                            >
                              <i class="bx bx-filter d-lg-none"></i>
                              <span class="d-none d-sm-none d-lg-inline-block">
                                Filter Data
                              </span>
                            </button>
                            {renderFilter()}
                          </div>
                          {isCheckboxSelected.length > 0 ? (
                            <React.Fragment>
                              <button
                                onClick={() => deleteUser()}
                                type="button"
                                class="btn btn-default delete-btn minW-0 btn-bg-white"
                              >
                                <i class="bx bx-trash-alt"></i>
                              </button>
                              <div className="custom-checkbox mx-1">
                                <label>
                                  <input
                                    type="checkbox"
                                    onChange={() => {
                                      setUserStatus({ usersList });
                                      toggleStatus();
                                    }}
                                    id="cccq"
                                    checked={
                                      togglestatus ? togglestatus : false
                                    }
                                  />

                                  <span className="switch">
                                    <i class="bx bx-toggle-left"></i>
                                  </span>
                                </label>
                              </div>
                            </React.Fragment>
                          ) : null}
                        </div>
                      </div>
                      {loading ? <Loader /> : null}
                      <div class="col-sm-4">
                        <div class="right-buttons d-flex justify-content-end">
                          <div
                            className={
                              downloadpopup
                                ? "custom-dropdown download-dropdown dropdown download-btn open"
                                : "custom-dropdown download-dropdown dropdown download-btn"
                            }
                          >
                            <button
                              onClick={() => {
                                openDownloadpopup(!downloadpopup);
                                openFilterpopup(false);
                              }}
                              class="btn btn-default dropdown-toggle minW-md-0 btn-bg-white"
                              type="button"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <i class="bx bx-download d-lg-none"></i>
                              <span class="d-none d-sm-none d-lg-inline-block">
                                Download
                              </span>
                            </button>
                            <div class="pt-3 pr-3 pb-3 pl-0 download-dropdown-menu">
                              <div class="container-fluid">
                                <div class="row flex-nowrap">
                                  <div class="left-col p-0">
                                    <span className="error-block error-msg text-danger d-block text-left p-2">
                                      {" "}
                                      {errors.checkbox}{" "}
                                    </span>
                                    {templateSettings.map((o, i) => {
                                      return (
                                        <div className="list-group-item">
                                          <div className="custom-checkbox">
                                            <label>
                                              <input
                                                id={i}
                                                type="checkbox"
                                                checked={o.status}
                                                onChange={(evt) => {
                                                  o.status = !o.status;
                                                  setTemplateSettings([
                                                    ...templateSettings,
                                                  ]);
                                                  errors = Object.assign(
                                                    errors,
                                                    { checkbox: "" }
                                                  );
                                                  setErrors(errors);
                                                }}
                                              />
                                              <span></span>
                                              {o.key === "photo"
                                                ? "Photo"
                                                : o.key === "firstname"
                                                ? "First Name"
                                                : o.key === "lastname"
                                                ? "Last Name"
                                                : o.key === "emailId"
                                                ? "Email Id"
                                                : o.key === "mobile"
                                                ? "Mobile"
                                                : o.key ===
                                                  "emailVerificationStatus"
                                                ? "Emailverification status"
                                                : o.key === "status"
                                                ? "Status"
                                                : o.key === "dob"
                                                ? "DOB"
                                                : o.key === "website"
                                                ? "website"
                                                : o.key === "gender"
                                                ? "Gender"
                                                : o.key === "address"
                                                ? "Address"
                                                : null}
                                            </label>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div class="right-col p-0 border-top-0 border-bottom-0 border-right-0 border pl-3">
                                    <div class="row m-0">
                                      <div class="col-left">
                                        <div class="input-group mb-3">
                                          <input
                                            class="form-control"
                                            type="text"
                                            value={tempName}
                                            name="tempName"
                                            placeholder="Save template"
                                            onChange={(e) => {
                                              setTempName(e.target.value);
                                              errors = Object.assign(errors, {
                                                tempName: "",
                                              });
                                              setErrors(errors);
                                            }}
                                          />
                                          <div class="input-group-append">
                                            <button
                                              class="btn btn-primary"
                                              type="button"
                                              onClick={() => saveTemplets()}
                                            >
                                              Save Template
                                            </button>
                                          </div>
                                        </div>
                                        <span className="error-block error-msg  text-danger d-block text-left">
                                          {" "}
                                          {errors.tempName}{" "}
                                        </span>
                                      </div>
                                      <div class="col-right">
                                        <Select
                                          showSearch={false}
                                          selected={templateColor}
                                          defaultValue="green"
                                          value={templateColor}
                                          className="custom-input color-dropdown"
                                          style={{ width: 140 }}
                                          onChange={handleChangeTempaletColor}
                                        >
                                          <Option value="gray">
                                            <a class="dropdown-item" href="#">
                                              <span class="color-shade bg-gray"></span>
                                              <span class="color-text">
                                                Gray
                                              </span>
                                            </a>
                                          </Option>
                                          <Option value="yellow">
                                            <a class="dropdown-item" href="#">
                                              <span class="color-shade bg-yellow"></span>
                                              <span class="color-text">
                                                Yellow
                                              </span>
                                            </a>
                                          </Option>

                                          <Option value="green">
                                            {" "}
                                            <a class="dropdown-item" href="#">
                                              <span class="color-shade bg-green"></span>
                                              <span class="color-text">
                                                Green
                                              </span>
                                            </a>
                                          </Option>

                                          <Option value="purple">
                                            {" "}
                                            <a class="dropdown-item" href="#">
                                              <span class="color-shade bg-purple"></span>
                                              <span class="color-text">
                                                Purple
                                              </span>
                                            </a>
                                          </Option>

                                          <Option value="rose">
                                            <a class="dropdown-item" href="#">
                                              <span class="color-shade bg-rose"></span>
                                              <span class="color-text">
                                                Rose
                                              </span>
                                            </a>
                                          </Option>
                                          <Option value="skyblue">
                                            <a class="dropdown-item" href="#">
                                              <span class="color-shade bg-skyblue"></span>
                                              <span class="color-text">
                                                Skyblue
                                              </span>
                                            </a>
                                          </Option>
                                        </Select>
                                      </div>
                                    </div>
                                    <div className="row m-0 flex-column">
                                      <div class="scrollable template-list-outer right-col-list">
                                        <div class="label-container d-flex flex-wrap">
                                          {savedTemp && savedTemp.length ? (
                                            savedTemp.map((template, key) => {
                                              return (
                                                <div className="d-flex align-items-center w-100">
                                                  <div>
                                                    <span class="filter-label d-flex align-items-center rounded text-nowrap p-2 mr-2 mb-2">
                                                      {template &&
                                                      template.color ? (
                                                        <span
                                                          class={`label-color-dot ${template.color} border rounded-circle`}
                                                        ></span>
                                                      ) : null}
                                                      <span
                                                        data-toggle="popover"
                                                        data-toggle="popover"
                                                        onClick={() =>
                                                          editSavedTemplates(
                                                            template
                                                          )
                                                        }
                                                      >
                                                        {template.description}
                                                      </span>
                                                    </span>
                                                  </div>
                                                  <span class="d-inline-flex align-items-center mb-2">
                                                    <a
                                                      onClick={() =>
                                                        DeleteTemp(template._id)
                                                      }
                                                    >
                                                      <i class="bx bx-trash-alt text-primary"></i>
                                                    </a>
                                                  </span>
                                                </div>
                                              );
                                            })
                                          ) : (
                                            <div className="filter-title">
                                              No saved Files
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    {validCheckbox.length > 0 ? (
                                      <div class="bottom-buttons border-left-0 border-bottom-0 border-right-0 border mt-2 mb-2 pt-3">
                                        <button
                                          onClick={() =>
                                            downloadUserFiles("excel")
                                          }
                                          type="button"
                                          class="btn border mr-2"
                                          id="ExportReporttoExcel"
                                        >
                                          <span class="mr-2">
                                            <img
                                              class="img-fluid"
                                              src="assets/images/icon/excel-icon.svg"
                                              alt="Excel"
                                            />
                                          </span>
                                          Excel
                                          <span className="bx bx-download ml-2"></span>
                                        </button>
                                        <button
                                          onClick={() =>
                                            downloadUserFiles("csv")
                                          }
                                          type="button"
                                          class="btn border"
                                          id="ExportReporttoCSV"
                                        >
                                          <span class="mr-2">
                                            <img
                                              class="img-fluid"
                                              src="assets/images/icon/csv-icon.svg"
                                              alt="Excel"
                                            />
                                          </span>
                                          CSV
                                          <span className="bx bx-download ml-2"></span>
                                        </button>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="filter-labels">
                      {addedFilter.description ? (
                        <div className="multiple-filter">
                          <label className="mb-0">
                            {addedFilter.description}
                          </label>
                          <label
                            className="remove-label mb-0"
                            onClick={resetFilter}
                          >
                            <em className="bx bx-x"></em>
                          </label>
                        </div>
                      ) : null}
                    </div>
                    <div className="search-label">
                      {searchFilter && searchFilter.length ? (
                        <div className="multiple-text">
                          {searchFilter &&
                            searchFilter.length &&
                            Array.isArray(searchFilter) &&
                            searchFilter.map((filter, i) => {
                              return (
                                <React.Fragment>
                                  <div className="text-label mr-2">
                                    {filter &&
                                    filter.type !== "date" &&
                                    typeof filter.value !== "object" ? (
                                      <label className="mb-0">
                                        {filter.key}{" "}
                                        <span className="text-success">
                                          contains
                                        </span>{" "}
                                        {filter.value}
                                      </label>
                                    ) : null}
                                    {filter &&
                                    filter.type === "date" &&
                                    typeof filter.value === "object" ? (
                                      <React.Fragment>
                                        {filter &&
                                        filter.value &&
                                        filter.value.startDate ? (
                                          <React.Fragment>
                                            <label className="mb-0">
                                              {filter.key}{" "}
                                              <span className="text-success">
                                                is added from Date{" "}
                                              </span>{" "}
                                              {filter.value.startDate &&
                                              filter.value &&
                                              filter.value.startDate
                                                ? moment(
                                                    filter.value.startDate
                                                  ).format("L")
                                                : null}{" "}
                                              TO Date{" "}
                                              {filter.value.startDate &&
                                              filter.value &&
                                              filter.value.endDate
                                                ? moment(
                                                    filter.value.endDate
                                                  ).format("L")
                                                : null}{" "}
                                            </label>
                                          </React.Fragment>
                                        ) : null}
                                      </React.Fragment>
                                    ) : null}
                                    <label
                                      className="remove-label"
                                      onClick={() => filterSearch("filter", i)}
                                    >
                                      <em className="bx bx-x"></em>
                                    </label>
                                  </div>
                                </React.Fragment>
                              );
                            })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table
                class="table row-border nowrap common-datatable"
                id="user-listing"
              >
                <thead>
                  <tr>
                    <th className="checkbox-table">
                      <div className="custom-checkbox">
                        <label>
                          <input
                            type="checkbox"
                            value="checkAll"
                            checked={allChecked}
                            onChange={handleChangeCheckbox2}
                          />
                          <span></span>
                        </label>
                      </div>
                    </th>
                    {photo ? (
                      <th>
                        <b>Profile</b>
                      </th>
                    ) : null}
                    <th onClick={() => onSort("firstname")}>
                      <b>First Name</b>
                      <i
                        aria-hidden="true"
                        className={
                          sortData["firstname"]
                            ? "bx bxs-chevron-up"
                            : "bx bxs-chevron-down"
                        }
                      ></i>
                    </th>
                    <th onClick={() => onSort("lastname")}>
                      <b>Last Name</b>
                      <i
                        aria-hidden="true"
                        className={
                          sortData["lastname"]
                            ? "bx bxs-chevron-up"
                            : "bx bxs-chevron-down"
                        }
                      ></i>
                    </th>
                    <th onClick={() => onSort("emailId")}>
                      <b>Email</b>
                      <i
                        aria-hidden="true"
                        className={
                          sortData["emailId"]
                            ? "bx bxs-chevron-up"
                            : "bx bxs-chevron-down"
                        }
                      ></i>
                    </th>
                    <th>
                      <b>Status</b>
                    </th>
                    <th class="all">
                      <b>Action</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usersList && usersList.length === 0 ? (
                    <tr className="text-center text-danger not-found-txt">
                      <td colSpan="6">
                        {!loading ? (
                          <h6
                            className="text-center text-danger not-found-txt"
                            colSpan="6"
                          >
                            No Records Found!
                          </h6>
                        ) : null}
                      </td>
                    </tr>
                  ) : (
                    usersList &&
                    Array.isArray(usersList) &&
                    usersList.map((user, key) => {
                      return (
                        <tr>
                          <td>
                            <div className="custom-checkbox">
                              <label>
                                <input
                                  key={user.masterId}
                                  type="checkbox"
                                  name={user.firstname}
                                  value={user.firstname}
                                  checked={user.isChecked}
                                  onChange={handleChangeCheckbox2}
                                />
                                <span />
                              </label>
                            </div>
                          </td>
                          {photo ? (
                            <td>
                              <div className="thumb-img">
                                {user.photo && user.photo !== "" ? (
                                  <img
                                    src={
                                      user.photo
                                        ? ADMIN_URL+IMG_URL + user.photo
                                        : "/assets/images/no-image-user.png"
                                    }
                                    alt="/assets/images/no-image-user.png"
                                  />
                                ) : (
                                  <img
                                    src={"/assets/images/no-user.png"}
                                    alt="/assets/images/no-image-user.png"
                                  />
                                )}
                              </div>
                            </td>
                          ) : null}
                          <td>{user.firstname}</td>
                          <td>{user.lastname}</td>
                          <td>
                            <div class="eamil-col d-flex align-items-center">
                              <div class="badge-outer circle round d-flex align-items-center mr-2">
                                {user.status ? (
                                  <span class="badge badge-success circle">
                                    {" "}
                                  </span>
                                ) : (
                                  <span class="badge badge-danger circle">
                                    {" "}
                                  </span>
                                )}
                              </div>
                              <span>{user.emailId}</span>
                            </div>
                          </td>
                          <td>
                            <div class="custom-control custom-switch light">
                              <input
                                type="checkbox"
                                class="custom-control-input"
                                onChange={() => {
                                  user.status = !user.status;
                                  setUserStatus({ usersList });
                                  userStatusChange(user.status, user.masterId);
                                }}
                                id={user.masterId}
                                checked={user.status ? user.status : false}
                              />
                              <label
                                class="custom-control-label"
                                for={user.masterId}
                              ></label>
                            </div>
                          </td>
                          <td>
                            <div class="d-flex ml-3">
                              <a
                                onClick={() =>
                                  props.history.push(`/userdetails/${user.masterId}`)
                                }
                                class="cursor-pointer mr-3"
                              >
                                <i class="bx bx-show-alt"></i>
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {usersList && usersList.length === 0 ? (
              <div> </div>
            ) : (
              <div className="table-footer mt-2 mt-sm-3 d-flex align-items-center justify-content-between">
                <div>
                  <label className="mr-2">Showing</label>
                  <Select
                    placeholder={<b>10 Items Per Page</b>}
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
                    onChange={paginationChange}
                  />
                </div>
              </div>
            )}
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
  UserAccess: {edit:true,delete:true,create:true,viewDetails:true,viewList:true}
    // state.admin.adminData &&
    // state.admin.adminData.staticRolePermission &&
    // state.admin.adminData.staticRolePermission.userAccess,
});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, { callApi, editUser })(UsersList);
