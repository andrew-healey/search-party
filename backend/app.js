const express=require("express");
const app=express();

const graphql=require("./graphql");

app.use("/",graphql);

module.exports=app;