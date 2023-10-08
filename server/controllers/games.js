"use strict";

var express = require('express');
var router = express.Router();
var Game = require('../models/game');
var queryHandler = require('./queryhandler');
var linksHandler = require('./linkshandler');

// ------------ CREATE ------------

// Create a new game
router.post('/', async function (req, res, next) {
    var game = new Game(req.body);
    try {
        await game.save();
        return res.status(201).json(game);
    } catch (err) {
        // MongoServerError with code 11000 is thrown when a duplicate key is found
        if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(400).json({ "message": "A game with that name already exists" });
        }

        // ValidationError is thrown when a required field is missing or is invalid
        if (err.name === 'ValidationError') {
            return res.status(400).json({ "message": err.message });
        }

        next(err);
    }
});

// ------------ READ ------------

// Get game(s) by query
router.get('/', async function (req, res, next) {
    try {
        // Create query from query parameters
        var query = Game.find(queryHandler.queryCreation(req));
        if (req.query.sort) {
            query = queryHandler.sortQuery(req, query);
        }
        if (req.query.fields) {
            query = queryHandler.fieldQuery(req, query);
        }

        // Get all matching documents
        var games = await query;

        if (games.length === 0) {
            return res.status(404).json({ "message": "Game(s) not found" });
        }

        if (!req.query.fields || req.query.fields.split(',').includes('links')) {
            // Add links to each game
            games = games.map(game => game.toObject());
            games.forEach(function (game) {
                linksHandler.addGameLinks(game);
            });
        }

        return res.status(200).json({
            games,
            "links": [
                {
                    self: { href: "http://localhost:3000/api/v1/games" + req.url }
                }
            ]
        });

    } catch (err) {
        // CastError is thrown when an invalid id is passed
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        next(err);
    }
});

// Get a game by id
router.get('/:id', async function (req, res, next) {
    var id = req.params.id;
    try {
        var game = await Game.findById(id);
        if (game === null) {
            return res.status(404).json({ "message": "Game not found" });
        }

        // Add links to game
        game = game.toObject();
        linksHandler.addGameLinks(game);

        return res.status(200).json(game);
    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }
        next(err);
    }
});

// ------------ UPDATE ------------

// Replace a game by id
router.put('/:id', async function (req, res, next) {
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
        return res.status(201).json(game);
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
router.patch('/:id', async function (req, res, next) {
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
        return res.status(201).json(game);
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
router.delete('/:id', async function (req, res, next) {
    var id = req.params.id;
    try {
        var game = await Game.findOneAndDelete({ _id: id });
        if (game === null) {
            return res.status(404).json({ "message": "Game not found" });
        }
        return res.status(200).json(game);
    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }
        next(err);
    }
});

// Delete game(s) by query
router.delete('/', async function (req, res, next) {
    try {
        // Create query from query parameters
        var query = Game.find(queryHandler.queryCreation(req));

        // Delete all matching documents
        const games = await query.deleteMany();

        if (games.deletedCount === 0) {
            return res.status(404).json({ "message": "Game(s) not found" });
        }

        return res.status(200).json({ "message": "Game(s) deleted", "deletedCount": games.deletedCount });
    } catch (err) {
        // CastError is thrown when an invalid id is passed
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        next(err);
    }
});

module.exports = router;
