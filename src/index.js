import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import * as serviceWorker from "./serviceWorker";
import { en, fr, gr, po } from "./translations";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: "en", // default language to use
  resources: {
    en: {
      language: en, // 'common' is our custom namespace
    },
    fr: {
      language: fr,
    },
    gr: {
      language: gr,
    },
    po: {
      language: po,
    },
  },
});

/******************* 
@Purpose : This page is default rander page for our project
@Parameter : {}
@Author : INIC
******************/
ReactDOM.render(
  <StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </StrictMode>,
  document.getElementById("root")
);
serviceWorker.register();
