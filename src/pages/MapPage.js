import React, { Component } from "react";
import { connect } from "react-redux";
import L from "leaflet";
import { sendLocation } from "../actions/searches.js";

let pos;

class Map extends Component {
	constructor(props) {
		super(props);
		this.state = {
			map: null,
			mapLoaded: false
			// location: null
		};
		this.watchId = null;
        this.timeoutId = null;
        this.polylines = {};
        console.log(this.props.currentSearch);
        window.logThis = () => console.log(this);
	}

	success = ({ coords }) => {
        let {longitude, latitude} = coords;
        pos = {longitude, latitude};
		this.map.setView([coords.latitude, coords.longitude], 20);
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

		let mymap = L.map("mapid", {
			zoomControl: false
		});
		var latlngs = [[45.51, -122.68], [37.77, -122.43], [34.04, -118.2]];
		var polyline = L.polyline(latlngs, { color: "red" });
		// // zoom the map to the polyline
		//
		[
			L.tileLayer(
				"https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
				{
					attribution:
						'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
					maxZoom: 18,
					id: "mapbox.streets",
					accessToken:
						"pk.eyJ1Ijoiam9kcml0aXJrb2Rlc296Y29tIiwiYSI6ImNqeWcybGt4bTFpZ2EzbHFvZWlzbjF6cXIifQ.y13rgUritqRVVew3pyfC_g"
				}
			),
			L.control.zoom({
				position: "bottomright"
			}),
			polyline
		].forEach(x => x.addTo(mymap));
		mymap.fitBounds(polyline.getBounds());
        this.map = mymap;
        setInterval(() => {
            this.props.sendLocation(pos, this.props.currentSearch.currentUser);
            pos.longitude += 0.00001;
            pos.latitude  += 0.00001;
        }, 500)
	}

	componentDidUpdate(){
        let {trails} = this.props.currentSearch;
        for(let i in trails){
            if(this.polylines.hasOwnProperty(i)) {
                this.polylines[i].addLatLng(
					trails[i][trails[i].length - 1]
				);
            } else {
                this.polylines[i] = L.polyline(trails[i], {
					color: "red"
                })
                this.polylines[i].addTo(this.map);
            }
        }
    }

	render() {
		return <div id="mapid" key="map" />;
	}
}

export let MapPage = connect(
	// (s) => s,
	({searches: {currentSearch}}) => ({currentSearch}),
	{ sendLocation }
)(Map);
