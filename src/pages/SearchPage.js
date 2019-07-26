import React, { useState } from "react";
import { connect } from "react-redux";
import { setSidebar } from "../actions/ui";
import PinnedPage from "./PinnedPage";
import SettingsPage from "./SettingsPage";
import TeamPage from "./TeamPage";
import TimelinePage from "./TimelinePage";
import { MapPage } from "./MapPage";
import { createLabel, useScroll } from "../util";

let pointerTimeout;

// team/people, chat, pins, guide, settings
// Chat:
/*

Menu
Directions
Joining

People:
	- Coordinator
	- Teams:
		- People

	- Person modal
		- location
		- name
		- team
		- phone
		- email
		- current/recient media
			videos
			pictures

	- Media modal
		- Media/player
		- Location
		- Time
		- User

Chat:
	- Messages
	- Video Broadcast
	- Voice calls

Pinned:
	- See all pinned places
	- Cycle through
	- See media

Settings:
	- Names
	- Contact
	- Location/bounds
	- Poster
	- Privacy

Coordinator:
	- Map
		- People
		- Teams
		- Pinned
	Settings



*/

const SearchPage = ({ setSidebar, currentSearch }) => {
	let tabNames = ["team", "pinned", "timeline", "settings"];
	let tabs = [
		() => <TeamPage />,
		() => <PinnedPage />,
		() => <TimelinePage />,
		() => <SettingsPage />
	];
	let [tab, setTab] = useState(0);
	let [pointerEvents, setPointerEvents] = useState(false);
	let [execScroll, scrollProps, containerProps] = useScroll(
		t =>
			t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
		750
	);
	console.log(pointerEvents);
	let onStart = () => {
		console.log("onTouchStart", pointerTimeout);
		clearTimeout(pointerTimeout);
		pointerTimeout = undefined;
		setPointerEvents(true);
	};
	let onEnd = () => {
		console.log("onTouchEnd", pointerTimeout);
		pointerTimeout = setTimeout(() => {
			// console.trace("cb");
			setPointerEvents(false)
		}, 750);
	};

	return (
		<div className="page-search">
			<div className="page-name">
				<i
					className="fa fa-bars modal-icon"
					onClick={() => setSidebar(true)}
				/>{" "}
				Search
			</div>
			<div className="map-bg">
				<MapPage />
			</div>
			<div
				{...containerProps}
				className={
					"map-content" + (pointerEvents ? "" : " no-pointer-events")
				}
				>
				<div
					className="map-spacer"
					onTouchStart={onStart}
					onTouchEnd={onEnd}
				/>
				<div
					{...scrollProps}
					className="content-tabs"
					onTouchStart={onStart}
					onTouchEnd={onEnd}>
					<div
						className="search-header"
						onClick={() => {
							clearTimeout(pointerTimeout);
							console.log("click");
							execScroll();
						}}>
						Search for {createLabel(currentSearch.names)}
					</div>
					<div className="tab-content">{tabs[tab]()}</div>
					<div className="tabs row space-evenly">
						{tabNames.map((t, i) => (
							<div
								key={i}
								className={"tab" + (i === tab ? " active" : "")}
								onClick={() => setTab(i)}>
								{t}
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="map-actions">
				<button className="">
					<i className="fa fa-comment-alt" />
				</button>
				<button className="">
					<i className="fa fa-question" />
				</button>
				<button className="">
					<i className="fa fa-bullhorn" />
				</button>
				<button className="">
					<i className="fa fa-bookmark" />
				</button>
			</div>
		</div>
	);
};
export default connect(
	({ searches: { currentSearch } }) => ({ currentSearch }),
	{ setSidebar }
)(SearchPage);
