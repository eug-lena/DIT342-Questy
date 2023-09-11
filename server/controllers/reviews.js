"use strict";

var express = require('express');
var router = express.Router();
var Review = require('../models/review');
var User = require('../models/user');
var Game = require('../models/game');

// ------------ CREATE ------------

// Create a new review
router.post('/', async function (req, res, next) {

    // Check if title is a string, rating is a number, and text is a string
    if (typeof req.body.title !== 'string' || typeof req.body.rating !== 'number' || typeof req.body.text !== 'string') {
        return res.status(400).json({ "message": "Bad Request: title must be a string, rating must be a number, and text must be a string" });
    }

    // Check title
    if (req.body.title === null || req.body.title.length < 1 || req.body.title.length > 50) {
        return res.status(400).json({ "message": "Bad Request: title must be between 1 and 50 characters" });
    }

    // Check rating
    if (req.body.rating === null || req.body.rating < 1 || req.body.rating > 10) {
        return res.status(400).json({ "message": "Bad Request: rating must be between 1 and 10" });
    }

    // Check text length
    if (req.body.text.length > 2500) {
        return res.status(400).json({ "message": "Bad Request: text must be less than 2500 characters" });
    }

    var review = new Review(req.body);
    try {
        if (await User.findById(req.body.userId) === null) {
            return res.status(400).json({ "message": "Bad Request: user does not exist" });
        }

        if (await Game.findById(req.body.gameId) === null) {
            return res.status(400).json({ "message": "Bad Request: game does not exist" });
        }

        // So it is not overwritten by the request
        review.date = Date.now();
        await review.save();
        res.status(201).json(review);
        
    } catch (err) {
        next(err);
    }
});

module.exports = router;
