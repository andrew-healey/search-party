import React, { Component, useState, forwardRef } from "react";
import { connect } from "react-redux";

export default forwardRef((props, ref) => {
	return <div ref={ref} className="tab-page media-page" />;
});
