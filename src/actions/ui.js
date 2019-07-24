export const setSidebar = value => ({
	type: "SET_SIDEBAR",
	value
});
export const setName = value => ({
	type: "SET_NAME",
	value
});
export const setCreateModal = value => ({
	type: "SET_MODAL",
	modal: "create",
	value
});
export const setQRModal = value => ({
	type: "SET_MODAL",
	modal: "scan_qr",
	value
});
export const setCodeModal = value => ({
	type: "SET_MODAL",
	modal: "share_code",
	value
});
export const setPage = page => ({
	type: "SET_PAGE",
	page
});
