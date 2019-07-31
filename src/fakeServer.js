let data = {
	proximalSearches: [
		{
			name: "John Doe",
			dist: "3 mi",
			code: "ASDFGHJKL"
		},
		{
			name: "John Doe",
			dist: "3 mi",
			code: "ASDFGHJKL"
		},
		{
			name: "John Doe",
			dist: "3 mi",
			code: "ASDFGHJKL"
		},
		{
			name: "John Doe",
			dist: "3 mi",
			code: "ASDFGHJKL"
		}
	]
};

let chats = {
	0: {
		users: { 1: "John doe", 2: "James" },
		private: true,
		messages: [
			{
				sender: 1,
				text: "Hello"
			},
			{
				sender: 1,
				text:
					"Nulla anim aliquip ut magna enim voluptate. Pariatur ullamco deserunt proident ipsum. Non anim dolor fugiat ullamco cillum ut nisi do ex aliquip excepteur do aliquip adipisicing."
			},
			{
				sender: 2,
				text:
					"Ea officia eu adipisicing culpa pariatur mollit commodo tempor."
			},
			{
				sender: 1,
				text:
					"Ea ipsum sit officia eu duis elit incididunt commodo eu nulla Lorem eu voluptate ea. Cupidatat magna ad qui nisi consectetur dolore proident ullamco cupidatat occaecat. Dolor velit tempor cillum dolor voluptate reprehenderit laboris deserunt proident aliquip duis consectetur esse. Minim fugiat est irure eu est voluptate esse adipisicing pariatur sint excepteur voluptate magna nisi."
			},
			{
				sender: 1,
				text: "Hello"
			},
			{
				sender: 1,
				text:
					"Nulla anim aliquip ut magna enim voluptate. Pariatur ullamco deserunt proident ipsum. Non anim dolor fugiat ullamco cillum ut nisi do ex aliquip excepteur do aliquip adipisicing."
			},
			{
				sender: 2,
				text:
					"Ea officia eu adipisicing culpa pariatur mollit commodo tempor."
			},
			{
				sender: 1,
				text:
					"Ea ipsum sit officia eu duis elit incididunt commodo eu nulla Lorem eu voluptate ea. Cupidatat magna ad qui nisi consectetur dolore proident ullamco cupidatat occaecat. Dolor velit tempor cillum dolor voluptate reprehenderit laboris deserunt proident aliquip duis consectetur esse. Minim fugiat est irure eu est voluptate esse adipisicing pariatur sint excepteur voluptate magna nisi."
			}
		]
	},
	1: {
		users: { 1: "John doe", 2: "James" },
		private: true,
		messages: [
			{
				sender: 1,
				text: "Hello"
			},
			{
				sender: 1,
				text:
					"Nulla anim aliquip ut magna enim voluptate. Pariatur ullamco deserunt proident ipsum. Non anim dolor fugiat ullamco cillum ut nisi do ex aliquip excepteur do aliquip adipisicing."
			},
			{
				sender: 2,
				text:
					"Ea officia eu adipisicing culpa pariatur mollit commodo tempor."
			},
			{
				sender: 1,
				text:
					"Ea ipsum sit officia eu duis elit incididunt commodo eu nulla Lorem eu voluptate ea. Cupidatat magna ad qui nisi consectetur dolore proident ullamco cupidatat occaecat. Dolor velit tempor cillum dolor voluptate reprehenderit laboris deserunt proident aliquip duis consectetur esse. Minim fugiat est irure eu est voluptate esse adipisicing pariatur sint excepteur voluptate magna nisi."
			},
			{
				sender: 1,
				text: "Hello"
			},
			{
				sender: 1,
				text:
					"Nulla anim aliquip ut magna enim voluptate. Pariatur ullamco deserunt proident ipsum. Non anim dolor fugiat ullamco cillum ut nisi do ex aliquip excepteur do aliquip adipisicing."
			},
			{
				sender: 2,
				text:
					"Ea officia eu adipisicing culpa pariatur mollit commodo tempor."
			},
			{
				sender: 1,
				text:
					"Ea ipsum sit officia eu duis elit incididunt commodo eu nulla Lorem eu voluptate ea. Cupidatat magna ad qui nisi consectetur dolore proident ullamco cupidatat occaecat. Dolor velit tempor cillum dolor voluptate reprehenderit laboris deserunt proident aliquip duis consectetur esse. Minim fugiat est irure eu est voluptate esse adipisicing pariatur sint excepteur voluptate magna nisi."
			}
		]
	}
};

let search = {
	names: ["Missing Person 1", "Missing Person 2"],
	contact: {
		Name: "asdf",
		"Phone Number": "asdf",
		Email: "asdf"
	},
	code: "ABCDEFG",
	link: "https://search.party/s/ABCDEFG",
	authCode: "ASDFGHJKL",
	currentUser: 1,
	director: 0,
	mainChat: 0,
	center: [38.986397499999995, -77.1117175],
	teams: [[1, 2], [3, 4]],
	people: {
		0: {
			id: 0,
			name: "John Smith",
			email: "john@smith.com",
			tel: "1234567890",
			color: "#a7c",
			team: null
		},
		1: {
			id: 1,
			name: "Mary Smith",
			email: "mary@smith.com",
			tel: "0987654321",
			color: "#3bf",
			team: 0
		},
		2: {
			id: 2,
			name: "James Smith",
			email: "james@smith.com",
			tel: "1230456789",
			color: "#d98",
			team: 0
		},
		3: {
			id: 3,
			name: "James Smith",
			email: "james@smith.com",
			tel: "1230456789",
			color: "#d98",
			team: 1
		},
		4: {
			id: 4,
			name: "James Smith",
			email: "james@smith.com",
			tel: "1230456789",
			color: "#d98",
			team: 1
		}
	},
	chats: {
		0: [
			{
				message: "Hello, asdf asdf asf asdfasdfasdf",
				sender: 0
			}
		]
	},
	trails: {}
};

let getSearchForClient = ({ authCode, ...search }) => search;

let server = {
	"/api/searches": {
		get: (send, err) => body => {
			send(data.proximalSearches);
		},
		post: (send, err) => body => {
			send(search);
		}
	},
	"/api/searches/:search/broadcast": {
		post: (send, err) => body => {
			send({
				success: true
			});
		}
	},
	"/api/searches/:search": {
		get: (send, err) => body => {
			if (Math.random() > 0.5) {
				send(getSearchForClient(search));
			} else {
				err({
					err: "No search exists"
				});
			}
		}
	},
	"/api/searches/:search/chats": {
		get: (send, err) => body => {
			send(chats);
		}
	}
};

let paths = {};

let m = url => {
	let r = {};
	r.emit = (path, ...data) => {
		(paths[path] || []).forEach(cb => cb(...data));
	};
	r.on = (path, cb) => {
		paths[path] = [...(paths[path] || []), cb];
	};
	return r;
};

let s = m("");

s.on("location", ({ location, user }) => {
	s.emit("user_updated", { user, location });
});

export const socketMiddleware = url => {
	return storeAPI => {
		let socket = m(url);

		socket.on("user_updated", payload => {
			storeAPI.dispatch({
				type: "UPDATE_USER_POSITION",
				payload
			});
		});

		return next => action => {
			if (action.type === "SEND_WEBSOCKET_MESSAGE") {
				socket.emit(action.evt, action.payload);
				return;
			}

			return next(action);
		};
	};
};

export default function fetch(path = "/", { method = "GET", body = {} } = {}) {
	return new Promise((resolve, reject) =>
		setTimeout(
			() =>
				(server[path] || server["/404"])[method.toLowerCase()](
					resolve,
					reject
				)(body),
			0
		)
	);
}
