import { createRef, useEffect } from "react";
import L from "leaflet";
import jsQR from "jsqr";


export let createLabel = names => {
	let str = names[0];
	if (names.length > 1) {
		str += " and " + (names.length - 1) + " ";
		str += names.length > 2 ? "others" : "other";
	}
	return str;
};

export const useScroll = (container, ref = "v", direction) => {
	if (direction === undefined) {
		direction = ref;
		ref = createRef();
	}
	let htmlAttributes = { ref };

	const executeScroll = () => {
		container.current.scrollTo({
			top: direction === "v" ? ref.current.offsetTop : 0,
			left: direction === "h" ? ref.current.offsetLeft : 0,
			behavior: "smooth"
		});
	};

	return [executeScroll, htmlAttributes];
};

export const createDebouncer = delay => {
	let timeOut = null;
	return fn => (...args) => {
		if (timeOut) clearTimeout(timeOut);
		timeOut = setTimeout(() => {
			fn(...args);
		}, delay);
	};
};

export const last = a => a[a.length - 1];

export const createMap = (name, options, addons = []) => {
	let map = L.map(name, {
		zoomControl: false,
		attributionControl: false,
		dragging: false
	});
	[
		L.tileLayer(
			"https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
			{
				maxZoom: 18,
				id: "mapbox.streets",
				accessToken:
					"pk.eyJ1Ijoiam9kcml0aXJrb2Rlc296Y29tIiwiYSI6ImNqeWcybGt4bTFpZ2EzbHFvZWlzbjF6cXIifQ.y13rgUritqRVVew3pyfC_g"
			}
		),
		...addons
	].forEach(x => x.addTo(map));

	return map;
};

export const getImageData = img => {
	const c = document.createElement("canvas");
	c.width = img.width;
	c.height = img.height;
	const ctx = c.getContext("2d");
	ctx.drawImage(img, 0, 0);
	return ctx.getImageData(0, 0, img.width, img.height);
};
export const getQRCode = dataUrl =>
	new Promise((resolve, reject) => {
		const img = new Image();
		img.src = dataUrl;
		img.onload = () => {
			let imageData = getImageData(img);
			const res = jsQR(imageData.data, img.width, img.height);
			return res === null ? reject() : resolve(res);
		};
	});
