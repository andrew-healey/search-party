import React, { useState } from "react";
import { connect } from "react-redux";
import { setSidebar } from "../actions/ui";
import PeoplePage from "./PeoplePage";
import SettingsPage from "./SettingsPage";
import TeamPage from "./TeamPage";
import TimelinePage from "./TimelinePage";
import { MapPage } from "./MapPage";

let pointerTimeout;

const SearchPage = ({ setSidebar }) => {
	let tabNames = ["team", "people", "timeline", "settings"];
	let tabs = [
		() => <TeamPage />,
		() => <PeoplePage />,
		() => <TimelinePage />,
		() => <SettingsPage />
	];
	let [tab, setTab] = useState(0);
	let [pointerEvents, setPointerEvents] = useState(false);
	console.log(pointerEvents);
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
				className={
					"map-content" + (pointerEvents ? "" : " no-pointer-events")
				}>
				<div
					className="map-spacer"
					onTouchStart={() => {
						clearTimeout(pointerTimeout);
						setPointerEvents(true);
					}}
					onTouchEnd={() => {
						pointerTimeout = setTimeout(
							() => setPointerEvents(false),
							750
						);
					}}
				/>
				<div
					className="content-tabs"
					onTouchStart={() => {
						console.log("onTouchStart");
						clearTimeout(pointerTimeout);
						setPointerEvents(true);
					}}
					onTouchEnd={() => {
						console.log("onTouchEnd");
						pointerTimeout = setTimeout(
							() => setPointerEvents(false),
							650
						);
					}}>
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
	() => ({}),
	{ setSidebar }
)(SearchPage);
