import React, { forwardRef } from "react";

export default forwardRef((props, ref) => {
	return (
		<div ref={ref} className="tab-page guide-page">
			<iframe
				key="quide-frame"
				className="guide-embed"
				src="http://www.missingpersonsguide.com/guide/"
				frameBorder="0"
				title="guide"
			/>
			<div className="guide-loader">
				{/* <p>
					<i className="fa fa-sync spinning" /> Loading
				</p> */}
			</div>
		</div>
	);
})
