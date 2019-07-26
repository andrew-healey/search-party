import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { PersonDisplay } from "../components/index";

let last = a => a[a.length - 1];

function TeamPage({ currentSearch }) {
	let team =
		currentSearch.teams[
			currentSearch.people[currentSearch.currentUser].team
		];
	let currentLocation = last(
		currentSearch.trails[currentSearch.currentUser] || [null]
	);
	return (
		<div className="team-page">
			<h3>Director</h3>
			<div className="team-list">
				<PersonDisplay
					person={currentSearch.people[currentSearch.director]}
					location={last(
						currentSearch.trails[currentSearch.director] || [null]
					)}
					currentLocation={currentLocation}
					id={currentSearch.director}
				/>
			</div>
			<h3>My Team</h3>
			<div className="team-list">
				{team.map(p => (
					<PersonDisplay
						key={"person-" + p}
						person={currentSearch.people[p]}
						location={last(currentSearch.trails[p] || [null])}
						currentLocation={currentLocation}
						id={p}
					/>
				))}
			</div>
		</div>
	);
}

export default connect(
	({ searches: { currentSearch } }) => ({ currentSearch }),
	{}
)(TeamPage);
