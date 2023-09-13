"use strict";

var express = require('express');
var router = express.Router();
var Review = require('../models/review');
var User = require('../models/user');
var Game = require('../models/game');

// ------------ CREATE ------------

// Create a new review
router.post('/', async function (req, res, next) {
    var review = new Review(req.body);
    try {
        // To ensure that date and isEdited are set correctly
        review.date = Date.now();
        review.isEdited = false;

        await review.save();
        res.status(201).json(review);

    } catch (err) {
        // ValidationError is thrown when a required field is missing or is invalid
        if (err.name === 'ValidationError') {
            res.status(400).json({ "message": err.message });
        }

        if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(400).json({ "message": "Bad Request: A user can only have one review per game" });
        }

        next(err);
    }
});

// ------------ READ ------------

// Get all reviews
router.get('/', async function (req, res, next) {
    try {
        var reviews = await Review.find();
        res.status(200).json({ "reviews": reviews });
    } catch (err) {
        next(err);
    }
});

// Get a review by id
router.get('/:id', async function (req, res, next) {
    try {
        var review = await Review.findById(req.params.id);
        if (review === null) {
            return res.status(404).json({ "message": "Review not found" });
        }
        res.status(200).json(review);
    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }
        next(err);
    }
});

// Get all reviews by game id
router.get('/game/:id', async function (req, res, next) {
    try {
        var reviews = await Review.find({ game: req.params.id });
        res.status(200).json(reviews);
    } catch (err) {
        // CastError is thrown when an invalid id is passed to find
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }
        next(err);
    }
});

// Get all reviews by user id
router.get('/user/:id', async function (req, res, next) {
    try {
        var reviews = await Review.find({ user: req.params.id });
        res.status(200).json(reviews);
    } catch (err) {
        // CastError is thrown when an invalid id is passed to find
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }
        next(err);
    }
});

// ------------ UPDATE ------------

// Replace a review by id
router.put('/:id', async function (req, res, next) {
    try {
        const review = await Review.findById(req.params.id);
        if (review === null) {
            return res.status(404).json({ "message": "Review not found" });
        }

        // review.user = req.body.user; // Can't change user
        // review.game = req.body.game; // Can't change game
        review.title = req.body.title;
        review.rating = req.body.rating;
        review.text = req.body.text;
        review.isEdited = true;

        await review.save();
        res.status(201).json(review);

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

// Update a review by id
router.patch('/:id', async function (req, res, next) {
    try {
        const review = await Review.findById(req.params.id);
        if (review === null) {
            return res.status(404).json({ "message": "Review not found" });
        }

        //review.user = (req.body.user || review.user); // Can't change user
        //review.game = (req.body.game || review.game); // Can't change game
        review.title = (req.body.title || review.title);
        review.rating = (req.body.rating || review.rating);
        review.text = (req.body.text || review.text);
        review.isEdited = true;

        await review.save();
        res.status(201).json(review);
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
            return res.status(400).json({ "message": "A review with that name already exists" });
        }

        next(err);
    }
});

// ------------ DELETE ------------

// Delete a review by id
router.delete('/:id', async function (req, res, next) {
    try {
        var review = await Review.findById(req.params.id);
        if (review === null) {
            return res.status(404).json({ "message": "Review not found" });
        }
        await review.remove();
        res.status(200).json({ "message": "Review deleted" });
    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid user id" });
        }
        next(err);
    }
});

// Delete all reviews
router.delete('/', async function (req, res, next) {
    try {
        await Review.deleteMany();
        res.status(200).json({ "message": "All reviews deleted" });
    } catch (err) {
        next(err);
    }
});

// Delete all reviews by game id
router.delete('/game/:id', async function (req, res, next) {
    try {
        await Review.deleteMany({ game: req.params.id });
        res.status(200).json({ "message": "All reviews for game deleted" });
    } catch (err) {
        // CastError is thrown when an invalid id is passed to deleteMany
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid game id" });
        }
        next(err);
    }
});

// Delete all reviews by user id
router.delete('/user/:id', async function (req, res, next) {
    try {
        await Review.deleteMany({ user: req.params.id });
        res.status(200).json({ "message": "All reviews for user deleted" });
    } catch (err) {
        // CastError is thrown when an invalid id is passed to deleteMany
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid user id" });
        }
        next(err);
    }
});

module.exports = router;
