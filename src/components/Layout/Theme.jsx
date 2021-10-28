import React, { useEffect, useState, useRef } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { changeTheme } from "../../store/Actions"; // COMMON FUNCTIONS
/******************* 
@Purpose : Used for dynamic theme intigration
@Parameter : props
@Author : INIC
******************/
function Theme(props) {
  const [toggleSettings, setTogglesettings] = useState(false);
  const [checked, setChecked] = useState(props.theme && props.theme.data);

  useEffect(() => {
    if (props.theme && props.theme.data && props.theme.data == true) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
    props.changeTheme(props.theme && props.theme.data);
  }, []);
  /******************* 
  @Purpose : Used for dynamic outer click handler
  @Parameter : callback
  @Author : INIC
  ******************/
  function useOuterClick(callback) {
    const settingsRef = useRef();
    const callbackRef = useRef();
    useEffect(() => {
      callbackRef.current = callback;
    });

    useEffect(() => {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);

      function handleClick(e) {
        if (
          settingsRef.current &&
          callbackRef.current &&
          !settingsRef.current.contains(e.target)
        ) {
          callbackRef.current(e);
        }
      }
    }, []);

    return settingsRef;
  }
  /******************* 
  @Purpose : Used for theme change handle
  @Parameter : callback
  @Author : INIC
  ******************/
  const handleCheckClick = () => {
    setChecked(!checked);
    if (!checked) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
    props.changeTheme(!checked);
  };

  const settingsRef = useOuterClick((e) => {
    setTogglesettings(false);
  });
  return (
    <div
      ref={settingsRef}
      id="container1"
      class={
        toggleSettings ? "theme-setting-block open" : "theme-setting-block "
      }
    >
      <Link
        onClick={() => setTogglesettings(!toggleSettings)}
        class="theme-setting-link on click"
      >
        <i class="bx bx-cog bx-flip-horizontal bx-spin"></i>
      </Link>
      <div class="d-flex align-items-center">
        <span class="light-icon icon mr-1 d-block">
          <em class="bx bx-sun"></em>
        </span>
        <div class="custom-control custom-switch theme-switch">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => handleCheckClick()}
            class="custom-control-input"
            id="customSwitchTheme"
          />
          <label class="custom-control-label" for="customSwitchTheme"></label>
        </div>
        <span class="dark-icon icon">
          <em class="bx bxs-sun"></em>
        </span>
      </div>
    </div>
  );
}
/******************* 
@Purpose : Used for get data from redux
@Parameter : state
@Author : INIC
******************/
const mapStateToProps = (state) => ({
  theme: state.admin.theme,
});
/******************* 
@Purpose : Used for customize theme and connect redux
@Parameter : {}
@Author : INIC
******************/
export default connect(mapStateToProps, { changeTheme })(withRouter(Theme));
