module.exports = new Promise(async (resolve, reject) => {
  const mongoose = require("mongoose");
  const {
    ApolloServer,
    gql
  } = require("apollo-server-express");

  const ObjectId = mongoose.Types.ObjectId;
  ObjectId.prototype.valueOf = function() {
    return this.toString();
  };

  //Import models
  const {User} = await require("./mongoose.js");

  const typeDefs = gql `
type Query {
  me: User
  user(username: String!): User
}

type Mutation{
  newUser(username: String!, password: String!): User
}

type User {
  username: String!
}

schema {
  query: Query
  mutation: Mutation
}
`;

  const resolvers = {
    Query: {
      me:()=>null,
      user:async (_,{username})=>await User.findOne({username}),
    },
    Mutation: {
      newUser: async (_,{username,password})=>await User.create({username,password}),
    },
    //Add more resolvers here
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  resolve((app) => server.applyMiddleware({
    app
  }));
});
