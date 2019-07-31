import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { setSearch } from "../actions/searches.js";
import { setCodeModal, setPage } from "../actions/ui.js";
import fetch from "../fakeServer.js";
import { createLabel, createDebouncer } from "../util.js";

const debounce = createDebouncer(1000);

function CodeModal({ share_code, setCodeModal, setSearch, setPage }) {
	const [code, setCode] = useState("");
	const [state, setState] = useState("code");
	const [search, setLocalSearch] = useState();

	useEffect(() => {
		if (code !== "")
			debounce(code => {
				setState("loading");
				fetch("/api/searches/:search") // TODO: Replace with real
					.then(data => {
						setLocalSearch(data);
						setState("loaded");
					})
					.catch(err => setState("error"));
			});
	}, [code]);

	const states = {
		code: () => <p>Type in the search code</p>,
		error: () => <p>No search matches that code</p>,
		loading: () => (
			<p>
				<i className="fa fa-sync spinning" /> Fetching...
			</p>
		),
		loaded: () => (
			<p>
				<button
					onClick={() => {
						setSearch(search);
						setPage("search");
						setCodeModal(false);
					}}>
					Search for {createLabel(search.names)}
				</button>
			</p>
		)
	};

	return (
		<div
			className={"modal modal-container" + (share_code ? " visible" : "")}
			onClick={() => setCodeModal(false)}>
			<div className="modal-content" onClick={e => e.stopPropagation()}>
				<p>Input your code or link</p>
				<input
					type="text"
					placeholder="Code"
					value={code}
					onChange={evt => {
						setState("code");
						setCode(evt.target.value);
					}}
				/>
				{states[state]()}
			</div>
		</div>
	);
}

export default connect(
	({ ui: { modal: { share_code } = {} } = {} }) => ({ share_code }),
	{ setCodeModal, setPage, setSearch }
)(CodeModal);
