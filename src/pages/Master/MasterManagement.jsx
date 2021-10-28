import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout/Layout";
import { useTranslation } from "react-i18next";
import { Tab, Tabs, Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import errorMessages from "../../utils/ErrorMessages";
import { callApi } from "../../api"; // Used for api call
import { Link } from "react-router-dom";
import Select from "react-select";
import countryList from "react-select-country-list";
import swal from "sweetalert";
import * as _ from "lodash";
import API from "../../api/Routes";
import "react-phone-input-2/lib/style.css";
import Pagination from "rc-pagination";
import Loader from "../../components/Loader/Loader";
import countryTelephoneCode from "country-telephone-code";
import ReactCountryFlag from "react-country-flag";
import { showMessageNotification } from "./../../utils/Functions"; //Utility functions
import getSymbolFromCurrency from "currency-symbol-map";
import {ADMIN_URL,AUTH_URL} from "../../config";

const ct = require("countries-and-timezones");

/******************* 
@Purpose : Used for master managements view
@Parameter : props
@Author : INIC
******************/
function MasterManagement(props) {
  const selectInputRef = useRef();
  const [lang] = useTranslation("language");
  const options = countryList().getData();
  const [countryListing, setCountryListing] = useState([]);
  const [show, setShow] = useState(false);
  const [showTimeZone, setTimeZone] = useState(false);
  const [showCurrency, setCurrency] = useState(false);
  const [countryName, setCountryName] = useState(null);
  const [selectedCountryName, setSelectedCountryName] = useState(null);
  const [countryTimeZone, setCountryTimeZone] = useState(null);
  const [selectedCountryCurrency, setSelectedCountryCurrency] = useState(null);
  const [countryCurrencyCode, setCountryCurrencyCode] = useState(null);
  const [conversionRate,setConversionRate] = useState(0)
  const [countryCode, setCountryCode] = useState("");
  const [, setLowerCasePhoneCode] = useState("");
  var [errors, setErrors] = useState({});
  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [, setIsFormValid] = useState(true);
  const [countryDetails, setCountryDetails] = useState([]);
  const [defaultCountry, setDefaultCountry] = useState({
    value: "",
    label: "",
  });

  const [editCountry, setEditCountry] = useState(false);
  const [editTimeZone, setEditTimeZone] = useState(false);
  const [editCurrency, setEditCurrency] = useState(false);
  const [multipleDelete] = useState([]);
  const [total, setTotal] = useState(1);
  const [eventKeys, setEventKeys] = useState("country");
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [timezonepage, setTimezonePage] = useState(1);
  const [timezonePagesize, setTimezonePagesize] = useState(10);
  const [timezoneListing, setTimezoneListing] = useState([]);
  const [timezoneTotal, setTimezoneTotal] = useState(1);
  const [timezoneArray, setTimezoneArray] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencyArray] = useState(null);
  const [currencyCodeOptions, setCurrencyCodeOptions] = useState(null);
  const [currencyPage] = useState(1);
  const [currencyPagesize] = useState(10);
  const [, setCurrencylisting] = useState([]);
  const [, setCurrencyTotal] = useState(1);
  const [, setCountryStatus] = useState(false);
  const [, setTimeZoneStatus] = useState(false);
  const [specificTimezone, setspecificTimezone] = useState([]);
  const [phonenumber, setPhonenumber] = useState("");
  const [searchText, setSearchtext] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    getAllCountryList();
    setEditCountry(false);
    setEditTimeZone(false);
    getAllTimezoneList();
    // getAllCurrencyList();
  }, [
    page,
    pagesize,
    timezonepage,
    timezonePagesize,
    currencyPage,
    currencyPagesize,
  ]);
  /******************* 
  @Purpose : Used for manage country
  @Parameter : {}
  @Author : INIC
  ******************/
  const handleCloseCountry = () => {
    setShow(false);
    setEditCountry(false);
    setCountryName(null);
    setCountryCode("");
    setPhonenumber("");
    setCountryDetails([]);
    setErrors({});
    setConversionRate(0)
  };
  /******************* 
  @Purpose : Used for manage timezon
  @Parameter : {}
  @Author : INIC
  ******************/
  const handleCloseTimeZone = () => {
    setTimeZone(false);
    setEditTimeZone(false);
    setErrors({});
    setSelectedTimezone("");
    setCountryTimeZone(null);
  };
  /******************* 
  @Purpose : Used for manage currency
  @Parameter : {}
  @Author : INIC
  ******************/
  const handleCloseCurrency = () => {
    setCurrency(false);
    setEditCurrency(false);
    setErrors({});
    setSelectedCountryCurrency(null);
    setCountryCurrencyCode(null);
  };
  /******************* 
  @Purpose : Used for close modal
  @Parameter : {}
  @Author : INIC
  ******************/
  const modelCloseFun = () => {
    handleCloseCountry();
    handleCloseTimeZone();
    handleCloseCurrency();
  };
  /******************* 
  @Purpose : Used for add country
  @Parameter : {}
  @Author : INIC
  ******************/
  const handleAddCountry = () => {
    setShow(true);
    setTimeZone(false);
    setCurrency(false);
    setEditCountry(false);
    setCountryName(null);
    setCountryCode("");
    setErrors({});
    setCountryDetails([]);
  };
  /******************* 
  @Purpose : Used for add timezone
  @Parameter : {}
  @Author : INIC
  ******************/
  const handleAddTimeZone = (obj) => {
    setTimeZone(true);
    setEditTimeZone(false);
    setShow(false);
    setCurrency(false);
    setErrors({});
    setSelectedTimezone("");
    setCountryTimeZone(null);
  };
  /******************* 
  @Purpose : Used for add currency
  @Parameter : {}
  @Author : INIC
  ******************/
  const handleAddCurrency = () => {
    setCurrency(true);
    setTimeZone(false);
    setEditCurrency(false);
    setShow(false);
    setErrors({});
    setSelectedCountryCurrency(null);
    setCountryCurrencyCode(null);
  };
  /******************* 
  @Purpose : Used for add country/timezone/currency
  @Parameter : {}
  @Author : INIC
  ******************/
  const modelOnAddBtn = () => {
    if (eventKeys === "country") {
      handleAddCountry();
    }
    if (eventKeys === "timezone") {
      handleAddTimeZone();
    }
    if (eventKeys === "currency") {
      handleAddCurrency();
    }
  };
  /******************* 
  @Purpose : Used for change country
  @Parameter : val
  @Author : INIC
  ******************/
  const changeHandler = (val) => {
    if (val && val.label) {
      var cc = require("currency-codes");
      let countryCurrency = [];
      let list = [];
      list = cc.country(val.label);
      list.forEach((item) => {
        countryCurrency.push({
          label: item.code,
          value: item.code,
        });
      });

      let currency =
        countryCurrency && countryCurrency[0] && countryCurrency[0].value;
      setCountryCurrencyCode(currency);
    }

    setCountryName(val);
    errors.countryName = "";
    let data = countryTelephoneCode(val.value);
    setCountryCode(data[0]);
    setPhonenumber(data[0]);
  };
  /******************* 
  @Purpose : Used for change country timezone
  @Parameter : val
  @Author : INIC
  ******************/
  const changeCountryTimeZoneHandlr = (val) => {
    setSelectedTimezone("");
    if (val && val.label) {
      let data = countryList().getValue(val.label);
      const timezones = ct.getTimezonesForCountry(data);
      const newArray = timezones.map((item) => {
        return {
          label: `(${item.dstOffsetStr}) ${item.name}`,
          value: `(${item.dstOffsetStr}) ${item.name} `,
        };
      });
      setspecificTimezone(newArray);
    }
    setCountryTimeZone(val);
    errors.countryTimeZone = "";
  };
  /******************* 
  @Purpose : Used for change country currency
  @Parameter : val
  @Author : INIC
  ******************/
  const changeCurrencyCountryHndlr = (val) => {
    setCountryCurrencyCode("");
    setSelectedCountryCurrency(val);
    if (val && val.label) {
      var cc = require("currency-codes");
      let countryCurrency = [];
      let list = [];
      list = cc.country(val.label);

      list.forEach((item) => {
        countryCurrency.push({
          label: item.code,
          value: item.code,
        });
      });

      setCurrencyCodeOptions(countryCurrency);
    }
    errors.selectedCountryCurrency = "";
  };
  /******************* 
  @Purpose : Used for change country currency
  @Parameter : val
  @Author : INIC
  ******************/
  const changeCountryCurrencyHandler = (val) => {
    setCountryCurrencyCode(val);
    errors.countryCurrencyCode = "";
  };
  /******************* 
  @Purpose : Used for change timezone
  @Parameter : val
  @Author : INIC
  ******************/
  const changeTimeZone = (val) => {
    setSelectedTimezone(val);
    errors.selectedTimezone = "";
  };
  /******************* 
  @Purpose : Used for validate form
  @Parameter : type
  @Author : INIC
  ******************/
  const validateForm = (type) => {
    let error = {
      countryName,
      countryTimeZone,
      selectedTimezone,
      countryCurrencyCode,
      selectedCountryCurrency,
      conversionRate
    };
    let isFormValid = true;
    if (type === "addCountry") {
      if (!countryName) {
        error.countryName = errorMessages.PROVIDE_COUNTRY_NAME;
        isFormValid = false;
      } else if(!conversionRate) {
        error.conversionRate = errorMessages.PROVIDE_CONVERSION_RATE;
        isFormValid = false;
      } else {
        error.countryName = "";
        error.conversionRate = ""
      } 
    }

    if (type === "addTimezone") {
      if (!countryTimeZone) {
        error.countryTimeZone = errorMessages.PROVIDE_COUNTRY_NAME;
        isFormValid = false;
      } else error.countryTimeZone = "";
      if (!selectedTimezone) {
        error.selectedTimezone = errorMessages.PROVIDE_TIMEZONE;
        isFormValid = false;
      } else error.selectedTimezone = "";
    } else if (type === "addCurrency") {
      if (!selectedCountryCurrency) {
        error.selectedCountryCurrency = errorMessages.PROVIDE_COUNTRY_NAME;
        isFormValid = false;
      } else error.selectedCountryCurrency = "";
      if (!countryCurrencyCode) {
        error.countryCurrencyCode = errorMessages.PROVIDE_CURRENCY;
        isFormValid = false;
      } else error.countryCurrencyCode = "";
    }
    setErrors(error);
    setIsFormValid(isFormValid);
    return isFormValid;
  };
  /******************* 
  @Purpose : Used for add country information
  @Parameter : e, type
  @Author : INIC
  ******************/
  const addCountryInfo = async (e, type) => {
    let body;
    if (validateForm(type)) {
      e.preventDefault();
      if (type === "addCountry") {
        body = {
          countryName: countryName.label,
          countryCode: countryName.value,
          phoneCode: countryCode,
          currency:
            countryCurrencyCode && countryCurrencyCode != undefined
              ? countryCurrencyCode
              : "",
          usdTo: (1/conversionRate).toFixed(4),
          toUsd: conversionRate
        };
      }
      const response = await props.callApi(
        API.ADD_UPDATE_COUNTRY,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Data added successfully", "success")
        setShow(false);
        setEditCountry(false);
        getAllCountryList();
      }
    }
  };
  /******************* 
  @Purpose : Used for update country information
  @Parameter : e
  @Author : INIC
  ******************/
  const updateCountryInfo = async (e) => {
    let body;
    let updateName = !countryName ? defaultCountry.label : countryName.label;
    let updateCode = !countryName ? defaultCountry.value : countryName.value;
    let updatePhoneCode = !countryCode ? countryDetails.phoneCode : countryCode;
    let updateCurrency = !countryCurrencyCode
      ? currencyArray.currency
      : countryCurrencyCode;
      let usdTo = !conversionRate ? countryDetails.usdTo : (1/conversionRate).toFixed(4);
      let toUsd = !conversionRate ? countryDetails.toUsd : conversionRate
    e.preventDefault();

    body = {
      countryName: updateName,
      countryCode: updateCode,
      phoneCode: updatePhoneCode,
      countryId: countryDetails._id,
      currency: updateCurrency,
      usdTo,
      toUsd
    };
    const response = await props.callApi(
      API.ADD_UPDATE_COUNTRY,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      showMessageNotification("Data added successfully", "success")
      setShow(false);
      setEditCountry(false);
      getAllCountryList();
    }
  };
  /******************* 
  @Purpose : Used for update timezone information
  @Parameter : e
  @Author : INIC
  ******************/
  const updateTimezoneInfo = async (e) => {
    let body;
    let updateCountry = !countryTimeZone
      ? timezoneArray.countryId.countryName
      : countryTimeZone.label;
    let countryID = !countryTimeZone
      ? timezoneArray.countryId._id
      : countryTimeZone.value;
    let updateTimeZone = !selectedTimezone
      ? timezoneArray.timezone
      : selectedTimezone;
    e.preventDefault();

    if (validateForm("addTimezone")) {
      body = {
        countryName: updateCountry,
        timezone: updateTimeZone.label,
        phoneCode: timezoneArray.countryId.phoneCode,
        countryId: countryID,
        timezoneId: timezoneArray._id,
      };
      const response = await props.callApi(
        API.ADD_UPDATE_TIMEZONE,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Data added successfully", "success")
        setTimeZone(false);
        setEditTimeZone(false);
        getAllTimezoneList();
      }
    }
  };
  /******************* 
  @Purpose : Used for update currancy information
  @Parameter : e
  @Author : INIC
  ******************/
  const updateCurrancyInfo = async (e) => {
    let body;
    let updateCountry = !selectedCountryCurrency
      ? currencyArray.countryId.countryName
      : selectedCountryCurrency.label;
    let countryID = !selectedCountryCurrency
      ? currencyArray.countryId._id
      : selectedCountryCurrency.value;
    let updateCurrency = !countryCurrencyCode
      ? currencyArray.currency
      : countryCurrencyCode.value;
    e.preventDefault();
    if (validateForm("addCurrency")) {
      body = {
        countryName: updateCountry,
        currency: updateCurrency,
        currencyId: currencyArray._id,
        countryId: countryID,
      };
      const response = await props.callApi(
        API.ADD_UPDATE_CURRENCY,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Data added successfully", "success")
        setCurrency(false);
        setEditCurrency(false);
        getAllCurrencyList();
      }
    }
  };
  /******************* 
  @Purpose : Used for add timezone information
  @Parameter : e, type
  @Author : INIC
  ******************/
  const addTimezoneInfo = async (e, type) => {
    e.preventDefault();
    if (validateForm(type)) {
      if (type === "addTimezone") {
        var body = {
          countryName: countryTimeZone.label,
          countryId: countryTimeZone.value,
          timezone: selectedTimezone.label,
        };
      }
      const response = await props.callApi(
        API.ADD_UPDATE_TIMEZONE,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Data added successfully", "success")
        setTimeZone(false);
        setEditTimeZone(false);
        getAllTimezoneList();
      }
    }
  };
  /******************* 
  @Purpose : Used for add currancy information
  @Parameter : e, type
  @Author : INIC
  ******************/
  const addCurrancyInfo = async (e, type) => {
    if (validateForm(type)) {
      e.preventDefault();
      if (type === "addCurrency") {
        var body = {
          countryName: selectedCountryCurrency.label,
          currency: countryCurrencyCode.value,
          countryId: selectedCountryCurrency.value,
        };
      }
      const response = await props.callApi(
        API.ADD_UPDATE_CURRENCY,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        showMessageNotification("Data added successfully", "success")
        setCurrency(false);
        setEditCurrency(false);
        getAllCurrencyList();
      }
    }
  };
  /******************* 
  @Purpose : Used for get all timezone information
  @Parameter : {}
  @Author : INIC
  ******************/
  const getAllTimezoneList = async () => {
    var body = {
      page: timezonepage,
      pagesize: timezonePagesize,
      columnKey: "timezoneListing",
    };
    const response = await props.callApi(
      API.TIMEZONE_LISTING,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      setTimezoneListing(response.data.listing);
      setTimezoneTotal(response.total);
      setLoading(false);
    }
  };
  /******************* 
  @Purpose : Used for get all country information
  @Parameter : {}
  @Author : INIC
  ******************/
  const getAllCountryList = async () => {
    var body = {
      page: page,
      pagesize: pagesize,
      columnKey: "countriesListing",
    };
    const response = await props.callApi(
      API.COUNTRY_LIST,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      setCountryListing(response.data.listing);
      setTotal(response.total);
      let countryLists = [];
      let list = [];
      list = response.data.listing;

      list.forEach((item) => {
        countryLists.push({
          label: item.countryName,
          value: item._id,
        });
      });

      setSelectedCountryName(countryLists);
      setLoading(false);
    }
  };
  /******************* 
  @Purpose : Used for get all currency information
  @Parameter : {}
  @Author : INIC
  ******************/
  const getAllCurrencyList = async () => {
    var body = {
      page: currencyPage,
      pagesize: currencyPagesize,
      columnKey: "currenciesListing",
    };
    const response = await props.callApi(
      API.CURRENCY_LIST,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      setCurrencylisting(response.data.listing);
      setCurrencyTotal(response.total);
      setLoading(false);
    }
  };
  /******************* 
  @Purpose : Used for pagination data for country
  @Parameter : page, pageSize
  @Author : INIC
  ******************/
  const paginationCountry = (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
  };
  /******************* 
  @Purpose : Used for pagination data for timezone
  @Parameter : page, pageSize
  @Author : INIC
  ******************/
  const paginationTimezone = (pageNo, pageSize) => {
    setTimezonePage(pageNo);
    setTimezonePagesize(pageSize);
  };
  /******************* 
  @Purpose : Used for get country details
  @Parameter : id
  @Author : INIC
  ******************/
  const getCountryDetails = async (id) => {
    setEditCountry(true);
    setShow(true);
    const response = await props.callApi(
      API.GET_COUNTERY_DETAILS + id,
      "",
      "get",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      setCountryDetails(response.data);
      let code = response.data.countryCode;
      let res = code.toLowerCase();
      setLowerCasePhoneCode(res);
      setDefaultCountry((prev) => ({
        ...prev,
        value: response.data.countryCode,
        label: response.data.countryName,
      }));
      setPhonenumber(response.data.phoneCode);
      setCountryCurrencyCode(response.data.currency);
      setConversionRate(response.data.toUsd)
    }
  };
  /******************* 
  @Purpose : Used for timezone details
  @Parameter :id
  @Author : INIC
  ******************/
  const getTimeZoneDetails = async (id) => {
    setEditTimeZone(true);
    setTimeZone(true);
    const response = await props.callApi(
      API.GET_TIMEZONE_DETAILS + id,
      "",
      "GET",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      let obj = {};
      obj.label = response.data.timezone;
      obj.value = response.data.timezone;
      setTimezoneArray(response.data);
      let obj1 = {};
      obj1.label =
        response.data.countryId && response.data.countryId.countryName;
      obj1.value = response.data._id && response.data.countryId._id;
      setSelectedTimezone(obj);
      setCountryTimeZone(obj1);
    }
  };
  /******************* 
  @Purpose : Used for delete country
  @Parameter : cId
  @Author : INIC
  ******************/
  const deleteCountries = async (cId) => {
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
          var body = { countriesIds: delArr };
        } else {
          body = { countriesIds: [cId] };
        }
        const response = await props.callApi(
          API.DELETE_COUNTRIES,
          body,
          "post",
          null,
          true,
          false,
          ADMIN_URL
        );
        if (response.status === 1) {
          showMessageNotification("Deleted successfully", "success")
          setPage(1);
          setPagesize(10);
          getAllCountryList();
          getAllTimezoneList();
          // getAllCurrencyList();
        }
      }
    });
  };
  /******************* 
  @Purpose : Used for delete timezones
  @Parameter : tId
  @Author : INIC
  ******************/
  const deleteTimezone = async (tId) => {
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
          var body = { timezoneIds: delArr };
        } else {
          body = { timezoneIds: [tId] };
        }
        const response = await props.callApi(
          API.DELETE_TIMEZONE,
          body,
          "post",
          null,
          true,
          false,
          ADMIN_URL
        );
        if (response.status === 1) {
          showMessageNotification("Deleted successfully", "success")
          setPage(1);
          setPagesize(10);
          getAllTimezoneList();
        }
      }
    });
  };
  /******************* 
  @Purpose : Used for add/update country information
  @Parameter : event
  @Author : INIC
  ******************/
  const addUpdateFunction = (event) => {
    if (!editCountry) {
      addCountryInfo(event, "addCountry");
    } else {
      updateCountryInfo(event);
    }
  };
  /******************* 
  @Purpose : Used for add/update timezone information
  @Parameter : event
  @Author : INIC
  ******************/
  const addUpdateTimezoneInfo = (event) => {
    if (!editTimeZone) {
      addTimezoneInfo(event, "addTimezone");
    } else {
      updateTimezoneInfo(event);
    }
  };
  /******************* 
  @Purpose : Used for add/update currency information
  @Parameter : event
  @Author : INIC
  ******************/
  const addUpdateCurrencyInfo = (event) => {
    if (!editCurrency) {
      addCurrancyInfo(event, "addCurrency");
    } else {
      updateCurrancyInfo(event);
    }
  };
  /******************* 
  @Purpose : Used for search fields
  @Parameter : evtKey
  @Author : INIC
  ******************/
  const searchField = async (evtKey) => {
    var body = {
      page: page,
      pagesize: pagesize,
      searchText: searchText && searchText.length > 1 ? searchText : "",
    };
    if (evtKey === "country") {
      const response = await props.callApi(
        API.COUNTRY_LIST,
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        setCountryListing(response.data.listing);
        setTotal(response.total);
        // getAllCurrencyList();
        getAllTimezoneList();
      }
    } else if (evtKey === "timezone") {
      const response = await props.callApi(
        "/timezoneListing",
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        setTimezoneListing(response.data.listing);
        setTimezoneTotal(response.data.listing.length);
        getAllCountryList();
        // getAllCurrencyList();
      }
    } else if (evtKey === "currency") {
      const response = await props.callApi(
        "/currenciesListing",
        body,
        "post",
        null,
        true,
        false,
        ADMIN_URL
      );
      if (response.status === 1) {
        setCurrencylisting(response.data.listing);
        setCurrencyTotal(response.data.listing.length);
        getAllCountryList();
        getAllTimezoneList();
        // ;setCurrencyTotal(response.total);
      }
    }
  };
  /******************* 
  @Purpose : Used for country status handler
  @Parameter : status, countryId
  @Author : INIC
  ******************/
  const countryStatusHandler = async (status, countryId) => {
    setCountryStatus((current) => !current);
    var body = { countriesIds: [countryId], status: status };
    const response = await props.callApi(
      API.COUNTRY_STATUS,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      showMessageNotification("Status updated successfully", "success")
      getAllCountryList();
    }
  };
  /******************* 
  @Purpose : Used for timezone status handler
  @Parameter : status, timezoneId
  @Author : INIC
  ******************/
  const timeZoneStatusHandler = async (status, timezoneId) => {
    setTimeZoneStatus((current) => !current);
    var body = { timezoneIds: [timezoneId], status };
    const response = await props.callApi(
      API.TIMEZONE_STATUS,
      body,
      "post",
      null,
      true,
      false,
      ADMIN_URL
    );
    if (response.status === 1) {
      showMessageNotification("Status updated successfully", "success")
      getAllTimezoneList();
    }
  };
  /******************* 
  @Purpose : Used for clear all form field value
  @Parameter : status, timezoneId
  @Author : INIC
  ******************/
  const clearInput = () => {
    setSearchtext("");
    getAllCountryList();
    getAllTimezoneList();
    getAllCurrencyList();
  };

  return (
    <Layout>
      <div className="main-content-area">
        <div className="main-content-block">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="content-header-title">
                {lang("MasterMangement.master")}
              </li>
              <li className="breadcrumb-item">
                <Link
                  onClick={() => {
                    props.history.push("/dashboard");
                  }}
                >
                  <i className="bx bx-home-alt"></i>
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {lang("MasterMangement.manageMaster")}
              </li>
            </ol>
          </nav>
          <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap">
            <div className="d-flex align-items-center">
              <div className="search position-relative has-icon-left">
                <input
                  type="search"
                  value={searchText}
                  className="form-control text-capitalize"
                  placeholder="search"
                  onChange={(evt) => {
                    searchField(eventKeys);
                    setSearchtext(evt.target.value);
                  }}
                />

                {searchText && searchText.length > 0 ? (
                  <div className="clear">
                    <span onClick={clearInput}>
                      <em className="bx bx-x"></em>
                    </span>
                  </div>
                ) : null}

                <div className="form-control-position">
                  <em className="bx bx-search"></em>
                </div>
              </div>
            </div>
            <Button
              type="button"
              onClick={modelOnAddBtn}
              className="btn btn-primary glow-primary"
            >
              {lang("MasterMangement.add")}
            </Button>
            <Modal show={show} onHide={modelCloseFun}>
              <Modal.Header closeButton>
                <div class="d-flex align-items-center">
                  <div class="icon mr-2">
                    <span class="bx bxs-plus-circle"></span>
                  </div>
                  <h5 class="modal-title" id="exampleModalLongTitle">
                    {lang("MasterMangement.addCountry")}
                  </h5>
                </div>
              </Modal.Header>
              <Modal.Body closeButton>
                <div class="notification-form">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group mb-4">
                        <label class="mb-0" for="CountryName">
                          {lang("MasterMangement.countryName")}
                          <sup className="text-danger">*</sup>
                        </label>

                        <Select
                          placeholder={
                            editCountry && countryDetails
                              ? defaultCountry.label
                              : "Please Select Country"
                          }
                          options={options}
                          ref={selectInputRef}
                          defaultValue={
                            editCountry && countryDetails ? defaultCountry : ""
                          }
                          value={countryName}
                          onChange={changeHandler}
                          className="country-name"
                        />
                        <span className="error-msg" style={{ color: "red" }}>
                          {errors.countryName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {countryName !== null ||
                  countryDetails.countryCode !== undefined ? (
                    <div className="row">
                      <div class="col-md-6">
                        <div class="form-group mb-5">
                          <label class="mb-0" for="CountryCode">
                            {lang("MasterMangement.countryCode")}
                            <sup className="text-danger">*</sup>
                          </label>
                          <span className="d-block input-code">
                            {countryName && countryName.value
                              ? countryName.value
                              : editCountry
                              ? countryDetails.countryCode
                              : "Country Code"}
                          </span>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group mb-2">
                          <label class="mb-0" for="PhoneCode">
                            {lang("MasterMangement.phoneCode")}
                            <sup className="text-danger">*</sup>
                          </label>
                          <span className="d-block input-code">
                            {phonenumber ? phonenumber : null}
                          </span>
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.countryCode}
                          </span>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group mb-2">
                          <label class="mb-0" for="PhoneCode">
                            currency
                          </label>
                          <span className="d-block input-code">
                            {countryCurrencyCode ? countryCurrencyCode : null}
                          </span>
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.countryCode}
                          </span>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group mb-2">
                          <label class="mb-0" for="PhoneCode">
                            USD conversion
                          </label>
                          {(countryCurrencyCode && conversionRate) && <label class="mb-0" for="PhoneCode">
                          ($1 USD = {conversionRate}{countryCurrencyCode})
                          (1{countryCurrencyCode} = ${(1/conversionRate).toFixed(4)} USD)
                            </label>}
                          <span className="d-block input-code">
                            <input type="number" value={conversionRate} onChange={(e)=>setConversionRate(e.target.value)} /> 
                           
                          </span>
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.conversionRate}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div className="row">
                    <div className="col-md-12">
                      <div class="modal-btn">
                        <Link
                          href="#"
                          onClick={(event) => addUpdateFunction(event)}
                          class="btn btn-primary"
                        >
                          {lang("MasterMangement.add")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
            {eventKeys === "timezone" ? (
              <Modal show={showTimeZone} onHide={modelCloseFun}>
                <Modal.Header closeButton>
                  <div class="d-flex align-items-center">
                    <div class="icon mr-2">
                      <span class="bx bxs-plus-circle"></span>
                    </div>
                    <h5 class="modal-title" id="exampleModalLongTitle">
                      {lang("MasterMangement.addCountryTimeZone")}
                    </h5>
                  </div>
                </Modal.Header>
                <Modal.Body closeButton>
                  <div class="notification-form">
                    <div class="row">
                      <div class="col-md-12">
                        <div class="form-group mb-4">
                          <label class="mb-0" for="CountryName">
                            {lang("MasterMangement.countryName")}
                            <sup className="text-danger">*</sup>
                          </label>
                          <Select
                            placeholder={
                              editTimeZone && timezoneArray
                                ? timezoneArray.countryId.countryName
                                : "Please Select Country"
                            }
                            options={selectedCountryName}
                            value={countryTimeZone}
                            onChange={changeCountryTimeZoneHandlr}
                          />
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.countryTimeZone}
                          </span>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group mb-5">
                          <label class="mb-0" for="CountryCode">
                            {lang("MasterMangement.timeZone")}
                            <sup className="text-danger">*</sup>
                          </label>

                          <Select
                            placeholder={
                              editTimeZone && specificTimezone.label
                                ? specificTimezone.label
                                : "Please Select Time Zone"
                            }
                            options={specificTimezone}
                            value={selectedTimezone}
                            onChange={changeTimeZone}
                          />
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.selectedTimezone}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div class="modal-btn">
                          <Link
                            href="#"
                            class="btn btn-primary"
                            onClick={(e) => addUpdateTimezoneInfo(e)}
                          >
                            Add
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            ) : null}
            {eventKeys === "currency" ? (
              <Modal show={showCurrency} onHide={modelCloseFun}>
                <Modal.Header closeButton>
                  <div class="d-flex align-items-center">
                    <div class="icon mr-2">
                      <span class="bx bxs-plus-circle"></span>
                    </div>
                    <h5 class="modal-title" id="exampleModalLongTitle">
                      {lang("MasterMangement.addCurrency")}
                    </h5>
                  </div>
                </Modal.Header>
                <Modal.Body closeButton>
                  <div class="notification-form">
                    <div class="row">
                      <div class="col-md-12">
                        <div class="form-group mb-4">
                          <label class="mb-0" for="CountryName">
                            {lang("MasterMangement.countryName")}
                            <sup className="text-danger">*</sup>
                          </label>

                          <Select
                            placeholder={
                              editCurrency && currencyArray
                                ? currencyArray.countryId.countryName
                                : "Please Select Country"
                            }
                            options={selectedCountryName}
                            value={selectedCountryCurrency}
                            onChange={changeCurrencyCountryHndlr}
                          />
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.selectedCountryCurrency}
                          </span>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group mb-5">
                          <label class="mb-0" for="CountryCode">
                            {lang("MasterMangement.currency")}
                            <sup className="text-danger">*</sup>
                          </label>
                          <Select
                            placeholder={"Please Select Country Currency Code"}
                            options={currencyCodeOptions}
                            value={countryCurrencyCode}
                            onChange={changeCountryCurrencyHandler}
                          />
                          <span className="error-msg" style={{ color: "red" }}>
                            {errors.countryCurrencyCode}
                          </span>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="modal-btn">
                          <Link
                            href="#"
                            class="btn btn-primary"
                            onClick={(e) => addUpdateCurrencyInfo(e)}
                          >
                            {lang("MasterMangement.add")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            ) : null}
          </div>
          <div className="card notification-card tabs-block p-0">
            <Tabs
              defaultActiveKey="country"
              id="uncontrolled-tab-example"
              className="pl-5 pt-3"
              onSelect={(eventKey) => setEventKeys(eventKey)}
            >
              <Tab
                eventKey="country"
                title={lang("MasterMangement.countryName")}
              >
                <div className="card-body content">
                  <div className="table-responsive">
                    <table
                      className="table row-border nowrap common-datatable"
                      id="master-country-listing"
                    >
                      <thead>
                        <tr>
                          <th className="all">
                            <b>{lang("MasterMangement.countryName")}</b>
                          </th>
                          <th className="all">
                            <b>{lang("MasterMangement.countryCode")}</b>
                          </th>
                          <th className="all">
                            <b>{lang("MasterMangement.phoneCode")}</b>
                          </th>
                          <th className="all">
                            <b>{lang("MasterMangement.currency")}</b>
                          </th>
                          <th className="all">
                            <b>{lang("MasterMangement.status")}</b>
                          </th>
                          <th className="all">
                            <b>{lang("MasterMangement.action")}</b>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {countryListing && countryListing.length === 0 ? (
                          <tr className="text-center text-danger not-found-txt">
                            <td colSpan="6">
                              {loading ? <Loader /> : null}{" "}
                              {!loading ? (
                                <h6
                                  className="text-center text-danger not-found-txt"
                                  colSpan="6"
                                >
                                  {lang("MasterMangement.noRecord")}
                                </h6>
                              ) : null}
                            </td>
                          </tr>
                        ) : (
                          countryListing &&
                          Array.isArray(countryListing) &&
                          countryListing.map((list, listKey) => {
                            return (
                              <tr key={listKey}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <ReactCountryFlag
                                      countryCode={list.countryCode}
                                      svg
                                      style={{
                                        marginRight: "10px",
                                      }}
                                    />
                                    <span>{list.countryName}</span>
                                  </div>
                                </td>
                                <td>
                                  <span>{list.countryCode}</span>
                                </td>
                                <td>
                                  <span>{`+ ${list.phoneCode}`}</span>
                                </td>
                                <td>
                                  <span>{list.currency}</span> - (
                                  {getSymbolFromCurrency(list.currency)})
                                </td>
                                <td>
                                  <div className="custom-control custom-switch light">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      id={list._id}
                                      checked={
                                        list.status ? list.status : false
                                      }
                                      onChange={() => {
                                        list.status = !list.status;
                                        countryStatusHandler(
                                          list.status,
                                          list._id
                                        );
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      for={list._id}
                                    ></label>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex">
                                    <a
                                      className="cursor-pointer mr-3"
                                      onClick={() =>
                                        getCountryDetails(list._id)
                                      }
                                    >
                                      <i className="bx bx-edit"></i>
                                    </a>
                                    <a
                                      className="cursor-pointer"
                                      onClick={() => deleteCountries(list._id)}
                                    >
                                      <i className="bx bx-trash-alt"></i>
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
                  <div className="mt-3">
                    <Pagination
                      pageSize={pagesize}
                      current={page}
                      total={total}
                      onChange={paginationCountry}
                    />
                  </div>
                </div>
              </Tab>
              <Tab
                eventKey="timezone"
                title={lang("MasterMangement.timeZone")}
              >
                <div className="card-body content">
                  <div className="table-responsive">
                    <table
                      className="table row-border nowrap common-datatable"
                      id="master-timezone-listing"
                    >
                      <thead>
                        <tr>
                          <th className="all">
                            <b>{lang("MasterMangement.countryName")}</b>
                          </th>
                          <th className="all">
                            <b>{lang("MasterMangement.timeZone")}</b>
                          </th>
                          <th className="all">
                            <b>{lang("MasterMangement.status")}</b>
                          </th>
                          <th className="all">
                            <b>{lang("MasterMangement.action")}</b>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {timezoneListing && timezoneListing.length === 0 ? (
                          <tr className="text-center text-danger not-found-txt">
                            <td colSpan="6">
                              {loading ? <Loader /> : null}{" "}
                              {!loading ? (
                                <h6
                                  className="text-center text-danger not-found-txt"
                                  colSpan="6"
                                >
                                  {lang("MasterMangement.noRecord")}
                                </h6>
                              ) : null}
                            </td>
                          </tr>
                        ) : (
                          timezoneListing &&
                          Array.isArray(timezoneListing) &&
                          timezoneListing.map((list, listKey) => {
                            return (
                              <tr key={listKey}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <ReactCountryFlag
                                      countryCode={list.countryCode}
                                      svg
                                      style={{
                                        marginRight: "10px",
                                      }}
                                    />
                                    <span>{list.countryName}</span>
                                  </div>
                                </td>
                                <td>
                                  <span>{list.timezone}</span>
                                </td>
                                <td>
                                  <div className="custom-control custom-switch light">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      id={list._id}
                                      checked={
                                        list.status ? list.status : false
                                      }
                                      onChange={() => {
                                        list.status = !list.status;
                                        timeZoneStatusHandler(
                                          list.status,
                                          list._id
                                        );
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      for={list._id}
                                    ></label>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex">
                                    <a
                                      className="cursor-pointer mr-3"
                                      onClick={() =>
                                        getTimeZoneDetails(list._id)
                                      }
                                    >
                                      <i className="bx bx-edit"></i>
                                    </a>
                                    <a
                                      className="cursor-pointer"
                                      onClick={() => deleteTimezone(list._id)}
                                    >
                                      <i className="bx bx-trash-alt"></i>
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
                  <div className="mt-3">
                    <Pagination
                      pageSize={timezonePagesize}
                      current={timezonepage}
                      total={timezoneTotal}
                      onChange={paginationTimezone}
                    />
                  </div>
                </div>
              </Tab>
             
            </Tabs>
          </div>
        </div>
        <footer>
          <div className="footer-text d-flex align-items-centerf justify-content-between">
            <span className="d-block">2020 © IndiaNIC</span>
          </div>
        </footer>
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
export default connect(mapStateToProps, { callApi })(MasterManagement);
