const INTIAL_STATE = {
  adminData: {},
  adminProfileData: {},
  editAdminProfileData: {},
  edituserId: "",
  editEmailId: "",
  language: "en",
  theme: true,
  resize: true,
  sidebar: true,
};
/******************* 
@Purpose : Used for store data in redux
@Parameter : state, action
@Author : INIC
******************/
export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case "ADMIN_LOGIN":
      return Object.assign({}, state, {
        adminData: action.payload.data,
      });
    case "ADMIN_PROFILE":
      return Object.assign({}, state, {
        adminProfileData: action.payload.data,
      });
    case "EDITADMIN_PROFILE":
      return Object.assign({}, state, {
        editAdminProfileData: action.payload.data,
        adminData: action.payload.data
      });
    case "EDIT_USER":
      return Object.assign({}, state, {
        EDIT_USER: action.payload,
      });
    case "EDIT_EMAIL":
      return Object.assign({}, state, {
        editEmailId: action.payload,
      });
    case "theme":
      return Object.assign({}, state, {
        theme: action.payload,
      });
    case "resize":
      return Object.assign({}, state, {
        resize: action.payload,
      });
    case "sidebar":
      return Object.assign({}, state, {
        sidebar: action.payload,
      });
    case "language":
      return Object.assign({}, state, { language: action.payload.data });
    case "LOGOUT":
      return Object.assign({}, state, {
        adminData: {},
        adminProfileData: {},
        editAdminProfileData: {},
        edituserId: "",
        editEmailId: "",
        language: "en",
      });
    default:
      return state;
  }
};
