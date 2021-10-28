import axios from "axios";
import { API_URL } from "../config"; //Project Configuration
import { getItem, showModalNotification } from "../utils/Functions"; // Utility function


//API Responce Handler
axios.interceptors.response.use(
  (response) => {
    return response;``
  },
  (error) => {
    if (error && error.response && 401 === error.response.status) {
      // showModalNotification("Token Expired", "error");
      // removeItem("accessToken");
      // window.location.href = "/";
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
);

/******************* 
@Purpose : We can use following api calls and can change api name easily
@Parameters : url, data, method, type, isAuthorized, isForm
@Author : INIC
******************/
export const callApi = (
  url,
  data,
  method,
  Type = null,
  isAuthorized = false,
  isForm = false,
  MAPI_URL = ""
) => (dispatch) => {
  url = MAPI_URL ? MAPI_URL + url : API_URL + url;
  let headers = { "Content-Type": "application/json","language": getItem("language") };
  if (isAuthorized) headers.Authorization = getItem("accessToken");
  if (isForm) headers["Content-Type"] = "multipart/form-data";
  return new Promise((resolve, reject) => {
    axios({ method, url, headers, data })
      .then((response) => {
        let { data: responseData } = response;
        if (response && responseData.status === 1) {
          if (Type !== null) {
            var payload = { data: responseData.data };
            dispatch({ type: Type, payload });
          }
        } else {
          showModalNotification(
            responseData.message
              ? responseData.message
              : "Something went wrong!",
            "error"
          );
        }
        resolve(responseData);
      })
      .catch((error) => {
        showModalNotification(
          error.response.data.message
            ?  typeof error.response.data.message == "string" ? error.response.data.message : error.response.data.message[0].msg
            : "Something went wrong!",
          "error"
        );
        reject(error);
      });
  });
};
