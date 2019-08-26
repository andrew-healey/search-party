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
  const {} = await require("./mongoose.js");

  const typeDefs = gql `
type Query {
}

type Mutation{
}


schema {
  query: Query
  mutation: Mutation
}
`;

  const resolvers = {
    Query: {
    },
    Mutation: {
    },
    //Add more resolvers here
  };

  const context = ({req})=>{
    //Set context here
  };

  const loggedIn=next=>(root,args,context,info)=>{
    //Check if the user is authenticated
    
    return next();
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
  });

  resolve((app) => server.applyMiddleware({
    app
  }));
});
