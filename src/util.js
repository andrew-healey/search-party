export let createLabel = names => {
	let str = names[0];
	if (names.length > 1) {
		str += " and " + (names.length - 1) + " ";
		str += names.length > 2 ? "others" : "other";
	}
	return str;
};
