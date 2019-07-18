const graphql=require("graphql");
const graphqlExpress=require("express-graphql");

const schema=graphql.buildSchema(`
type Query {
    serverIsRunning: Boolean!
}
`);

const root={
    serverIsRunning:()=>true
};

module.exports=graphqlExpress({
    rootValue:root,
    graphiql:true,
    schema
});