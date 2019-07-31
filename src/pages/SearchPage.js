import React, { useState, useEffect, createRef } from "react";
import { connect } from "react-redux";
import { setSidebar } from "../actions/ui";
import MessagesPage from "./MessagesPage";
import SettingsPage from "./SettingsPage";
import GuidePage from "./GuidePage";
import TeamPage from "./TeamPage";
import TimelinePage from "./MediaPage";
import { MapPage } from "./MapPage";
import { createLabel, useScroll } from "../util";

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
			onClick={() => {
				scrollers[i]();
			}}>
			<i className={"fa " + tabIcons[i]} />
			{t}
		</div>
	));

	const getCurrentTab = () =>
		refs
			.map(({ current }, i) => {
				if (current !== null && tabParentRef.current !== null) {
					return [
						Math.abs(
							current.offsetLeft - tabParentRef.current.scrollLeft
						),
						i
					];
				}
			})
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

	let onTouchStart = () => {
		clearTimeout(pointerTimeout);
		pointerTimeout = undefined;
		setPointerEvents(true);
	};
	let onTouchEnd = () => {
		pointerTimeout = setTimeout(() => {
			setPointerEvents(false);
		}, 750);
	};
	let touchProps = {
		onTouchStart,
		onTouchEnd
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
						Search for {createLabel(currentSearch.names)}
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
