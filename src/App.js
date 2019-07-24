import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
	setCodeModal,
	setCreateModal,
	setQRModal,
	setSidebar
} from "./actions/ui.js";
import "./App.scss";
import CodeModal from "./pages/CodeModal";
import Create from "./pages/Create.js";
import QRModal from "./pages/InputQR.js";
import Landing from "./pages/Landing.js";
import SearchPage from "./pages/SearchPage.js";
import { Sidebar } from "./pages/Sidebar";

class App extends Component {
	componentDidMount() {
		let loader = document.getElementById("loader");
		loader.parentNode.removeChild(loader);
	}
	render() {
		let {
			sidebar,
			setSidebar,
			page,
			create,
			setCreateModal,
			setQRModal,
			scan_qr,
			share_code
		} = this.props;
		let currentPage = {
			landing: <Landing />,
			search: <SearchPage />
		}[page];
		return (
			<Fragment>
				<Sidebar active={sidebar} setSidebar={setSidebar} />
				<Create active={create} setCreateModal={setCreateModal} />
				<QRModal active={scan_qr} setQRModal={setQRModal} />
				<CodeModal active={share_code} setQRModal={setCodeModal} />
				{currentPage}
			</Fragment>
		);
	}
}

export default connect(
	({
		ui: {
			sidebar,
			name,
			page,
			modal: { create, scan_qr, share_code }
		}
	}) => ({
		sidebar,
		name,
		page,
		create,
		scan_qr,
		share_code
	}),
	{ setSidebar, setCreateModal, setQRModal, setCodeModal }
)(App);
