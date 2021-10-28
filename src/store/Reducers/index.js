import { combineReducers } from "redux";
import Admin from "./Admin";
/******************* 
@Purpose : Used for combine all reducer in single place
@Parameter : {Admin}
@Author : INIC
******************/
export default combineReducers({
  admin: Admin,
});
