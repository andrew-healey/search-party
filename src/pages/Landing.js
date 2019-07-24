import React, { Component } from "react";
import { connect } from "react-redux";
import { getProximalSearches } from "../actions/searches.js";
import { setCreateModal, setQRModal, setCodeModal } from "../actions/ui.js";
import { button, ProximalList } from "../components/index.js";

class Landing extends Component {
	constructor(props) {
		super(props);
		console.log(props);
	}

	componentDidMount() {
		this.props.getProximalSearches();
	}

	render() {
		let { proximal } = this.props;
		return (
			<div className="page landing">
				<div className="background-map">
					<div className="map-actions">
						<h2 className="title center">Create Search</h2>
						<button
							onClick={() => this.props.setCreateModal(true)}
							className="button">
							+ Create
						</button>
					</div>
					<div className="non-map-actions">
						<h2 className="title center">Join Search</h2>
						<div className="row space-around">
							<button
								className="button"
								onClick={() => this.props.setQRModal(true)}>
								Scan QR
							</button>
							<button
								className="button"
								onClick={() => this.props.setCodeModal(true)}>
								Input Code
							</button>
						</div>
						<h3 className="title center">Proximal</h3>
						<ProximalList proximal={proximal} />
					</div>
				</div>
			</div>
		);
	}
}

export default connect(
	({ searches: { proximal } }) => {
		return { proximal };
	},
	{ getProximalSearches, setCreateModal, setQRModal, setCodeModal }
)(Landing);
