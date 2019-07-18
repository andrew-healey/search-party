const express=require("express");
const app=express();

const graphql=require("./graphql");

app.use("/api",graphql);