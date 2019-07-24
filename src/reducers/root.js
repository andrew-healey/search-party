import { combineReducers } from "redux";

import ui from "./ui";
import searches from "./searches";
export default combineReducers({
	ui,
	searches
});
