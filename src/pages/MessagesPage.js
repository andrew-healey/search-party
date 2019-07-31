import React, { Component, useState, forwardRef } from "react";
import { connect } from "react-redux";
import fetch from "../fakeServer";

function ChatName({ chat, openChat }) {
	return (
		<div className="chat-display" onClick={() => openChat(chat)}>
			<div className="person-name">
				{Object.values(chat.users).join(", ")}
			</div>
			<div className="go-to">
				<i className="fa fa-arrow-right" />
			</div>
		</div>
	);
}
function ChatList({ loading, chats, openChat }) {
	return (
		<div className="chat-list">
			<h3 className="title">Chats</h3>
			{loading ? (
				<p>
					<i className="fa fa-sync spinning" /> Loading
				</p>
			) : (
				Object.entries(chats).map(([id, chat]) => (
					<ChatName
						key={"chat-" + id}
						chat={chat}
						openChat={openChat}
					/>
				))
			)}
		</div>
	);
}

function ChatView({ chat, closeChat, currentUser }) {
	return (
		<div className="chat-view">
			<h3 className="top-row">
				<i className="fa fa-arrow-left" onClick={closeChat} /> Chat
			</h3>
			{chat
				? chat.messages.map((message, i) => (
						<div
							key={i}
							className={
								"line" +
								(message.sender === currentUser ? " self" : "")
							}>
							<div className="message">{message.text}</div>
						</div>
				  ))
				: null}
			<div className="bottom-input">
				<input
					type="text"
					placeholder="Message"
					className="bottom-text-input"
				/>
				<button>
					<i className="fa fa-paper-plane" />
				</button>
			</div>
		</div>
	);
}

class MessagesPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			chats: {},
			chatOrder: [],
			currentChat: null,
			user: props.authCode,
			state: "initial",
			page: "chat-list"
		};
	}

	componentDidMount() {
		this.setState({ state: "loading" });
		fetch("/api/searches/:search/chats")
			.then(chats => {
				this.setState({
					chats,
					state: "loaded"
				});
			})
			.catch(data => {});
	}

	openChat = currentChat => {
		this.setState({
			page: "chat-view",
			currentChat
		});
	};

	closeChat = () => {
		this.setState({
			page: "chat-list"
		});
		setTimeout(
			() =>
				this.setState({
					currentChat: null
				}),
			200
		);
	};

	render() {
		let { currentChat, state, chats, page } = this.state;
		let { openChat, closeChat } = this;
		let { currentUser } = this.props.currentSearch;
		return (
			<div ref={this.props.tabRef} className="tab-page chat-page">
				<div
					className={
						"chat-area" + (page === "chat-view" ? " alt" : "")
					}>
					<ChatList
						loading={state === "loading"}
						chats={chats}
						openChat={openChat}
					/>
					<ChatView
						chat={currentChat}
						closeChat={closeChat}
						currentUser={currentUser}
					/>
				</div>
			</div>
		);
	}
}

const Connected = 
	connect(
		({ searches: { currentSearch } }) => ({ currentSearch }),
		{}
	)(MessagesPage)

export default forwardRef((props, ref) => (
	<Connected {...props} tabRef={ref} />
));
