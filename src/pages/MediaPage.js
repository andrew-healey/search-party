import React, { forwardRef } from "react";

export default forwardRef((props, ref) => {
	return <div ref={ref} className="tab-page media-page" />;
});
