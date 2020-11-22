const express = require("express");
const mongoose = require("mongoose");
const async = require("async");
const List = mongoose.model("List");
const Board = mongoose.model("Board");
const Card = mongoose.model("Card");

const router = express.Router();

// Create a list
router.post("/list", (req, res) => {
    async.waterfall([

        // Creating a list
        (callback) => {
            List.create({ 'name': req.body.name }, (error, listObj) => callback(error, listObj));
        },

        // Adding the new list to the given board
        (listObj, callback) => {
            Board.updateOne({ _id: req.query.boardId }, { "addToSet": { "lists": listObj._id } }, (error, boardObj) => callback(error, boardObj));
        }
    ], (error, boardObj) => {
        if (error)
            res.status(500).json({ 'message': 'Error while creating a list', 'error': error });
        else {
            res.status(200).json({ 'message': 'List created successfully' });
        }
    });
});

// Delete list
router.delete("/list", (req, res) => {
    async.waterfall([

        // Get the list object
        (callback) => {
            List.findOne({ "_id": req.query.id }, { 'cards': 1 }, (error, listObj) => callback(error, listObj));
        },

        // Delete all cards from list
        (listObj, callback) => {
            Card.deleteMany({ _id: { "$in": listObj.cards } }, (error) => callback(error, listObj));
        },

        // Remove the list from the board
        (listObj, callback) => {
            Board.updateOne({ "lists": listObj._id }, { "$pull": { "lists": listObj._id } }, (error, boardObj) => callback(error, boardObj));
        },

        // Finally delete the list
        (boardObj, callback) => {
            List.deleteOne({ _id: req.query.id }, (error) => callback(error, "List deleted successfully"));
        }
    ], (error, response) => {
        if (error)
            res.status(500).json({ 'message': "Error while deleting the list", 'error': error });
        else {
            res.status(200).json(response);
        }
    });
});

router.patch("/move-cards", (req, res) => {
    async.waterfall([
        (callback) => {
            List.updateOne({ "cards": req.body.cardId }, { "$pull": { "cards": req.body.cardId } }, (error, primaryListObj) => callback(error, primaryListObj));
        },
        (primaryListObj, callback) => {
            List.updateOne({ '_id': req.query.destinationListId }, { "$addToSet": { "cards": req.body.cardId } }, (error, destinationListObj) => callback(error, destinationListObj));
        }
    ], (error, response) => {
        if (error)
            res.status(500).json({ 'message': "Error while moving the card", 'error': error });
        else {
            res.status(200).json(response);
        }
    });
});

module.exports = router;