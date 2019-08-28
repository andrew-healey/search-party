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
      User
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
  newSnip(id: String, name: String!, content: String!, public:Bool!): Snip
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
  public: Bool!
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

  const authenticated = (bool = true) => next => (root, args, context, info) => {
    if ((!!(context.username)) == bool)
      return next(root, args, context, info);
    throw bool?"Not authenticated.":"Already authenticated.";
  };

  const resolvers = {
    Query: {
      me: authenticated()(async (_, args, {
        username
      }) => await User.findOne({
        username
      })),
      user: async (_, {
        username
      }) => await User.findOne({
        username
      }),
      validate: async (_, {
        username,
        password
      }) => (await User.validate({
        username,
        password
      })) && (await User.genToken({username})),
    },
    Mutation: {
      newUser: authenticated(false)(async (_, {
        username,
        password
      }) => (await User.create({
        username,
        password
      })) && (await User.genToken({
        username
      }))),
    },
    //Add more resolvers here
    User:{
      snips:async (root,args, context, info)=>
      (await Promise.all(root.snipIds.map(async snip=>await snip.userHasRole("read")))).filter(i=>i),
    },
    Snip:{},
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
          username: !err && info.username
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
