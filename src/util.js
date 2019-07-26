import { useRef } from "react";

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

export const useScroll = (timing, duration) => {
	const ref = useRef(null);
	const container = useRef(null);
	const executeScroll = () => {
		container.current.scrollTo({
			top: ref.current.offsetTop - container.current.scrollTop,
			left: 0,
			behavior: "smooth"
		});
	};
	const htmlElementAttributes = { ref };
	const containerAttributes = { ref: container };
	return [executeScroll, htmlElementAttributes, containerAttributes];
};
