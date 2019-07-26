import React from "react";
import { connect } from "react-redux";
import { setPersonModal } from "../actions/ui";
import { setPerson } from "../actions/searches";

let dist = (a, b) => Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
let PersonDisplay = ({
	person,
	location,
	currentLocation,
	setPersonModal,
	setPerson,
	id
}) => {
	return (
		<div
			className="person-display"
			onClick={() => {
				setPerson(id);
				setPersonModal(true);
			}}>
			<div className="person-name">{person.name}</div>
			<div className="person-location">
				{location && currentLocation
					? dist(location, currentLocation) / 69 + " miles"
					: ""}
			</div>
			<div className="go-to">
				<i className="fa fa-arrow-right" />
			</div>
		</div>
	);
};

export default connect(
	() => ({}),
	{ setPersonModal, setPerson }
)(PersonDisplay);
