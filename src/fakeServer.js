let data = {
	proximalSearches: [
		{
			name: "John Doe",
			dist: "3 mi",
			code: "ASDFGHJKL",
		},
		{
			name: "John Doe",
			dist: "3 mi",
			code: "ASDFGHJKL",
		},
		{
			name: "John Doe",
			dist: "3 mi",
			code: "ASDFGHJKL",
		},
		{
			name: "John Doe",
			dist: "3 mi",
			code: "ASDFGHJKL",
		},
	]
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
	people: {
		0: {
			id: 0,
			name: "John Smith",
			email: "john@smith.com",
			tel: "1234567890",
			color: "#a7c"
		},
		1: {
			id: 1,
			name: "Mary Smith",
			email: "mary@smith.com",
			tel: "0987654321",
			color: "#3bf"
		}
	},
	chats: {
		0: [
			{
				message: "Hello, asdf asdf asf asdfasdfasdf",
				sender: 0,
			}
		]
	},
	trails: {}
};

let getSearchForClient = ({authCode, ...search}) => search;

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
				success: true,
			});
		}
	},
	"/api/searches/:search": {
		get: (send, err) => body => {
			if (Math.random() > 0.5) {
				send(getSearchForClient(search));
			} else {
				err({
					err: "No search exists",
				})
			}
		}
	},
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

let sendAsdf = false;
let asdfPosition = {};

s.on("location", ({ location, user }) => {
	s.emit("user_updated", { user, location });
	if (!sendAsdf)
		asdfPosition = {
			longitude: location.longitude,
			latitude: location.latitude
		};
	sendAsdf = true;
	console.log(location, asdfPosition);
});

setInterval(() => {
	if (sendAsdf) {
		s.emit("user_updated", { user: 0, location: asdfPosition });
		asdfPosition.latitude += Math.random() * 0.00001;
		asdfPosition.longitude += Math.random() * 0.00001;
	}
}, 100);

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
			1000
		)
	);
}
