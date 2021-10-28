import swal from "sweetalert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
/******************* 
@Purpose : Store Data To local Storage
@Parameter : key, value
@Author : INIC
******************/
export const setItem = (key, value) => {
  localStorage.setItem(key, value);
};
/******************* 
@Purpose : Get Data From local Storage
@Parameter : key
@Author : INIC
******************/
export const getItem = (key) => {
  return localStorage.getItem(key);
};
/******************* 
@Purpose : Remove Data in local Storage
@Parameter : key
@Author : INIC
******************/
export const removeItem = (key) => {
  localStorage.removeItem(key);
};
/******************* 
@Purpose : Email Validation
@Parameter : email
@Author : INIC
******************/
export const validateEmail = (email) => {
  var pattern = new RegExp(
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  return pattern.test(email);
};
/******************* 
@Purpose : App ID and secret Validation
@Parameter : id
@Author : INIC
******************/
export const validateIDSecret = (id) => {
  const pattern = new RegExp(/^[a-zA-Z0-9_]{5,50}$/);
  return pattern.test(id);
};
/******************* 
@Purpose : Password Validation
@Parameter : pass
@Author : INIC
******************/
export const validatePassword = (pass) => {
  var pattern = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-!$@#%^&*()_+|~=`{}\[\]:";'<>?,.\/])[A-Za-z\d-!$@#%^&*()_+|~=`{}\[\]:";'<>?,.\/]{6,20}$/
  );
  return pattern.test(pass);
};
/******************* 
@Purpose : Username Validation
@Parameter : name
@Author : INIC
******************/
export const validateUsername = (name) => {
  var pattern = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_%-*?&#])[A-Za-z\d@$!_%-*?&#]{5,}$/
  );
  return pattern.test(name);
};
/******************* 
@Purpose : Port Validation
@Parameter : port
@Author : INIC
******************/
export const validatePort = (port) => {
  var pattern = new RegExp(/^([0-9]){3,4}$/);
  return pattern.test(port);
};
/******************* 
@Purpose : Hostname Validation
@Parameter : name
@Author : INIC
******************/
export const validateHostName = (name) => {
  var pattern = new RegExp(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/
  );
  return pattern.test(name);
};
/******************* 
@Purpose : Mobile Number Validation
@Parameter : mobileNo
@Author : INIC
******************/
export const validateMobileNumber = (mobileNo) => {
  var pattern = new RegExp(
    /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  );
  return pattern.test(mobileNo);
};
/******************* 
@Purpose : First and Last Name Validation
@Parameter : name
@Author : INIC
******************/
export const validateName = (name) => {
  const pattern = new RegExp(/^[a-z ,.'-]+$/i);
  return pattern.test(name);
};
/******************* 
@Purpose : Character Validation
@Parameter : e
@Author : INIC
******************/
export const allowChar = (e) => {
  const pattern = new RegExp(/^[a-zA-Z\s]{0,255}$/);
  return pattern.test(e);
};
/******************* 
@Purpose : URL Validation
@Parameter : url
@Author : INIC
******************/
export const validateURL = (url) => {
  const pattern = new RegExp(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return pattern.test(url);
};
/******************* 
@Purpose : Number Validation
@Parameter : number
@Author : INIC
******************/
export const allowNumbers = (number) => {
  const pattern = new RegExp(/^[0-9\b]+$/);
  return pattern.test(number);
};
/******************* 
@Purpose : Used for show modal notification
@Parameter : text, type, timer, position, buttons, className
@Author : INIC
******************/
export const showModalNotification = (
  text,
  type = "success",
  timer = 2500,
  position = "center",
  buttons = false
) => {
  swal({
    position: position,
    icon: type,
    text: text,
    buttons: buttons,
    timer: timer,
    className: "custom-toaster",
  });
};
/******************* 
@Purpose : Used for show message notification
@Parameter : text, type, autoClose, position
@Author : INIC
******************/
export const showMessageNotification = (
  text,
  type = "success",
  autoClose = 1500,
  position = "top-right",
) => {
  toast[type](text, {
    position: position,
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
/******************* 
@Purpose : Pincode Validation
@Parameter : msg
@Author : INIC
******************/
export const validatePincodeNumber = (mobileNo) => {
  var pattern = new RegExp(/^[0-9]{5}(?:-[0-9]{4})?$/);
  return pattern.test(mobileNo);
};
/******************* 
@Purpose : Used for change langauge
@Parameter : body
@Author : INIC
******************/
export const changeLanguage = (body) => async (dispatch) => {
  setItem("language", body.language);
  const payload = {
    data: body.language,
  };
  dispatch({ type: "language", payload });
};
