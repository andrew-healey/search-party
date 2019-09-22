import QRCode from "qrcode.react";
import React, { Component, Fragment, useState } from "react";
import { connect } from "react-redux";
import { setSearch } from "../actions/searches.js";
import { setCreateModal, setPage } from "../actions/ui.js";
import fetch from "../fakeServer.js";

import NameList from "../components/NameList.js";

function EnterInfo({ setContact, back, next }) {
	const fields = [
		{
			label: "Name",
			type: "text"
		},
		{
			label: "Phone Number",
			type: "tel"
		},
		{
			label: "Email",
			type: "email"
		}
	];
	const [contactInfo, setContactInfo] = useState({
		name: "",
		tel: "",
		email: ""
	});

	const createSetter = n => evt =>
		setContactInfo({
			...contactInfo,
			[n]: evt.target.value
		});

	return (
		<div>
			<h3 className="title">Contact</h3>
			<div className="">
				{fields.map(({label, type}, i) => (
					<input
						key={i}
						type={type}
						placeholder={label}
						value={contactInfo[type]}
						onChange={createSetter(type)}
					/>
				))}
			</div>

			<div className="row space-evenly">
				<button className="button red" onClick={back}>
					<i className="fa fa-arrow-left" /> Back
				</button>
				<button
					className="button green"
					onClick={() => {
						setContact(contactInfo);
						next();
					}}>
					Next <i className="fa fa-arrow-right" />
				</button>
			</div>
		</div>
	);
}

function AddNames({ names, setNames, back, next }) {
	return (
		<div>
			<h3 className="title">Names</h3>
			<NameList names={names} setNames={setNames} />
			<div className="row space-evenly">
				<button className="button red" onClick={back}>
					<i className="fa fa-times" /> Back
				</button>
				<button
					className="button green"
					onClick={next}>
					Next <i className="fa fa-arrow-right" />
				</button>
			</div>
		</div>
	);
}

function ShareSearch({ search, broadcast, back, next }) {
	let { searchPromise, code, link, broadcasted } = search;
	return (
		<div>
			{searchPromise instanceof Promise ? (
				<Fragment>
					<h4>Code</h4>
					<p>
						<i className="fa fa-sync spinning" /> Code Loading
					</p>
					<h4>Link</h4>
					<p>
						<i className="fa fa-sync spinning" /> Link Loading
					</p>
					<h4>QR</h4>
					{/* <p> */}
					<div className="qr-spacer">
						<p>
							<i className="fa fa-sync spinning" /> QR Loading
						</p>
					</div>
					{/* </p> */}
				</Fragment>
			) : (
				<Fragment>
					<h4>Code</h4>
					<p>{code}</p>
					<h4>Link</h4>
					<p>{link}</p>
					<h4>QR</h4>
					<QRCode
						value={code}
						size={200}
						className="qr-canvas-output"
					/>
				</Fragment>
			)}
			<br />
			<button
				className="button"
				disabled={searchPromise instanceof Promise}
				onClick={() => (!broadcasted ? broadcast() : null)}>
				{!(broadcasted instanceof Promise) ? (
					broadcasted ? (
						<Fragment>
							<i className="fa fa-check" /> Broadcasted
						</Fragment>
					) : (
						<Fragment>
							<i className="fa fa-broadcast-tower" /> Broadcast
						</Fragment>
					)
				) : (
					<Fragment>
						<i className="fa fa-sync spinning" /> Broadcasting
					</Fragment>
				)}
			</button>
			<br />
			<br />
			<button
				disabled={searchPromise instanceof Promise}
				onClick={next}
				className="button">
				Start
			</button>
		</div>
	);
}

// class Swipable extends Component {
// 	static Tab = ({ children, onFirstNav=()=>{} }) => {
// 		this.firstMounts[this.tabNum++] = onFirstNav;
// 		return children[0];
// 	};

// 	setTab = tab => {
// 		let ptab = this.state.tab;
// 		this.setState({ tab });
// 		this.onChange(tab, ptab);
// 		if(this.hasVisited[tab]) this.firstMounts[tab]();
// 	};

// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			tab: 0
// 		};
// 		this.tabNum = 0;
// 		this.firstMounts = {};
// 		this.hasVisited = {};
// 		this.onChange = props.onChange;
// 	}
// }

class Create extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tab: 0,
			missing_names: [],
			contact: {},
			search: {
				broadcasted: false,
				code: null,
				link: null,
				authCode: null,
				searchPromise: null
			},
			exitLeft: false,
			reverse: false,
			ptab: 0
		};
		this.tabNames = ["Enter Names", "Add Information", "Share Search"];
	}

	setNames = missing_names => {
		this.setState({
			missing_names
		});
	};
	setContact = contact => {
		this.setState({
			contact
		});
	};

	createSearch() {
		this.setState(({ search }) => ({
			search: {
				...search,
				searchPromise: fetch("/api/searches", {
					method: "POST",
					body: this.getData()
				}).then(data => {
					let { code, link, authCode } = data;
					this.setState(({ search }) => ({
						search: {
							...search,
							code,
							link,
							authCode,
							searchPromise: null
						}
					}));
					this.props.setSearch(data);
					this.props.setPage("search");
				})
			},
			exitLeft: true
		}));
	}

	broadcast = () => {
		//TODO
		// :search = search.code
		this.setState(({ search }) => ({
			search: {
				...search,
				broadcasted: fetch(`/api/searches/:search/broadcast`, {
					body: {
						position: null
					},
					method: "post"
				}) // TODO: correct url
					.then(({ success }) =>
						this.setState(({ search }) => ({
							search: {
								...search,
								broadcasted: success
							}
						}))
					)
			}
		}));
	};

	back = () => this.setTab(this.state.tab - 1);
	next = () => this.setTab(this.state.tab + 1);
	setTab = tab => {
		this.setState({ reverse: tab < this.state.tab, ptab: this.state.tab });
		if (tab === -1) return this.props.setCreateModal(false);
		if (tab === this.tabNames.length) {
			this.props.setCreateModal(false);
			this.setTab(0);
			return;
		}
		if (tab === this.tabNames.indexOf("Share Search")) this.createSearch();
		this.setState({ tab });
	};

	getData() {
		let { contact, missing_names } = this.state;
		return { contact, names: missing_names };
	}

	render() {
		let { active, setCreateModal } = this.props;
		let {
			tab,
			ptab,
			reverse,
			search,
			exitLeft,
			missing_names
		} = this.state;
		let { setNames, setContact, next, back, broadcast } = this;
		let tabs = {
			"Enter Names": () => (
				<AddNames next={next} back={back} names={missing_names} setNames={setNames} />
			),
			"Add Information": () => (
				<EnterInfo back={back} next={next} setContact={setContact} />
			),
			"Share Search": () => (
				<ShareSearch
					next={next}
					search={search}
					broadcast={broadcast}
				/>
			)
		};
		return (
			<div
				className={`modal modal-page  ${exitLeft ? " exitLeft" : ""} ${
					active ? "visible" : ""
				}`}>
				<div className="modal-top-bar">
					<i
						className="close modal-icon fa"
						onClick={() => {
							this.setState({ tab: 0 });
							setCreateModal(false);
						}}>
						&times;
					</i>
					<div className="name">Create Search</div>
				</div>
				<div className="modal-content">
					{tabs[this.tabNames[tab]]()}
				</div>
				<div className="modal-bottom-bar tabs">
					<div className="progress-container">
						<div className="progressbar">
							<div className="track" />
							{this.tabNames.map((t, i) => (
								<div
									key={i}
									className={
										"create-modal-tab" +
										` delay-${
											reverse ? ptab - i : i - ptab - 1
										}` +
										(tab > i ? ` active` : "") +
										(tab === i ? " current" : "")
									}
									onClick={() => this.setTab(i)}>
									{t}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(
	({ ui: { modal: { create } = {} } = {} }) => ({ create }),
	{ setCreateModal, setSearch, setPage }
)(Create);
