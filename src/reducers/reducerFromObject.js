export default (obj, initialState) => (state = initialState, action) =>
	(obj[action.type] || obj._ || (a => state))(action, state);