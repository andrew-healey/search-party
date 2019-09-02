module.exports = new Promise(async (resolve, reject) => {
  const mongoose = require("mongoose");
  const {
    ApolloServer,
    gql
  } = require("apollo-server-express");
  const jwt = require("jsonwebtoken");

  const ObjectId = mongoose.Types.ObjectId;
  ObjectId.prototype.valueOf = function() {
    return this.toString();
  };

  //Import models
  const {
    models: {
      User,
      Snip,
    },
    privateKey
  } = await require("./mongoose.js");

  const typeDefs = gql `
type Query {
  me: User
  user(username: String!): User
  validate(username: String!, password: String!): String
  snip(id: String!): Snip
  snips(query: SnipQuery): [Snip!]!
}

type Mutation{
  newUser(username: String!, password: String!): String
  newSnip(name: String!, public:Boolean!): Snip
}

type User {
  username: String!
  snips: [Snip]!
}

type Snip {
  id: String!
  name: String!
  content: String!
  owner: User!
  editors: [User!]!
  public: Boolean!
  readers: [User!]
}
input SnipQuery {
  name: String
}

schema {
  query: Query
  mutation: Mutation
}
`;

  //Removes all undefined values from a graphql input query
  const graphqlToMongoose=query=>(Object.keys(query).reduce((obj,key)=>query[key]===undefined?obj:{...obj,[key]:query[key]},{}));

  const authenticated = (bool = true) => next => (root, args, context, info) => {
    if ((!!(context._id)) == bool)
      return next(root, args, context, info);
    throw bool ? "Not authenticated." : "Already authenticated.";
  };

  const role = role => next => async (root,args,context,info) => {
    console.log("Looking for role",role);
    if(root.constructor.modelName !== "Snip") throw "Roles exist only for snips!";
    if(await root.userHasRole({role,_id:context._id}))
      return await next(root,args,context,info);
    throw "User does not have role.";
  };

  const resolvers = {
    Query: {
      me: authenticated()(async (_, args, {
        _id
      }) => await User.findById(_id)),
      user: async (_, {
        username
      }) => await User.findOne({
        username
      }),
      validate: async (_, {
          username,
          password
        }) =>
        await (await User.validate({
          username,
          password
        })).genToken(),
      snip: async (root,{id})=>await Snip.findById(id),
      snips: async (root,{query:{name}})=>await Snip.find(graphqlToMongoose({name})),
    },
    Mutation: {
      newUser: authenticated(false)(async (_, {
          username,
          password
        }) =>
        await (await User.create({
          username,
          password
        })).genToken()),
      newSnip: authenticated()((_,{name,public},{_id})=>
        Snip.create({name,public,_id})),
    },
    //Add more resolvers here
    User: {
      snips: (root) => Promise.all(root.snipIds.map(async snipId=>await Snip.findById(snipId))),
    },
    Snip: {
      name:role("read")((root)=>root.name),
      content:role("read")((root)=>root.content),
      owner:role("read")(async (root)=>await User.findById(root.ownerId)),
      editors:role("read")((root)=>Promise.all(root.editorIds.map(async editorId=>await User.findById(editorId)))),
      readers:role("read")((root)=>Promise.all(root.readerIds.map(async readerId=>await User.findById(readerId)))),
    },
  };

  const context = function({
    req
  }) {
    return new Promise((resolve, reject) => {
      const headers = req.headers;
      const auth = headers.authentication;
      jwt.verify(auth, privateKey, (err, info) => {
        resolve({
          auth,
          _id: !err && info._id
        });
      });
    });
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
  });

  resolve((app) => server.applyMiddleware({
    app
  }));
});
