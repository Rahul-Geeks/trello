const express = require("express");
const mongoose = require("mongoose");
const async = require("async");
const Card = mongoose.model("Card");
const List = mongoose.model("List");

const router = express.Router();

// Create a card
router.post("/card", (req, res) => {
    async.waterfall([

        // Creating a card
        (callback) => {
            Card.create({ 'name': req.body.name, 'description': req.body.description }, (error, cardObj) => callback(error, cardObj));
        },

        // Adding the new card to the given board
        (cardObj, callback) => {
            List.updateOne({ _id: req.query.listId }, { "addToSet": { "cards": cardObj._id } }, (error, listObj) => callback(error, listObj));
        }
    ], (error, listObj) => {
        if (error)
            res.status(500).json({ 'message': 'Error while creating a list', 'error': error });
        else {
            res.status(200).json({ 'message': 'List created successfully' });
        }
    });
});

router.delete("/card", (req, res) => {
    async.waterfall([

        // Remove the card from the list
        (callback) => {
            List.updateOne({ 'cards': req.query.id }, { "$pull": { "cards": req.query.id } }, (error, listObj) => callback(error, listObj));
        },

        // Delete the card
        (listObj, callback) => {
            Card.deleteOne({ _id: req.query.id }, (error) => callback(error, "Card deleted successfully"));
        }
    ], (error, response) => {
        if (error)
            res.status(500).json({ 'message': "Error while deleting the card", 'error': error });
        else {
            res.status(200).json(response);
        }
    });
});

// Adding a user to the board
router.patch('/add-user', (req, res) => {
    Card.updateOne({ _id: req.query.cardId }, { "$addToSet": { 'members': req.body.userId } }, (error, response) => {
        if (error)
            res.status(500).json({ 'message': "Error while adding a member to list", 'error': error });
        else {
            res.status(200).json(response);
        }
    });
});

// Removing a user from the board
router.patch('/remove-user', (req, res) => {
    Card.updateOne({ _id: req.query.cardId }, { "$pull": { 'members': req.body.userId } }, (error, response) => {
        if (error)
            res.status(500).json({ 'message': "Error while removing a member to list", 'error': error });
        else {
            res.status(200).json(response);
        }
    });
});

module.exports = router;