"use strict";

var express = require('express');
var router = express.Router();
var Game = require('../models/game');

// ------------ CREATE ------------

// Create a new game
router.post('/', async function (req, res, next) {
    // Check name
    if (typeof req.body.name !== 'string' || req.body.name === null || req.body.name.length < 1) {
        return res.status(400).json({ "message": "Bad Request: name must be at least 1 character long" });
    }

    // Check author
    if (typeof req.body.author !== 'string' || req.body.author === null || req.body.author.length < 1) {
        return res.status(400).json({ "message": "Bad Request: name must be at least 1 character long" });
    }

    // Check that every element in tag is a string
    if (!Array.isArray(req.body.tag)) {
        return res.status(400).json({ "message": "Bad Request: tag must be an array of strings" });
    }
    for (var i = 0; i < req.body.tag.length; i++) {
        if (typeof req.body.tag[i] !== 'string') {
            return res.status(400).json({ "message": "Bad Request: tag must be an array of strings" });
        }

        if (req.body.tag === null || req.body.tag.length < 1 || req.body.tag.length > 25) {
            return res.status(400).json({ "message": "Bad Request: every tag must be between 1 and 25 characters long. Tag: " + i + "is wrong" });
        }
    }

    // Check if date is a valid date
    const date = new Date(req.body.releaseDate);
    if (Object.prototype.toString.call(date) !== '[object Date]' || isNaN(date.getTime())) {
        return res.status(400).json({ "message": "Bad Request: releaseDate must be a date" });
    }

    var game = new Game(req.body);
    try {
        // Check if username already exists
        const gameExist = await Game.exists({ name: req.body.name });
        if (gameExist) {
            return res.status(400).send({ message: "Game already exists" });
        }

        await game.save();
        res.status(201).json(game);
    } catch (err) {
        next(err);
    }
});

// ------------ READ ------------

// Get all games
router.get('/', async function (req, res, next) {
    try {
        var games = await Game.find();
        res.status(200).json({ 'games': games });
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
            return res.status(404).json({ 'message': 'Game not found' });
        }
        res.status(200).json(game);
    } catch (err) {
        next(err);
    }
});

// Get a game by name
router.get('/name/:name', async function (req, res, next) {
    var name = req.params.name;
    try {
        var game = await Game.findOne({ name: name });
        if (game === null) {
            return res.status(404).json({ 'message': 'User not found' });
        }
        res.status(200).json(game);
    } catch (err) {
        next(err);
    }
});

// ------------ UPDATE ------------

// Replace a game by id
router.put('/id/:id', async function (req, res, next) {
    // Check name
    if (typeof req.body.name !== 'string' || req.body.name === null || req.body.name.length < 1) {
        return res.status(400).json({ "message": "Bad Request: name must be at least 1 character long" });
    }

    // Check author
    if (typeof req.body.author !== 'string' || req.body.author === null || req.body.author.length < 1) {
        return res.status(400).json({ "message": "Bad Request: name must be at least 1 character long" });
    }

    // Check that every element in tag is a string
    if (!Array.isArray(req.body.tag)) {
        return res.status(400).json({ "message": "Bad Request: tag must be an array of strings" });
    }
    for (var i = 0; i < req.body.tag.length; i++) {
        if (typeof req.body.tag[i] !== 'string') {
            return res.status(400).json({ "message": "Bad Request: tag must be an array of strings" });
        }

        if (req.body.tag === null || req.body.tag.length < 1 || req.body.tag.length > 25) {
            return res.status(400).json({ "message": "Bad Request: every tag must be between 1 and 25 characters long. Tag: " + i + "is wrong" });
        }
    }

    // Check if date is a valid date
    const date = new Date(req.body.releaseDate);
    if (Object.prototype.toString.call(date) !== '[object Date]' || isNaN(date.getTime())) {
        return res.status(400).json({ "message": "Bad Request: releaseDate must be a date" });
    }

    var id = req.params.id;
    try {
        const game = await Game.findById(id);
        if (game === null) {
            return res.status(404).json({ "message": "Game not found" });
        }

        const gameExist = await Game.exists({ name: req.body.name });
        if (gameExist) {
            if (game.name !== req.body.name) {
                return res.status(400).send({ message: "Game already exists" });
            }
        }

        game.name = req.body.name;
        game.author = req.body.author;
        game.releaseDate = req.body.releaseDate;
        game.tag = req.body.tag;

        await game.save();
        res.status(201).json(game);
    } catch (err) {
        next(err);
    }
});

// Update a game by id 
// TODO: fix me, can only change all at a time
router.patch('/id/:id', async function (req, res, next) {
    // Check name
    if (typeof req.body.name !== 'string' || req.body.name === null || req.body.name.length < 1) {
        return res.status(400).json({ "message": "Bad Request: name must be at least 1 character long" });
    }

    // Check author
    if (typeof req.body.author !== 'string' || req.body.author === null || req.body.author.length < 1) {
        return res.status(400).json({ "message": "Bad Request: name must be at least 1 character long" });
    }

    // Check that every element in tag is a string
    if (!Array.isArray(req.body.tag)) {
        return res.status(400).json({ "message": "Bad Request: tag must be an array of strings" });
    }
    for (var i = 0; i < req.body.tag.length; i++) {
        if (typeof req.body.tag[i] !== 'string') {
            return res.status(400).json({ "message": "Bad Request: tag must be an array of strings. Tag: " + i + "is wrong" });
        }

        if (req.body.tag === null || req.body.tag.length < 1 || req.body.tag.length > 25) {
            return res.status(400).json({ "message": "Bad Request: every tag must be between 1 and 25 characters long. Tag: " + i + "is wrong" });
        }
    }

    // Check if date is a valid date
    const date = new Date(req.body.releaseDate);
    if (Object.prototype.toString.call(date) !== '[object Date]' || isNaN(date.getTime())) {
        return res.status(400).json({ "message": "Bad Request: releaseDate must be a date" });
    }

    var id = req.params.id;
    try {
        const game = await Game.findById(id);
        if (game === null) {
            return res.status(404).json({ "message": "Game not found" });
        }

        const gameExist = await Game.exists({ name: req.body.name });
        if (gameExist) {
            if (game.name !== req.body.name) {
                return res.status(400).send({ message: "Game already exists" });
            }
        }

        game.name = (req.body.name || game.name);
        game.author = (req.body.author || game.author);
        game.releaseDate = (req.body.releaseDate || game.releaseDate);
        game.tag = (req.body.tag || game.tag);

        await game.save();
        res.status(201).json(game);
    } catch (err) {
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
            return res.status(404).json({ 'message': 'Game not found' });
        }
        res.status(200).json(game);
    } catch (err) {
        next(err);
    }
});

// Delete a game by name
router.delete('/name/:name', async function (req, res, next) {
    var name = req.params.name;
    try {
        var game = await Game.findOneAndDelete({ name: name });
        if (game === null) {
            return res.status(404).json({ 'message': 'Game not found' });
        }
        res.status(200).json(game);
    } catch (err) {
        next(err);
    }
});

// Delete all games
router.delete('/', async function (req, res, next) {
    try {
        const game = await Game.find().deleteMany().exec();
        res.status(200).json("All games deleted");
    } catch (err) {
        next(err);
    }
});

module.exports = router;
