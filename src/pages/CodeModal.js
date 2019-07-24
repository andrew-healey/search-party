import React, { Component, useState, useEffect, Fragment, useRef } from "react";
import { connect } from "react-redux";
import { setCodeModal, setPage } from "../actions/ui.js";
import { setSearch } from "../actions/searches.js";
import fetch from "../fakeServer.js";
import { createLabel } from "../util.js";
import { timeout } from "q";

let debounce = (fn, delay) => {
	let timeOut = null;
	return (...args) => {
		if (timeOut) clearTimeout(timeOut);
		timeOut = setTimeout(() => {
			console.log(5);
			fn(...args);
		}, delay);
	};
};

const fetchSearch = debounce((code, setState, setLocalSearch) => {
	setState("loading");
	fetch("/api/searches/:search") // TODO: Replace with real
		.then(data => {
			setLocalSearch(data);
			setState("loaded");
			console.log(data);
		})
		.catch(err => setState("error"));
}, 1500);

function CodeModal({ share_code, setCodeModal, setSearch, setPage }) {
	let [code, setCode] = useState("");
	let [search, setLocalSearch] = useState(null);
	let [state, setState] = useState("code");

	const isFirstRun = useRef(true); // a little hacky (used to avoid having fetch run on first);

	useEffect(() => {
		if (isFirstRun.current) {
			// See previous comment
			isFirstRun.current = false;
			return;
		}
		console.log("asdf");
		fetchSearch(code, setState, setLocalSearch);
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [code]);

	let states = {
		code: () => null,
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
