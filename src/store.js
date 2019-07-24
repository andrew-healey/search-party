import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/root.js";
import {socketMiddleware} from "./fakeServer.js";

export default createStore(
    rootReducer,
    applyMiddleware(thunk, socketMiddleware("localhost:3000")),
);

