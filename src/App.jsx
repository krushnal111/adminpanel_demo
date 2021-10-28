import React , {Suspense}from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import {  getItem } from "./utils/Functions";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
// Authentication pages
import AdminLogin from "./pages/Authentication/AdminLogin";
import AdminRegister from "./pages/Authentication/AdminRegister";
import OtpPage from "./pages/Authentication/OtpPage";
import PasswordPage from "./pages/Authentication/PasswordPage";
import ResetPassword from "./pages/Authentication/ResetPassword";
import ChangePassword from "./pages/Authentication/ChangePassword";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
// Dashboard page
import Dashboard from "./pages/Dashboard/Dashboard";
// Profile page
import Profile from "./pages/Profile/Profile";
// Users page
import UsersList from "./pages/Users/UsersList";
import ViewuserDetails from "./pages/Users/ViewuserDetails";
import AdminUsers from "./pages/Users/AdminUsers";
import AddUser from "./pages/Users/AddUser";
import EditAdminUser from "./pages/Users/EditAdminUser";
// Contents page
import StaticPage from "./pages/Contents/StaticPages";
import CmsListing from "./pages/Contents/CmsListing";
import StaticCMS from "./pages/Contents/StaticCMS";
import faq from "./pages/Contents/Faq";
import BlogCategory from "./pages/Contents/BlogCategoryListing";
import BlogPreview from "./pages/Contents/BlogPreview";
import StaticPagePreview from "./pages/Contents/StaticPagePreview";
import EachStatic from "./pages/Contents/EachStatic";
import AddBlog from "./pages/Contents/AddBlog";
import EditBlog from "./pages/Contents/EditBlog";
import EditPreview from "./pages/Contents/EditPreview";
// EmailsTemplates page
import AdminEmail from "./pages/EmailsTemplates/AdminEmail";
import EmailTempalte from "./pages/EmailsTemplates/EmailTemplate";
import EditemailTemplate from "./pages/EmailsTemplates/EditemailTemplate";
import EmailsList from "./pages/EmailsTemplates/EmailsList";
// Master page
import State from "./pages/Master/State";
import MasterManagement from "./pages/Master/MasterManagement";
// RoleAccess page
import AccessManagement from "./pages/RoleAccess/AccessManagement";
import AddRoles from "./pages/RoleAccess/AddRole";
import EditRole from "./pages/RoleAccess/EditRole";
// Settings page
import SocialMedia from "./pages/Settings/SocialMedia";
import Smtp from "./pages/Settings/Smtp";
import EmailSettings from "./pages/Settings/EmailSettings";
import GeneralSettings from "./pages/Settings/GeneralSettings";
import PaymentGateWay from "./pages/Settings/PaymentGateway";
import Notifications from "./pages/Settings/Notifications";
// Transaction page
import Transaction from "./pages/Transaction/Transaction";
// Media page
import Media from "./pages/Media/Media";
// Support page
import Support from "./pages/Support/Support";
// 404 page
import FourZeroFour from "./pages/FourZeroFour/FourZeroFour";
// Offline page
import OfflinePage from "./pages/Offline/Offline";

// components
import Sidebar from "./components/Layout/SideBar";
import { Offline, Online } from "react-detect-offline";
//notification library
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// customized design intigration
import "./scss/styles.scss";
import AddPage from "./pages/Contents/AddPage";
/******************* 
@Purpose : This page is default page for our project
@Parameter : {}
@Author : INIC
******************/
function App() {
  /******************* 
  @Purpose : Used for token authorization
  @Parameter : {}
  @Author : INIC
  ******************/
  const Authorization = () => {
    return getItem("accessToken") ? true : false;
  };
  /******************* 
  @Purpose : Used for private routing
  @Parameter : {Component1, ...rest}
  @Author : INIC
  ******************/
  const PrivateRoute = ({ component: Component1, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        Authorization() ? <Component1 {...props} /> : <Redirect to="/" />
      }
    />
  );
  /******************* 
  @Purpose : Used for check user is already login or not
  @Parameter : {Component2, ...rest }
  @Author : INIC
  ******************/
  const LoginCheckRoute = ({ component: Component2, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        Authorization() ? (
          <Redirect to="/dashboard" />
        ) : (
          <Component2 {...props} />
        )
      }
    />
  );
  /******************* 
  @Purpose : Used for check reset password
  @Parameter : {Component3, ...rest}
  @Author : INIC
  ******************/
  const ResetPasswordCheckRoute = ({ component: Component3, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        Authorization() ? (
          <Redirect to="/dashboard" />
        ) : (
          <Component3 {...props} />
        )
      }
    />
  );
  return (
    <Suspense fallback="loading">
      <Provider store={store}>
        <Offline>
          <OfflinePage />
        </Offline>
        <Online>
          <PersistGate loading={null} persistor={persistor}>
            <Router>
              <Sidebar />
              <div style={{ textAlign: "center" }}>
                <ToastContainer />
              </div>
              <Switch>
                <LoginCheckRoute exact path="/" component={AdminLogin} />
                <Route exact path="/register" component={AdminRegister} />
                <Route exact path="/otp" component={OtpPage} />
                <PrivateRoute exact path="/password" component={PasswordPage} />
                <ResetPasswordCheckRoute
                  exact
                  path="/resetpassword"
                  component={ResetPassword}
                />
                <Route
                  exact
                  path="/changepassword"
                  component={ChangePassword}
                />
                <Route
                  exact
                  path="/forgotpassword"
                  component={ForgotPassword}
                />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute
                  exact
                  path="/usermanagement"
                  component={UsersList}
                />
                <PrivateRoute exact path="/adminusers" component={AdminUsers} />
                <PrivateRoute
                  exact
                  path="/userdetails/:slug"
                  component={ViewuserDetails}
                />
                <PrivateRoute exact path="/profile" component={Profile} />
                <PrivateRoute exact path="/adduser" component={AddUser} />
                <PrivateRoute
                  exact
                  path="/editAdminUser/:slug"
                  component={EditAdminUser}
                />
                <PrivateRoute
                  exact
                  path="/editStatic/eachStatic/:slug"
                  component={EachStatic}
                />
                <PrivateRoute
                  exact
                  path="/staticPreview/:slug"
                  component={StaticPagePreview}
                />
                <PrivateRoute
                  exact
                  path="/editStatic/:slug"
                  component={StaticCMS}
                />
                <PrivateRoute
                  exact
                  path="/addStatic"
                  component={AddPage}
                />
                <PrivateRoute exact path="/staticPage" component={StaticPage} />
                <PrivateRoute
                  exact
                  path="/blogListing"
                  component={CmsListing}
                />
                <PrivateRoute exact path="/addBlog" component={AddBlog} />
                <PrivateRoute
                  exact
                  path="/editBlog/:slug"
                  component={EditBlog}
                />
                <PrivateRoute
                  exact
                  path="/blogPreview/:slug"
                  component={BlogPreview}
                />
                <PrivateRoute
                  exact
                  path="/editBlog/editPreview/:slug"
                  component={EditPreview}
                />
                <PrivateRoute exact path="/faq" component={faq} />
                <PrivateRoute
                  exact
                  path="/blogCategory"
                  component={BlogCategory}
                />
                <PrivateRoute
                  exact
                  path="/rolesList"
                  component={AccessManagement}
                />
                <PrivateRoute exact path="/addRole" component={AddRoles} />
                <PrivateRoute
                  exact
                  path="/editRole/:slug"
                  component={EditRole}
                />
                <PrivateRoute
                  exact
                  path="/adminEmails"
                  component={AdminEmail}
                />
                <PrivateRoute
                  exact
                  path="/emailTemplates"
                  component={EmailsList}
                />
                <PrivateRoute
                  exact
                  path="/addemailtemplate"
                  component={EmailTempalte}
                />
                <PrivateRoute
                  exact
                  path="/editemailtemplate"
                  component={EditemailTemplate}
                />
                <PrivateRoute exact path="/state" component={State} />
                <PrivateRoute
                  exact
                  path="/master"
                  component={MasterManagement}
                />
                <PrivateRoute
                  exact
                  path="/generalSettings"
                  component={GeneralSettings}
                />
                <PrivateRoute
                  exact
                  path="/paymentGateway"
                  component={PaymentGateWay}
                />
                <PrivateRoute
                  exact
                  path="/emailSettings"
                  component={EmailSettings}
                />
                <PrivateRoute
                  exact
                  path="/notifications"
                  component={Notifications}
                />
                <PrivateRoute
                  exact
                  path="/socialMedia"
                  component={SocialMedia}
                />
                <PrivateRoute exact path="/smtp" component={Smtp} />
                <PrivateRoute
                  exact
                  path="/transaction"
                  component={Transaction}
                />
                <PrivateRoute exact path="/mediasdk" component={Media} />
                <PrivateRoute exact path="/support" component={Support} />
                <PrivateRoute path="/*" component={FourZeroFour} />
              </Switch>
            </Router>
          </PersistGate>
        </Online>
      </Provider>
    </Suspense>
  );
}

export default App;
