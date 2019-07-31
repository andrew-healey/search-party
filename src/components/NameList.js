import React, { Fragment, useState } from "react";

export default function({names, setNames}) {
	let [currentName, setCurrentName] = useState("");
	return (
		<Fragment>
			<form
				onSubmit={e => {
					setNames([currentName, ...names]);
					setCurrentName("");
					e.preventDefault();
				}}>
				<input
					type="text"
					className="name-input"
					placeholder="Add a name"
					onChange={evt => setCurrentName(evt.target.value)}
					value={currentName}
				/>
			</form>
			<div className="missing-name-list">
				{names.map((name, i) => (
					<div key={i} className="missing-name">
						{name}
					</div>
				))}
			</div>
		</Fragment>
	);
}
