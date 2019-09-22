import L from "leaflet";
import React, { Component } from "react";
import { connect } from "react-redux";
import { sendLocation } from "../actions/searches.js";
import { createMap } from "../util";

class Map extends Component {
	constructor(props) {
		super(props);
		this.state = {
			map: null,
			mapLoaded: false
		};
		this.watchId = null;
		this.timeoutId = null;
		this.polylines = {};
		this.map = false;
	}

	success = ({ coords }) => {
		this.props.sendLocation(coords, this.props.currentSearch.currentUser);
	};
	error = error => {};

	componentDidMount() {
		const options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 5000
		};
		this.watchId = navigator.geolocation.watchPosition(
			this.success,
			this.error,
			options
		);

		this.map = createMap("mapid", {
			zoomControl: false
		});
		this.map.setView(this.props.currentSearch.center, 20);
	}

	componentDidUpdate() {
		let { trails } = this.props.currentSearch;
		for (let i in trails) {
			if (this.polylines.hasOwnProperty(i)) {
				this.polylines[i].addLatLng(trails[i][trails[i].length - 1]);
			} else {
				this.polylines[i] = L.polyline(trails[i], {
					color: "red"
				});
				this.polylines[i].addTo(this.map);
			}
		}
	}

	render() {
		return <div id="mapid" key="map" />;
	}
}

export let MapPage = connect(
	({ searches: { currentSearch } }) => ({ currentSearch }),
	{ sendLocation }
)(Map);
