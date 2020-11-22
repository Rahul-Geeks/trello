const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

let ListSchema = mongoose.Schema({
    'name': String,
    'cards': [{ type: ObjectId, ref: 'Card' }]
});

mongoose.model("List", ListSchema, 'lists');