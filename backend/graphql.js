const graphql=require("graphql");
const graphqlExpress=require("express-graphql");

const schema=graphql.buildSchema(`
type Query {

}
`);

const root={};

module.exports=graphqlExpress({
    rootValue:root,
    graphiql:true,
    schema
});