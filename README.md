# Univarsal Admin (React.js)

An Univarsal admin panel is a must-have for web applications like e-commerce projects or daynamic content management systems, known as CMSes. These beautiful panels are full of features created to make your life easier.

## Getting Started
A Univarsal admin panel devloped in below  environment

| Name | Description | virsion | Required/Optional |
| :---: | :---: | :---: | :---: |
| `Node` | The node.js is used to run our React.js application on the server environment. | `v14.15.4` | Required |
| `Npm ` | npm is the package manager for the Node JavaScript platform. | `6.14.10` | Required |
| `React` | React. js is an open-source JavaScript library that is used for building user interfaces specifically for single-page applications.  | `17.0.1` | Required |
| `Redux` | Redux is a state management tool for javascript library. | `4.0.5` | Required |

### Installing

Please before start the project on follow the below command  to install all node.js dependencies
Using NPM - Node Package Manager

```
npm install 
```
Using Yarn - Yarn Package Manager

```
yarn install
```

End with an example of getting some data out of the system or using it for a little demo

## Deployment

Please follow the below command to run the project in different environments

### Development environment

Below command use for run the project in development environments.
```
npm run build || yarn build
```
```
npm run start || yarn start
```

### Staging environment

Below command use for run the project in staging environments.
```
npm run build:stag || yarn build:stag
```
```
npm run start:stag || yarn start:stag
```
### Production environment

Below command use for run the project in production environments.
```
npm run build:prod || yarn build:prod
```
```
npm run start:prod || yarn start:prod
```

## Folder structure
 We used below directory structure in our univarsal admin project.
```
reactjs_admin-v16-13-1
    ├─── public
    │       └── assets
    │       │       ├── images
    │       │       │       ├── icons 
    │       │       │       │       └──  list of call ions images
    │       │       └──  list of all images
    │       ├── index.html
    │       ├── manifest.json
    │       └── robots.txt
    ├─── scr
    |       ├── api
    │       ├── components
    │       │        ├── Counter
    │       │        ├── Editor
    │       │        ├── Layout
    │       │        └── Loader
    │       ├── config
    │       ├── hooks
    │       ├── pages
    │       │       ├── Authentication
    │       │       ├── Contents
    │       │       ├── Dashboard
    │       │       ├── EmailsTemplates
    │       │       ├── FourZeroFour
    │       │       ├── Master
    │       │       ├── Media
    │       │       ├── Offline
    │       │       ├── Profile
    │       │       ├── RoleAccess
    │       │       ├── Settings
    │       │       ├── Support
    │       │       ├── Transaction
    │       │       └── Users
    │       ├── scss
    │       │       ├── Component
    │       │       └── Helpers        
    │       ├── store
    │       │       ├── Actions
    │       │       └── Reducers    
    │       ├── translations
    │       ├── utils
    │       ├── App.jsx
    │       ├── App.test.js
    │       ├── index.js
    │       └── serviceWorker.js
    ├── .env.dev
    ├── .env.prod
    ├── .env.stag
    ├── .gitignore
    ├── package.json
    ├── README.md
    ├── server.js
    └── sonar-project.properties
```
#### Here's a quick overview for folder.
`public :-` , it's the root folder that gets dealt by the web server in the end

`public/assets :- ` Images, fonts and other static files.

`public/index.html :- ` Its default entry point of our react project execution

`public/manifest.json :- ` The web app manifest provides information about an application (such as name, author, icon, and description)

`public/robot.txt :- ` Robot. txt are text files that tell web robots (most often search engines) which pages on your site to crawl and which pages not to crawl.

`scr :- ` Contains all of our react codebase.

`scr/api :- `  Api call related functions.

`scr/components :- ` Independent and reusable bits of code.

`scr/config :- ` Projects config files

`scr/hooks :- ` Custom react hooks  method

`scr/scss :- `  Used for our customize view layout using scss

`scr/store :- ` Its contains redux methods like action, reducer and store

`scr/translations :- ` Various langauge files like English, French, german etc...

`scr/utils :- ` Javascript related functions.

`scr/index.js :- `index.js is the traditional and actual entry point for all react apps

`scr/App.jsx :- ` its used for react routing and connect our react app with redux.

`scr/AppserviceWorker.js :- ` its used for register our node services in our react projects.

`scr/AppserviceWorker.js :- ` its used for register our node services in our react projects.

`.env.dev :-`  Its devlopment environment configuration files for our project

`.env.stag :-` Its staging environment configuration files for our project

`.env.prod :-` Its  production environment configuration files for our project

`.gitignore :-` Git file ignore config files 

`package.json :-` this file holds various metadata relevant to the project.

`README.md :-` It's a set of useful information about a project and a kind of manual

`server.js :-` Its allow to change react default configuration like change build directory and server port etc...

`sonar-project.properties :-` Its sonarqube (testing tool) configuration files


## Project configuration
We used below directory structure in our univarsal admin panel.
### Scripts
 In our univarsal admin panel, we need to follow below scripts to ganarate build and run project in different envirements, some script are also used for test our projects. 
```json
{
    "build": "env-cmd -f .env.dev react-scripts build",
    "build:stag": "env-cmd -f .env.stag react-scripts build",
    "build:prod": "env-cmd -f .env.prod react-scripts build",
    "start": "env-cmd -f .env.dev react-scripts start",
    "start:stag": "env-cmd -f .env.stag react-scripts start",
    "start:prod": "env-cmd -f .env.prod react-scripts start",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "sonar": "sonar-scanner"
 }
```
### Dependencies
  We used varios node.js dependencies library in our projects, all library are also listed in below view wiht its virsion.
```json
{
    "@ckeditor/ckeditor5-build-classic": "^23.1.0",
    "@ckeditor/ckeditor5-react": "^3.0.0",
    "@testing-library/jest-dom": "^5.11.4",
    "@testing-library/react": "^11.1.0",
    "@testing-library/user-event": "^12.1.10",
    "antd": "^4.8.4",
    "axios": "^0.21.0",
    "bootstrap": "^4.5.3",
    "boxicons": "^2.0.7",
    "ckeditor4-react": "^1.2.1",
    "countries-and-timezones": "^2.3.1",
    "country-list": "^2.2.0",
    "country-location-timezone": "^1.0.4",
    "country-telephone-code": "^0.2.0",
    "currency-codes": "^2.1.0",
    "currency-symbol-map": "^4.0.4",
    "datatables.net-responsive": "^2.2.6",
    "env-cmd": "^10.1.0",
    "eslint": "^7.14.0",
    "flag-icon-css": "^3.5.0",
    "font-awesome": "^4.7.0",
    "grapesjs": "^0.16.27",
    "grapesjs-preset-webpage": "^0.1.11",
    "html-react-parser": "^0.14.2",
    "i18next": "^20.2.2",
    "jquery": "^3.5.1",
    "katex": "^0.12.0",
    "lodash": "^4.17.20",
    "moment": "^2.29.1",
    "moment-timezone": "^0.5.32",
    "node-sass": "^4.14.1",
    "otp-input-react": "^0.2.4",
    "rc-pagination": "^3.1.2",
    "react": "^17.0.1",
    "react-awesome-modal": "^2.0.5",
    "react-beautiful-dnd": "^13.0.0",
    "react-bootstrap": "^1.4.0",
    "react-bootstrap-daterangepicker": "^7.0.0",
    "react-color": "^2.19.3",
    "react-copy-to-clipboard": "^5.0.3",
    "react-country-flag": "^2.3.0",
    "react-cropper": "^2.1.4",
    "react-date-range": "^1.1.3",
    "react-datepicker": "^3.3.0",
    "react-datetime": "^3.0.4",
    "react-detect-offline": "^2.4.0",
    "react-dom": "^17.0.1",
    "react-flags-select": "^1.1.13",
    "react-fontawesome": "^1.7.1",
    "react-i18next": "^11.8.14",
    "react-image-crop": "^8.6.6",
    "react-loading-skeleton": "^2.1.1",
    "react-modal": "^3.11.2",
    "react-number-format": "^4.4.1",
    "react-otp-input": "^2.3.0",
    "react-otp-timer": "^0.1.0",
    "react-perfect-scrollbar": "^1.5.8",
    "react-phone-code": "0.0.4",
    "react-phone-input-2": "^2.13.9",
    "react-phone-number-input": "^3.1.6",
    "react-redux": "^7.2.2",
    "react-router": "^5.2.0",
    "react-router-dom": "^5.0.1",
    "react-scripts": "4.0.0",
    "react-select": "^3.1.0",
    "react-select-country-list": "^2.2.1",
    "react-social-login": "^3.4.10",
    "react-spinners": "^0.9.0",
    "react-timezone-select": "^0.9.7",
    "react-toastify": "^6.1.0",
    "react-toggle": "^4.0.2",
    "redux": "^4.0.5",
    "redux-persist": "^6.0.0",
    "redux-thunk": "^2.3.0",
    "simple-react-validator": "^1.6.0",
    "standard-readme-spec": "^1.2.2",
    "styled-components": "^5.2.1",
    "suneditor-react": "^2.14.10",
    "sweetalert": "^2.1.2",
    "sweetalert2": "^10.10.1",
    "typescript": "^4.0.5",
    "web-vitals": "^0.2.4"
  }
```
## Authors

* **INIC** - *Initial work* - [IndiaNIC Infotech Limited](https://www.indianic.com/)

See also the list of [contributors](http://git.indianic.com/IIL0/I2020-5865/reactjs_admin-v16-13-1/project_members) who participated in this project.
