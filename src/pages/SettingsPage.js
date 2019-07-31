import React, { Component, useState, forwardRef } from "react";
import { connect } from "react-redux";
import NameList from "../components/NameList.js";

export default forwardRef((props, ref) => {
	let [names, setNames] = useState([]);
	return (
		<div ref={ref} className="tab-page search-page">
			<h3 className="title">Settings</h3>
			<div className="settings-card">
				<h4 className="title setting-title">Missing Names</h4>
				<NameList names={names} setNames={setNames} />
			</div>
			<div className="settings-card">
				<h4 className="title setting-title">Contact Info</h4>
				{/* TODO */}
			</div>
			<div className="settings-card">
				<h4 className="title setting-title">Poster</h4>
				<div className="qr-spacer">
					asdf <br /> asdf
				</div>
			</div>
			<div className="settings-card">
				<h4 className="title setting-title">Sharing</h4>
				<div className="qr-spacer">
					{" "}
					asdf <br /> asdf
				</div>
			</div>
		</div>
	);
});