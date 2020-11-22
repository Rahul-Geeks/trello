require("./Board");
require("./User");
require("./Card");
require("./List");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/trello", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let _conn = mongoose.connection;

_conn.on("error", (error) => {
    console.log("Connection with mongodb failed", error);
});

_conn.once("open", () => {
    console.log("Connection with mongodb successfull");
});