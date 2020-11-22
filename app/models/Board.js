const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

let BoardSchema = mongoose.Schema({
    'name': String,
    'members': [{ type: ObjectId, ref: 'User' }],
    'lists': [{ type: ObjectId, ref: 'List' }]
});

mongoose.model("Board", BoardSchema, 'boards');