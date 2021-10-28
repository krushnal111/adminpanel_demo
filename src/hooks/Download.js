import { useState } from "react";
import errorMessages from "../utils/ErrorMessages";
import { ADMIN_URL, URL, PUBLIC_FILE_URL } from "../config"; // Default configuration
import { getItem, showMessageNotification } from "../utils/Functions"; // Utility functions
import axios from "axios";
import API from "../api/Routes";
/******************* 
@Purpose : Used for download files
@Parameter : {}
@Author : INIC 
******************/
export const useDownload = () => {
  const [bgColor, setBgColor] = useState("");
  const [tempName, setTempName] = useState("");
  const [savedTemp, setSavedTemp] = useState([]);
  const [isFormValid, setIsFormValid] = useState(true);
  const [filterName] = useState("");
  var [errors, setErrors] = useState({});
  const [templateSettings, setTemplateSettings] = useState({
    photo: false,
    firstName: false,
    lastName: false,
    emailId: false,
    mobile: false,
    emailVerificationStatus: false,
    status: false,
  });
  /******************* 
@Purpose : Used for form validate
@Parameter : type
@Author : INIC
******************/
  const validateForm = (type) => {
    let formError = { tempName, filterName };
    let isValidForm = true;
    if (type === "filter") {
      if (!filterName.trim()) formError.filterName = errorMessages.PROVIDE_NAME;
      else formError.filterName = "";

      if (errors.filterName !== "") isValidForm = false;

      setErrors(formError);
      setIsFormValid(isValidForm);
      return isValidForm;
    } else {
      if (!tempName.trim()) formError.tempName = errorMessages.PROVIDE_NAME;
      else formError.tempName = "";

      if (formError.tempName !== "") isValidForm = false;

      setErrors(formError);
      setIsFormValid(isValidForm);
      return isValidForm;
    }
  };
  /******************* 
@Purpose : Used for download file
@Parameter : tab
@Author : INIC
******************/
  const downloadUserFiles = async (tab) => {
    var body = {
      filteredFields: [
        "firstName",
        "lastName",
        "emailId",
        "status",
        "photo",
        "mobile",
        "emailVerification",
      ],
      type: tab,
    };
    axios({
      url: ADMIN_URL + API.DOWNLOAD_FILE,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: getItem("accessToken"),
      },
      data: JSON.stringify(body),
    }).then((response) => {
      let d1 = response.data;
      var data1;
      if (tab === "csv") {
        data1 = PUBLIC_FILE_URL + "/csv/" + d1.data.filePathAndName;
      } else if (tab === "excel") {
        data1 = PUBLIC_FILE_URL + "/excel/" + d1.data.filePathAndName;
      } else if (tab === "pdf") {
        data1 = PUBLIC_FILE_URL + "/pdf/" + d1.data.filePathAndName;
      } else if (tab === "print") {
        data1 = PUBLIC_FILE_URL + "/print/" + d1.data.filePathAndName;
      }
      window.open(data1, "_blank");
      showMessageNotification("Downloaded file successfully", "success");
    });
  };
  /******************* 
@Purpose : Used for save templets
@Parameter : key
@Author : INIC
******************/
  const saveTemplets = (key) => {
    if (validateForm()) {
      var body = {
        key: key,
        description: tempName,
        columns: [templateSettings],
        color: bgColor,
      };
      axios({
        url: ADMIN_URL + "/saveTemplateSettings",
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: getItem("accessToken"),
        },
        data: JSON.stringify(body),
      }).then((response) => {
        showMessageNotification("Filter Saved Successfully", "success");
        setSavedTemp(response.data);
        setBgColor("");
        setTemplateSettings({});
        setTempName("");
      });
    }
  };

  return [
    saveTemplets,
    setSavedTemp,
    downloadUserFiles,
    bgColor,
    tempName,
    savedTemp,
    isFormValid,
    errors,
    templateSettings,
    setTemplateSettings,
    setErrors,
    setIsFormValid,
    setBgColor,
    setTempName,
  ];
};
