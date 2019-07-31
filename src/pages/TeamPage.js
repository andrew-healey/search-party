import React, { forwardRef, Fragment } from "react";
import { connect } from "react-redux";
import { PersonDisplay } from "../components/index";

let last = a => a[a.length - 1];

function TeamPage({ currentSearch, myRef }) {
	const { currentUser, teams, people, trails, director } = currentSearch;
	const currentTeamId = people[currentUser].team;
	const currentTeam = teams[currentTeamId];
	const currentLocation = last(trails[currentUser] || [null]);
	return (
		<div ref={myRef} className="tab-page team-page">
			<h3>Director</h3>
			<div className="team-list">
				<PersonDisplay
					person={people[director]}
					location={last(trails[director] || [null])}
					currentLocation={currentLocation}
					id={director}
				/>
			</div>
			<h3>My Team</h3>
			<div className="team-list">
				{currentTeam.map(p => (
					<PersonDisplay
						key={"person-" + p}
						person={people[p]}
						location={last(trails[p] || [null])}
						currentLocation={currentLocation}
						id={p}
					/>
				))}
			</div>
			{teams.map((team, i) =>
				i === currentTeamId ? null : (
					<Fragment key={"team-"+i}>
						<h3>Team {i + 1}</h3>
						<div className="team-list">
							{team.map(p => (
								<PersonDisplay
									key={"person-" + p}
									person={people[p]}
									location={last(trails[p] || [null])}
									currentLocation={currentLocation}
									id={p}
								/>
							))}
						</div>
					</Fragment>
				)
			)}
		</div>
	);
}

const Connected = connect(
	({ searches: { currentSearch } }) => ({ currentSearch }),
	{}
)(TeamPage);

export default forwardRef((props, ref) => <Connected {...props} myRef={ref} />);
