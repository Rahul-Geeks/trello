const express = require("express");
const mongoose = require("mongoose");
const async = require("async");

const router = express.Router();
const Board = mongoose.model("Board");
const Card = mongoose.model("Card");
const List = mongoose.model("List");

// Creating a board
router.post("/board", (req, res) => {

    // Creating board instance
    let newBoard = new Board({
        'name': req.body.name
    });

    // Saving instance to the database
    newBoard.save((error) => {
        if (error)
            res.status(500).json({ 'message': 'Error while creating a board', 'error': error });
        else {
            res.status(200).json({ 'message': 'Board created successfully' });
        }
    });
});

// Deleting a board
router.delete('/board', (req, res) => {

    async.waterfall([

        // Getting all cards and list objects from a board
        (callback) => {
            Board.findOne({ _id: req.query.id }).populate({ 'path': 'lists', 'select': 'cards' })
                .populate({ 'path': 'cards', 'select': '_id' }).exec((error, boardObj) => callback(error, boardObj));
        },

        // Deleting cards
        (boardObj, callback) => {
            let cards = [];
            boardObj.lists.forEach(list => {
                cards.push(list.cards);
            });

            Card.deleteMany({ _id: { "$in": cards } }, (error) => callback(error, boardObj));
        },

        // Deleting lists
        (boardObj, callback) => {
            List.deleteMany({ _id: { _id: boardObj.lists } }, (error) => callback(error, boardObj));
        },

        // Finally deleting the board
        (boardObj, callback) => {
            Board.deleteOne({ _id: boardObj._id }, (error) => callback(error, "Board deleted successfully"));
        }
    ], (error, response) => {
        if (error)
            res.status(500).json({ 'message': 'Error while deleting a board', 'error': error });
        else {
            res.status(200).json(response);
        }
    });
});

// Adding a member to the board
router.patch('/add-member', (req, res) => {
    Board.updateOne({ _id: req.query.boardId }, { "$addToSet": { 'members': req.body.memberId } }, (error, response) => {
        if (error)
            res.status(500).json({ 'message': "Error while adding a member to board", 'error': error });
        else {
            res.status(200).json(response);
        }
    });
});

// Removing a member from the board
router.patch('/remove-member', (req, res) => {
    Board.updateOne({ _id: req.query.boardId }, { "$pull": { 'members': req.body.memberId } }, (error, response) => {
        if (error)
            res.status(500).json({ 'message': "Error while removing a member to board", 'error': error });
        else {
            res.status(200).json(response);
        }
    });
});

module.exports = router;