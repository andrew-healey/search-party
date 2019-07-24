import reducerFromObject from "./reducerFromObject.js";
let initialSearchState = {};
let initialState = {
	proximal: [],
	currentSearch: null
};
let a = reducerFromObject(
	{
		REQUEST_PROXIMAL: (action, state) => ({
			...state,
			proximal: action.promise
		}),
		UPDATE_PROXIMAL: (action, state) => ({
			...state,
			proximal: action.data
		}),
		SET_SEARCH: (action, state) => ({
			...state,
			currentSearch: {
				...initialSearchState,
				...action.data
			}
		}),
		UPDATE_USER_POSITION: (action, state) => {
			return ({
				...state,
				currentSearch: {
					...state.currentSearch,
					trails: {
						...state.currentSearch.trails,
						[action.payload.user]: [
							...(state.currentSearch.trails[action.payload.user]||[]),
							[
								action.payload.location.latitude,
								action.payload.location.longitude
							]
						]
					}
				}
			})
		}
	},
	initialState
);
console.log(a);
export default a;
