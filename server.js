require("./app/models/db.connections");
const express = require("express");
const boardRoutes = require("./app/routes/boards");
const listRoutes = require("./app/routes/lists");
const cardRoutes = require("./app/routes/cards");

const app = express();

app.use("/api", boardRoutes);
app.use("/api", listRoutes);
app.use("/api", cardRoutes);

app.listen(8000, (error) => {
    if(error)
        console.log("ERROR WHILE STARTING THE APP", error);
    else {
        console.log("Connected with server at port 8000");
    }
});