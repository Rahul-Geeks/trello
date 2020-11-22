const mongoose = require("mongoose");

let UserSchema = mongoose.Schema({
    'name': String,
    'email': String
});

mongoose.model("User", UserSchema, 'users');