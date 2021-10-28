/******************* 
@Purpose : Used for environment configuration
@Parameter : {API_URL, IMG_URL, PORT}
@Author : INIC
******************/
module.exports = {
  API_URL: process.env.REACT_APP_API_URL,
  AUTH_URL: process.env.REACT_APP_AUTH_API_URL,
  ADMIN_URL: process.env.REACT_APP_ADMIN_API_URL,
  USER_URL: process.env.REACT_APP_USER_API_URL,
  RETRIVE_URL: process.env.REACT_APP_RETRIVE_API_URL,
  IMG_URL: process.env.REACT_APP_IMG_URL,
  PUBLIC_FILE_URL: process.env.REACT_APP_PUBLIC_FILE_URL,
  PORT: process.env.PORT,
  BUILD_PATH: process.env.BUILD_PATH
};
