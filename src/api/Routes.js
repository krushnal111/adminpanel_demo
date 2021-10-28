/******************* 
@Purpose : We can use following api calls and can change api name easily
@Author : INIC
******************/
export default {
  //Authentication
  LOG_OUT: "/logout",
  LOGIN: "/login",
  SENDOTP: "/sendOTP",
  VERIFY_OTP: "/verifyOTP",
  REGISTER: "/register",
  FORGOT: "/forgotPassword",
  CHANGE_PASSWORD: "/changePassword",
  VERIFY_EMAIL: "/sendEmailVerificationLink",
  RESET_PASSWORD: "/resetPassword",
  SET_PASSWORD: "/setPassword",
  SETTINGS: "/updateThemeDetails",

  // Profile
  GET_PROFILE: "/profile",
  UPDATE_PROFILE: "/editProfile",
  SEND_OTP_MOBILE_CHANGE: "/admin/sendOTPChangeMobile",
  VERIFY_OTP_MOBILE_CHANGE: "/admin/verifyOTPChangeMobile",

  //cms
  CMS_DETAILS: "/cmsDetail/",
  CMS_LIST: "/cmsList",
  add_Update_CMS: "/addUpdateCMS",
  CMS_DELETE: "/cmsDelete",
  CMS_STATUS: "/changePageStatus",

  //Admin Emails
  add_Email_Settings: "/addEmailSettings",
  get_Email_Settings: "/getEmailSettings",
  get_Email_Title: "/getEmailTitle",
  DELETE_Email_Settings: "/deleteEmailSetting/",
  add_Default_EmailSettings: "/addDefaultEmailSettings",

  //Email Listing
  EMAIL_LIST: "/listEmail",
  DELETE_EMAIL: "/deleteTemplate",
  CHNAGE_EMAIL_STATUS: "/changeTemplateStatus",

  //Edit Email
  EMAIL_DETAILS: "/detailEmail/",
  ADD_UPDATE_EMAILS: "/addUpdateEmail",

  //Master Management
  COUNTRY_CSV: "/downloadSampleCsvForCountries",
  UPLOAD_CSV: "/bulkUpload",

  //Country
  COUNTRY_LIST: "/countriesListing",
  COUNTRY_STATUS: "/changeCountriesStatus",
  GET_COUNTERY_DETAILS: "/getCountryDetails/",
  DELETE_COUNTRIES: "/deleteCountries",
  ADD_UPDATE_COUNTRY: "/addUpdateCountry",

  //Timezone
  TIMEZONE_LISTING: "/timezoneListing",
  GET_TIMEZONE_DETAILS: "/getTimezoneDetails/",
  DELETE_TIMEZONE: "/deleteTimezones",
  ADD_UPDATE_TIMEZONE: "/addUpdateTimezone",
  TIMEZONE_STATUS: "/changeTimezoneStatus",

  //Currency
  CURRENCY_LIST: "/currenciesListing",
  GET_CURRENCY_DETAILS: "/getCurrencyDetails/",
  DETETE_CURRENCY: "/deleteCurrencies",
  ADD_UPDATE_CURRENCY: "/addUpdateCurrency",
  CURRENCY_STATUS: "/changeCurrenciesStatus",

  //Users
  USERS_LIST: "/user/userListing",
  USERS_STATUS: "/user/changeStatus",
  DELETE_USERS: "/user/deleteUsers",

  //Edit Users
  ADD_NEW_USERS: "/user/addUserByAdmin",
  GET_USERS_PROFILE: "/user/userProfile/",

  //Admin
  ADMIN_LIST: "/userListing",
  ADMIN_STATUS: "/changeStatus",
  DELETE_ADMIN: "/deleteUsers",
  ADD_ADMIN: "/addAdminUser",
  GET_ADMIN_USER: "/userProfile/",
  LIST_ADMIN_ROLE: "/listRole",
  UPDATE_ADMIN: "/updateUser",

  //Global Settings
  GET_GLOBAL_SETTINGS: "/getglobalSettings",
  ADD_Global_settings: "/addGlobalSettings",
  GET_TIMEZONE: "/getTimezoneList",
  GET_CURRENCY_list: "/getCurrenciesList",
  GET_DATE_SETTINGS: "/getDateSettings",
  SETTING_FILE_UPLOAD: "/settingfileupload",

  //Payment settings
  GET_PAYMENT_DETAILS: "/getPaymentDetails",
  ADD_PAYEMENT_DETAILS: "/addPaymentDetails",

  //Email Notificatiion setting
  ADD_EMAIL_NOTIFICATIONS: "/addEmailNotificationSettings",
  GET_EMAIL_NOTIFICATIONS: "/getEmailNotificationSettings",

  //Social Media
  GET_SOCIAL_SDK: "/getSocialMediaSDK",
  GET_SOCIAL_LINKS: "/getSocialMediaLinks",
  ADD_SOCIAL_SDK: "/addSocialMediaSDK",
  ADD_SOCIAL_LINKS: "/addSocialMediaLinks",

  //SMTP Settings
  GET_SMTP: "/getSMTPAndSMSSettings",
  ADD_SMTP: "/addSMTPAndSMSSettings",

  //Blog Settings
  ADD_UPDATE_BLOG: "/addUpdateBlog",
  LIST_BLOG: "/listBlog",
  UPLOAD_FILE_BLOG: "/blogfileupload",
  DELETE_BLOG: "/deleteBlog",
  GET_BLOG: "/getBlogDetails/",
  ADD_UPDATE_BLOG_CATEGORY: "/addUpdateblogCategory",
  LIST_BLOG_CATEGORY: "/listBlogCategory",
  DELETE_BLOG_CATEGORY: "/deleteBlogCategory",
  GET_BLOG_CATEGORY_DETAILS: "/getBlogCategoryDetails/",
  CHANGE_BLOG_STATUS: "/changeBlogStatus",
  CHANGE_BLOG_CATEGORY_STATUS: "/changeBlogCategoryStatus",
  ADD_SLUG: "/createBlogSlug",

  //Blog & FAQS Settings
  ADD_UPDATE_FAQ: "/addUpdateFAQ",
  FAQ_LISTNG: "/faqsListing",
  DELETE_FAQ: "/deleteFAQs",
  GET_FAQ_DETAILS: "/getFAQDetails/",
  GET_FAQs_LIST: "/getFAQsList",
  ADD_UDPATE_FAQ_CATEGORY: "/addUpdateFAQCategory",
  FAQ_CATEGORY_LISTING: "/faqCategoriesListing",
  DELETE_FAQ_CATEGORY: "/deleteFAQCategories",
  GET_FAQ_CATEGORY_DETAILS: "/getFAQCategoryDetails/",
  GET_FAQ_CATEGORY_LIST: "/getFAQCategoriesList",

  //Common
  DOWNLOAD_FILE: "/downloadUserFile",
  FILE_UPLOAD: "/fileUpload",
  DELETE_TEMP: "/deleteTemplateSettings/",
  SAVED_TEMP_Settings: "/saveTemplateSettings",
  SAVED_FILTER: "/saveFilter",
  DELETE_FILTER: "/deleteFilter/",
  SAVE_COLUMN_SETTINGS: "/saveColumnSettings",
  GET_LIST: "/getCountriesList",

  //Role Management
  LIST_ROLES: "/listRole",
  GET_ROLE_PERMISSION: "/getRolePermission/",
  CHANGE_ROLE_STATUS: "/changeRoleStatus",
  ADD_ROLE: "/addRole",
  DELETE_ROLE: "/deleteRoles",
};
