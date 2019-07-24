import React, { Component, useState, Fragment } from "react";
import { connect } from "react-redux";
import { setCreateModal, setPage } from "../actions/ui.js";
import { setSearch } from "../actions/searches.js";
import fetch from "../fakeServer.js";
import QRCode from "qrcode.react";

function EnterInfo({ setContact, back, next }) {
	let [contactInfo, setContactInfo] = useState({
		Name: "",
		"Phone Number": "",
		Email: ""
	});
	const inputTypes = {
		Name: "text",
		"Phone Number": "tel",
		Email: "email"
	};
	const inputOrder = ["Name", "Phone Number", "Email"];

	return (
		<div>
			<h3 className="title">Contact</h3>
			<div className="">
				{inputOrder.map((n, i) => (
					<input
						key={i}
						type={inputTypes[n]}
						placeholder={n}
						value={contactInfo[n]}
						onChange={evt =>
							setContactInfo({
								...contactInfo,
								[n]: evt.target.value
							})
						}
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

function AddNames({ setNames, back, next }) {
	let [currentName, setCurrentName] = useState("");
	let [names, setNameList] = useState([]);
	return (
		<div>
			<h3 className="title">Names</h3>

			<form
				onSubmit={e => {
					setNameList([currentName, ...names]);
					setNames(names);
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
					<div key={i} className="missin-name">
						{name}
					</div>
				))}
			</div>
			<div className="row space-evenly">
				<button className="button red" onClick={back}>
					<i className="fa fa-times" /> Back
				</button>
				<button className="button green" onClick={next}>
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
			<h3 className="title">Share</h3>
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
					<p>
						<i className="fa fa-sync spinning" /> QR Loading
					</p>
				</Fragment>
			) : (
				<Fragment>
					<h4>Code</h4>
					<p>{code}</p>
					<h4>Link</h4>
					<p>{link}</p>
					<h4>QR</h4>
					<QRCode value={code} />
				</Fragment>
			)}
			<br />
			<button
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
			<button disabled={searchPromise instanceof Promise} onClick={next}>
				Start
			</button>
		</div>
	);
}

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
			exitLeft: false
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
		let { tab, search, exitLeft } = this.state;
		let { setNames, setContact, next, back, broadcast } = this;
		let tabs = {
			"Enter Names": () => (
				<AddNames next={next} back={back} setNames={setNames} />
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
					{this.tabNames.map((t, i) => (
						<div key={i} className="create-modal-tab">
							{t}
						</div>
					))}
				</div>
			</div>
		);
	}
}

export default connect(
	({ ui: { modal: { create } = {} } = {} }) => ({ create }),
	{ setCreateModal, setSearch, setPage }
)(Create);
