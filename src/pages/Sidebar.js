import React from "react";
export function Sidebar({ children, active, setSidebar }) {
	return (
		<div className={"sidebar" + (active ? " active" : "")}>
			<div className="sidebar-top-bar">
				<i
					className="fa sidebar-icon"
					onClick={() => setSidebar(false)}>
					&times;
				</i>{" "}
				Menu
			</div>
			<div className="sidebar-content" />
		</div>
	);
}
