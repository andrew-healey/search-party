import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { setSidebar } from "./actions/ui.js";
import "./App.scss";
import CodeModal from "./pages/CodeModal";
import Create from "./pages/Create.js";
import QRModal from "./pages/InputQR.js";
import Landing from "./pages/Landing.js";
import PersonModal from "./pages/PersonModal.js";
import SearchPage from "./pages/SearchPage.js";
import { Sidebar } from "./pages/Sidebar";

class App extends Component {
	componentDidMount() {
		let loader = document.getElementById("loader");
		loader.parentNode.removeChild(loader);
	}
	render() {
		let {
			setSidebar,
			sidebar,
			page,
			create,
			scan_qr,
			share_code,
			person_info
		} = this.props;
		let currentPage = {
			landing: <Landing />,
			search: <SearchPage />
		}[page];
		return (
			<Fragment>
				<Sidebar active={sidebar} setSidebar={setSidebar} />
				<Create active={create} />
				<QRModal active={scan_qr} />
				<CodeModal active={share_code} />
				<PersonModal active={person_info} />
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
			modal: { create, scan_qr, share_code, person_info }
		}
	}) => ({
		sidebar,
		name,
		page,
		create,
		scan_qr,
		share_code,
		person_info
	}),
	{ setSidebar }
)(App);
