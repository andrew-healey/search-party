import React, { Component, useState, Fragment } from "react";
import { connect } from "react-redux";
import { setQRModal, setPage } from "../actions/ui.js";
import { setSearch } from "../actions/searches.js";
import fetch from "../fakeServer.js";
import QrReader from "react-qr-scanner";
import jsQR from "jsqr";
import { createLabel } from "../util.js";

const getQRCode = dataUrl =>
	new Promise((resolve, reject) => {
		const img = new Image();
		img.src = dataUrl;
		img.onload = () => {
			const c = document.createElement("canvas");
			c.width = img.width;
			c.height = img.height;
			const ctx = c.getContext("2d");
			ctx.drawImage(img, 0, 0);
			const imageData = ctx.getImageData(0, 0, img.width, img.height);
			const res = jsQR(imageData.data, img.width, img.height);
			if (res === null) {
				reject();
			} else {
				resolve(res);
			}
		};
	});

class QRModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			delay: 500,
			type: "video",
			uploaded_image: "",
			searchError: false,
			result: null,
			search: null,
			exitLeft: false
		};
		this.tabNames = ["Enter Names", "Add Information", "Share Search"];
	}

	reset() {
		this.setState({
			uploaded_image: "",
			searchError: false,
			result: null,
			search: null
		});
	}

	handleError = err => {
		this.setState({
			type: "capture-error"
		});
	};
	handleScan = result => {
		this.handleResult(result);
	};
	handleResult(result) {
		this.setState({ result });
		fetch("/api/searches/:search") // TODO: Replace with real
			.then(data => {
				this.setState({
					search: data,
					searchError: ""
				});
			})
			.catch(err => {
				this.setState({
					search: null,
					searchError: err.err
				});
			});
	}

	handleImgUpload = evt => {
		this.reset();
		let files = evt.target.files;
		if (files && files[0]) {
			let fileReader = new FileReader();
			fileReader.onloadend = e => {
				let uploaded_image = e.target.result;
				this.setState({
					uploaded_image
				});
				getQRCode(uploaded_image)
					.then(res => {
						this.handleResult(res.data);
					})
					.catch(() =>
						this.setState({
							type: "upload-error"
						})
					);
			};
			fileReader.readAsDataURL(files[0]);
			this.setState({ type: "uploaded" });
		}
	};

	render() {
		let { active, setQRModal, setSearch, setPage } = this.props;
		let {
			type,
			uploaded_image,
			result,
			search,
			searchError,
			exitLeft
		} = this.state;
		let previewStyle = {
			width: "100%"
		};

		let states = {
			video: () => (
				<Fragment>
					<QrReader
						delay={this.state.delay}
						style={previewStyle}
						onError={this.handleError}
						onScan={this.handleScan}
					/>
					<div className="box-container absolute">
						<div className="box-child box-child-1" />
						<div className="box-child box-child-2" />
						<div className="box-child box-child-3" />
						<div className="box-child box-child-4" />
					</div>
				</Fragment>
			),
			uploaded: () => (
				<Fragment>
					<img
						src={uploaded_image}
						style={previewStyle}
						alt="QR code"
					/>
					{search ? (
						<p>
							<button
								className="button"
								onClick={() => {
									setSearch(search);
									setPage("search");
									this.setState({
										exitLeft: true
									});
									setQRModal(false);
								}}>
								Search for {createLabel(search.names)}
							</button>
						</p>
					) : searchError ? (
						<p>No search with code: '{result}'</p>
					) : (
						<p>
							<i className="fa fa-sync spinning" />
							{result ? " Fetching Search..." : " Scanning..."}
						</p>
					)}
				</Fragment>
			),
			"capture-error": () => <p>There was an error capturing video</p>,
			"upload-error": () => (
				<Fragment>
					<img
						src={uploaded_image}
						style={previewStyle}
						alt="QR code"
					/>
					<br />
					<p>No QR code found</p>
				</Fragment>
			)
		};

		return (
			<div
				className={`modal modal-page ${exitLeft ? " exitLeft" : ""} ${
					active ? "visible" : ""
				}`}>
				<div className="modal-top-bar">
					<i
						className="close modal-icon fa"
						onClick={() => {
							setQRModal(false);
							this.setState({
								type: "video"
							});
							this.reset();
						}}>
						&times;
					</i>
					<div className="name">Scan QR</div>
				</div>
				<div className="modal-content no-padding relative">
					<div className="center column relative">
						{active ? states[type]() : null}
					</div>
					{["video", "capture-error"].includes(type) ? (
						<label
							className="button qr-action upload-qr-img"
							htmlFor="qr-input">
							<input
								type="file"
								name=""
								id="qr-input"
								onChange={this.handleImgUpload}
							/>
							<i className="fa fa-upload" /> Upload
						</label>
					) : (
						<button
							className="button qr-action"
							onClick={() => {
								this.reset();
								this.setState({ type: "video" });
							}}>
							Switch to video
						</button>
					)}
				</div>
			</div>
		);
	}
}

export default connect(
	({ ui: { modal: { create } = {} } = {} }) => ({ create }),
	{ setQRModal, setSearch, setPage }
)(QRModal);
