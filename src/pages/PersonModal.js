import L from "leaflet";
import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { setPersonModal } from "../actions/ui.js";
import { createMap } from "../util";

let map;
let polyline;
let marker;
const last = a => a[a.length - 1];

function PersonModal({
	person_info,
	currentSearch,
	currentPerson,
	setPersonModal
}) {
	useEffect(() => {
		polyline = L.polyline([]);
		marker = L.marker([]);
		map = createMap("person-map", {
			zoomControl: false,
			attributionControl: false,
			dragging: false
		}, [
			polyline,
			marker
		]);
	}, []);

	let searchTrails = currentSearch && currentSearch.trails;

	useEffect(() => {
		if (currentPerson !== null && searchTrails !== null) {
			const trail = searchTrails[currentPerson];
			const lastPoint = trail && last(trail);
			polyline.setLatLngs(trail || []);

			if (lastPoint) {
				marker.setLatLng(lastPoint);
				map.setView(lastPoint, 15);
			}
		}
	}, [currentPerson, searchTrails]);

	let body = person => {
		return (
			<Fragment>
				<div className="name-bar">
					<div className="contact-name">{person.name}</div>
					<div className="contact-team">Team {person.team}</div>
				</div>
				<dl>
					<dt>Email</dt>
					<dd>asdf@gmail.com</dd>
					<dt>Phone Number</dt>
					<dd>(123)-456-7890</dd>
				</dl>
				<div className="row space-evenly person-actions">
					<button className="button">Cancel</button>
					<button className="button">Message</button>
				</div>
			</Fragment>
		);
	};

	return (
		<div
			className={
				"modal modal-page person-modal" +
				(person_info ? " visible" : "")
			}>
			<div className="modal-head">
				<div className="person-top-bar">
					<i
						className="fa fa-arrow-left"
						onClick={() => setPersonModal(false)}
					/>
				</div>
				<div id="person-map" />
			</div>
			<div className="modal-content">
				{currentPerson === null
					? null
					: body(currentSearch.people[currentPerson])}
			</div>
			<div
				className="modal-bottom-bar"
				onClick={() => {
					setPersonModal(false);
				}}>
				<i className="close modal-icon fa">&times;</i> Exit
			</div>
		</div>
	);
}

export default connect(
	({
		ui: { modal: { person_info } = {} } = {},
		searches: { currentSearch, currentPerson }
	}) => ({ person_info, currentSearch, currentPerson }),
	{ setPersonModal }
)(PersonModal);
