import React, { createRef, useEffect, useState } from "react";
import { connect } from "react-redux";
import { setSidebar } from "../actions/ui";
import { createLabel, useScroll } from "../util";
import GuidePage from "./GuidePage";
import { MapPage } from "./MapPage";
import TimelinePage from "./MediaPage";
import MessagesPage from "./MessagesPage";
import SettingsPage from "./SettingsPage";
import TeamPage from "./TeamPage";

let pointerTimeout;

const tabNames = ["team", "chat", "media", "settings", "guide"];
const tabIcons = [
	"fa-users",
	"fa-comment-alt",
	"fa-photo-video",
	"fa-cog",
	"fa-question"
];
const tabComponents = [
	TeamPage,
	MessagesPage,
	TimelinePage,
	SettingsPage,
	GuidePage
];

const refs = tabNames.map(() => createRef());

const tabParentRef = createRef();
const scrollers = refs.map(ref => useScroll(tabParentRef, ref, "h")[0]);

const mapParentRef = createRef();
const [execScroll, scrollProps] = useScroll(mapParentRef, "v");

const SearchPage = ({ setSidebar, currentSearch }) => {
	const [tab, setTab] = useState(0);
	const [pointerEvents, setPointerEvents] = useState(false);

	const tabs = tabComponents.map((TabComponent, i) => (
		<TabComponent key={"tab-" + i} ref={refs[i]} />
	));

	const tabButtons = tabNames.map((t, i) => (
		<div
			key={i}
			className={"tab" + (i === tab ? " active" : "")}
			onClick={scrollers[i]}>
			<i className={"fa " + tabIcons[i]} />
			{t}
		</div>
	));

	const getCurrentTab = () =>
		refs
			.map(({ current }, i) => [
				current !== null && tabParentRef.current !== null
					? Math.abs(
							current.offsetLeft - tabParentRef.current.scrollLeft
					  )
					: Infinity,
				i
			])
			.sort(([a], [b]) => a - b)[0][1];

	useEffect(() => {
		if (tabParentRef.current && refs[0].current) {
			tabParentRef.current.addEventListener(
				"scroll",
				() => setTab(getCurrentTab()),
				{ passive: true }
			);
		}
	}, []);

	const touchProps = {
		onTouchStart: () => {
			clearTimeout(pointerTimeout);
			pointerTimeout = undefined;
			setPointerEvents(true);
		},
		onTouchEnd: () => () => {
			pointerTimeout = setTimeout(() => {
				setPointerEvents(false);
			}, 750);
		}
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
				ref={mapParentRef}
				className={
					"map-content" + (pointerEvents ? "" : " no-pointer-events")
				}>
				<div className="map-spacer" {...touchProps} />
				<div className="content-tabs" {...touchProps} {...scrollProps}>
					<div className="search-header" onClick={execScroll}>
						{createLabel(currentSearch.names)}
					</div>
					<div className="tab-content" ref={tabParentRef}>
						<div className="all-tabs">{tabs}</div>
					</div>
					<div className="tabs row space-evenly">{tabButtons}</div>
				</div>
			</div>
			<div className="map-actions">
				<button className="">
					<i className="fa fa-plus" />
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
