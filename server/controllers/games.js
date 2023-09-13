"use strict";

var express = require('express');
var router = express.Router();
var Game = require('../models/game');

// ------------ CREATE ------------

// Create a new game
router.post('/', async function (req, res, next) {
    var game = new Game(req.body);
    try {
        await game.save();
        res.status(201).json(game);

    } catch (err) {
        // MongoError with code 11000 is thrown when a duplicate key is found
        if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(400).json({ "message": "A game with that name already exists" });
        }

        // ValidationError is thrown when a required field is missing or is invalid
        if (err.name === 'ValidationError') {
            res.status(400).json({ "message": err.message });
        }

        next(err);
    }
});

// ------------ READ ------------

// Get all games
router.get('/', async function (req, res, next) {
    try {
        var games = await Game.find();
        res.status(200).json({ "games": games });
    } catch (err) {
        next(err);
    }
});

// Get a game by id
router.get('/id/:id', async function (req, res, next) {
    var id = req.params.id;
    try {
        var game = await Game.findById(id);
        if (game === null) {
            return res.status(404).json({ "message": "Game not found" });
        }
        res.status(200).json(game);
    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }
        next(err);
    }
});

// Get a game by name
router.get('/name/:name', async function (req, res, next) {
    var name = req.params.name;
    try {
        var game = await Game.findOne({ name: name });
        if (game === null) {
            return res.status(404).json({ "message": "Game not found" });
        }
        res.status(200).json(game);
    } catch (err) {
        next(err);
    }
});

// ------------ UPDATE ------------

// Replace a game by id
router.put('/id/:id', async function (req, res, next) {
    var id = req.params.id;
    try {
        const game = await Game.findById(id);
        if (game === null) {
            return res.status(404).json({ "message": "Game not found" });
        }

        game.name = req.body.name;
        game.author = req.body.author;
        game.releaseDate = req.body.releaseDate;
        game.tag = req.body.tag;

        await game.save();
        res.status(201).json(game);
    } catch (err) {
        // ValidationError is thrown when a required field is missing or is invalid
        if (err.name === 'ValidationError') {
            return res.status(400).json({ "message": err.message });
        }

        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        // MongoServerError with code 11000 is thrown whenever you try to change a unique field to a value that already exists in the collection
        if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(400).json({ "message": "A game with that name already exists" });
        }
        next(err);
    }
});

// Update a game by id 
router.patch('/id/:id', async function (req, res, next) {
    var id = req.params.id;
    try {
        const game = await Game.findById(id);
        if (game === null) {
            return res.status(404).json({ "message": "Game not found" });
        }

        game.name = (req.body.name || game.name);
        game.author = (req.body.author || game.author);
        game.releaseDate = (req.body.releaseDate || game.releaseDate);
        game.tag = (req.body.tag || game.tag);

        await game.save();
        res.status(201).json(game);
    } catch (err) {
        // ValidationError is thrown when a required field is missing or is invalid
        if (err.name === 'ValidationError') {
            return res.status(400).json({ "message": err.message });
        }

        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        // MongoServerError with code 11000 is thrown whenever you try to change a unique field to a value that already exists in the collection
        if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(400).json({ "message": "A game with that name already exists" });
        }
        next(err);
    }
});

// ------------ DELETE ------------

// Delete a game by id
router.delete('/id/:id', async function (req, res, next) {
    var id = req.params.id;
    try {
        var game = await Game.findOneAndDelete({ _id: id });
        if (game === null) {
            return res.status(404).json({ "message": "Game not found" });
        }
        res.status(200).json(game);
    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }
        next(err);
    }
});

// Delete a game by name
router.delete('/name/:name', async function (req, res, next) {
    var name = req.params.name;
    try {
        var game = await Game.findOneAndDelete({ name: name });
        if (game === null) {
            return res.status(404).json({ "message": "Game not found" });
        }
        res.status(200).json(game);
    } catch (err) {
        next(err);
    }
});

// Delete all games
router.delete('/', async function (req, res, next) {
    try {
        const game = await Game.find().deleteMany();
        res.status(200).json("All games deleted");
    } catch (err) {
        next(err);
    }
});

module.exports = router;
