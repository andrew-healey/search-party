import reducerFromObject from "./reducerFromObject.js";
let initialSearchState = {};
let initialState = {
	proximal: [],
	currentPerson: null,
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
		SET_PERSON: (action, state) => ({
			...state,
			currentPerson: action.data,
		}),
		UPDATE_USER_POSITION: (action, state) => {
			let { currentSearch } = state;
			let {
				user,
				location: { longitude, latitude }
			} = action.payload;
			return {
				...state,
				currentSearch: {
					...currentSearch,
					trails: {
						...currentSearch.trails,
						[action.payload.user]: [
							...(currentSearch.trails[user] || []),
							[latitude, longitude]
						]
					}
				}
			};
		}
	},
	initialState
);
console.log(a);
export default a;
