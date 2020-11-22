const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

let CardSchema = mongoose.Schema({
    'name': String,
    'description': String,
    'users': [{ type: ObjectId, ref: 'User' }]
});

mongoose.model("Card", CardSchema, 'cards');