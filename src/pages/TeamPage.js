import React, { forwardRef, Fragment } from "react";
import { connect } from "react-redux";
import { PersonDisplay } from "../components/index";
import {last} from "../util";

const TeamListHOC = ({people, trails, currentLocation}) => ({name, personList}) => <Fragment>
			<h3>{name}</h3>
			<div className="team-list">
				{personList.map(p => (
					<PersonDisplay
						key={"person-" + p}
						person={people[p]}
						location={last(trails[p] || [null])}
						currentLocation={currentLocation}
						id={p}
					/>
				))}
			</div>
		</Fragment>;

function TeamPage({ currentSearch, myRef }) {
	const { currentUser, teams, people, trails, director } = currentSearch;
	const currentTeamId = people[currentUser].team;
	const currentTeam = teams[currentTeamId];
	const currentLocation = last(trails[currentUser] || [null]);

	const TeamList = TeamListHOC({...currentSearch, currentLocation});

	return (
		<div ref={myRef} className="tab-page team-page">
			<TeamList name="Director" personList={[director]} />
			<TeamList name="My Team" personList={currentTeam} />
			{teams.map((team, i) =>
				i === currentTeamId ? null : (
					<TeamList key={"team-" + i} name={`Team ${i + 1}`} personList={team} />
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
