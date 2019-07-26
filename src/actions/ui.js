let modalAction = modal => value => ({
	type: "SET_MODAL",
	modal,
	value
});

let setAction = (name, key="value") => value => ({
	type: "SET_"+name,
	[key]: value
});

export const setSidebar = setAction("SIDEBAR");
export const setName = setAction("NAME");
export const setPage = setAction("PAGE", "page");


export const setCreateModal = modalAction("create");
export const setQRModal = modalAction("scan_qr");
export const setCodeModal = modalAction("share_code");
export const setPersonModal = modalAction("person_info");

