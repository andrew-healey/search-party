import { createRef } from "react";

export let createLabel = names => {
	let str = names[0];
	if (names.length > 1) {
		str += " and " + (names.length - 1) + " ";
		str += names.length > 2 ? "others" : "other";
	}
	return str;
};

export const createAnimation = (update, timing, duration) => (
	cb = () => {}
) => {
	const start = +new Date();
	let cancel = false;
	const animate = () => {
		const current = +new Date(),
			dt = current - start;
		cancel = cancel || dt > duration;
		if (!cancel) requestAnimationFrame(animate);
		update(timing(dt / duration));
		// cancel = !update(timing(dt / duration));
	};
	animate();
};

export const useScroll = (container, ref="v", direction) => {
	if (direction === undefined) {
		direction = ref;
		ref = createRef();
	}
	let htmlAttributes = { ref };

	const executeScroll = () => {
		container.current.scrollTo({
			top:
				direction === "v"
					? ref.current.offsetTop
					: 0,
			left:
				direction === "h"
					? ref.current.offsetLeft
					: 0,
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
