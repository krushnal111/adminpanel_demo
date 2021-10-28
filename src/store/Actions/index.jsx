import { useState, useEffect } from "react";
import { setItem } from "./../../utils/Functions"; // Utility dunctions
// Default Value
const languageKey = "language";
const themeKey = "theme";
const resizeKey = "resize";
const sidebarKey = "sidebar";

/******************* 
@Purpose : Edit User
@Parameters : id
@Author : INIC
******************/
export const editUser = (id) => async (dispatch) => {
  dispatch({ type: "EDIT_USER", payload: id });
};
/******************* 
@Purpose : Edit Email
@Parameters : id
@Author : INIC
******************/
export const editEmail = (id) => async (dispatch) => {
  dispatch({ type: "EDIT_EMAIL", payload: id });
};
/******************* 
@Purpose : Change Language
@Parameters : body
@Author : INIC
******************/
export const changeLanguage = (body) => async (dispatch) => {
  setItem(languageKey, body.language);
  const payload = {
    data: body.language,
  };
  await dispatch({ type: "language", payload });
};
/******************* 
@Purpose : Change Theme
@Parameters : body
@Author : INIC
******************/
export const changeTheme = (body) => async (dispatch) => {
  setItem(themeKey, body);
  const payload = {
    data: body,
  };
  await dispatch({ type: "theme", payload });
};
/******************* 
@Purpose : Change Sidebar Collapse
@Parameters : body
@Author : INIC
******************/
export const sidebaropen = (body) => async (dispatch) => {
  setItem(sidebarKey, body);
  const payload = {
    data: body,
  };
  await dispatch({ type: "sidebar", payload });
};
/******************* 
@Purpose : Change Screen Resize Value
@Parameters : body
@Author : INIC
******************/
export const changeResize = (body) => async (dispatch) => {
  setItem(resizeKey, body);
  const payload = {
    data: body,
  };
  await dispatch({ type: "resize", payload });
};
/******************* 
@Purpose : Change Screen Resize Value
@Parameters :{}
@Author : INIC
******************/
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
};
