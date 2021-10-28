import { compose, applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk"; // redux middle-ware
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import reducers from "./Reducers"; // import reducer

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, reducers);
/******************* 
@Purpose : Used for create redux store
@Parameter : persistedReducer , composeEnhancers
@Author : INIC
******************/
export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export const persistor = persistStore(store);
