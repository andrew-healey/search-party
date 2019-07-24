import fetch from "../fakeServer.js";
// import socket from "../fakeServer.js";

export const getProximalSearches = () => dispatch => {
	dispatch({
		type: "REQUEST_PROXIMAL",
		promise: fetch("/api/searches").then(data =>
			dispatch({ type: "UPDATE_PROXIMAL", data })
		)
	});
};

export const setSearch = data => dispatch => {
	dispatch({
		type: "SET_SEARCH",
		data
	});
}

export const sendLocation = (location, user) => dispatch => {
	dispatch({
		type: "SEND_WEBSOCKET_MESSAGE",
		evt: "location",
		payload: {
			location,
			user,
		}
	});
}