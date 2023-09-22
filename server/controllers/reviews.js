"use strict";

var express = require('express');
var router = express.Router();
var Review = require('../models/review');
var Util = require('./util');
var linksHandler = require('./linkshandler');

// ------------ CREATE ------------

// Create a new review
router.post('/', async function (req, res, next) {
    var review = new Review(req.body);
    try {
        // To ensure that date and isEdited are set correctly
        review.date = Date.now();
        review.isEdited = false;

        await review.save();
        return res.status(201).json(review);

    } catch (err) {
        // MongoServerError with code 11000 is thrown when a duplicate key is found
        if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(400).json({ "message": "A review by this user already exist for this game" });
        }

        // ValidationError is thrown when a required field is missing or is invalid
        if (err.name === 'ValidationError') {
            return res.status(400).json({ "message": err.message });
        }

        next(err);
    }
});

// Create a new comment for specific review
router.post('/:id/comments/', async function (req, res, next) {
    console.log(req.params.id);
    let Comment = require('../models/comment');
    var comment = new Comment(
        {
            user: req.body.user,
            text: req.body.text,
            opinion: req.body.opinion,
            date: Date.now(),
            isEdited: false,
            review: req.params.id
        }
    );
    try {
        await comment.save();
        return res.status(201).json(comment);
    } catch (err) {
        // ValidationError is thrown when a required field is missing or is invalid
        if (err.name === 'ValidationError') {
            return res.status(400).json({ "message": err.message });
        }

        // CastError is thrown when an invalid review id is passed to save
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        next(err);
    }
});

// ------------ READ ------------

// Get review(s) by query
router.get('/', async function (req, res, next) {
    try {
        // Create query from query parameters
        var query = Review.find(Util.queryCreation(req));
        if (req.query.sort) {
            query = Util.sortQuery(req, query);
        }
        if (req.query.fields) {
            query = Util.fieldQuery(req, query);
        }

        // Get all matching documents
        var reviews = await query;

        if (reviews.length === 0) {
            return res.status(404).json({ "message": "Review(s) not found" });
        }

        if (!req.query.fields || req.query.fields.split(',').includes('links')) {
            // Add links to each review
            reviews = reviews.map(review => review.toObject());
            reviews.forEach(function (review) {
                linksHandler.addReviewLinks(review);
            });
        }

        return res.status(200).json({
            reviews,
            "links": [
                {
                    rel: "self", href: "http://localhost:3000/api/v1/reviews" + req.url
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

// Get a review by id
router.get('/:id', async function (req, res, next) {
    try {
        var review = await Review.findById(req.params.id);
        if (review === null) {
            return res.status(404).json({ "message": "Review not found" });
        }

        // Add links to review
        review = review.toObject();
        linksHandler.addReviewLinks(review);

        return res.status(200).json(review);
    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }
        next(err);
    }
});

// Get all comments for a specific review
router.get('/:id/comments', async function (req, res, next) {
    try {
        let Comment = require('../models/comment');

        var query = Comment.find({ review: req.params.id });
        if (req.query.sort) {
            query = Util.sortQuery(req, query);
        }
        if (req.query.fields) {
            query = Util.fieldQuery(req, query);
        }

        // Get all matching documents
        var comments = await query;

        if (comments.length === 0) {
            return res.status(404).json({ "message": "Comment(s) not found" });
        }

        if (!req.query.fields || req.query.fields.split(',').includes('links')) {
            // Add links to each comment
            comments = comments.map(comment => comment.toObject());
            comments.forEach(function (comment) {
                linksHandler.addCommentLinks(comment);
            });
        }

        return res.status(200).json({
            comments,
            "links": [
                {
                    rel: "self", href: "http://localhost:3000/api/v1/reviews/" + req.params.id + "/comments" + req.url
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

// Get a comment by id
router.get('/:id/comments/:commentId', async function (req, res, next) {
    try {
        let Comment = require('../models/comment');
        var comment = await Comment.findById(req.params.commentId);
        if (comment === null) {
            return res.status(404).json({ "message": "Comment not found" });
        }

        // Add links to comment
        comment = comment.toObject();
        linksHandler.addCommentLinks(comment);

        return res.status(200).json(comment);
    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid comment id" });
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
        return res.status(201).json(review);

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
        return res.status(201).json(review);
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
    var id = req.params.id;
    try {
        var review = await Review.findOneAndDelete({ _id: id });
        if (review === null) {
            return res.status(404).json({ "message": "Review not found" });
        }
        return res.status(200).json(review);

    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid user id" });
        }
        next(err);
    }
});

// Delete review(s) by query
router.delete('/', async function (req, res, next) {
    try {
        // Create query from query parameters
        var query = Review.find(Util.queryCreation(req));

        // Delete all matching documents
        const reviews = await query.deleteMany();

        if (reviews.deletedCount === 0) {
            return res.status(404).json({ "message": "Review(s) not found" });
        }

        return res.status(200).json({ "message": "Review(s) deleted", "deletedCount": reviews.deletedCount });

    } catch (err) {
        // CastError is thrown when an invalid id is passed
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        next(err);
    }
});

// Delete a comment by id
router.delete('/:id/comments/:commentId', async function (req, res, next) {
    var id = req.params.commentId;
    try {
        let Comment = require('../models/comment');
        var comment = await Comment.findOneAndDelete({ _id: id });
        if (comment === null) {
            return res.status(404).json({ "message": "Comment not found" });
        }
        return res.status(200).json(comment);

    } catch (err) {
        // CastError is thrown when an invalid id is passed to finOneAndDelete
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid comment id" });
        }
        next(err);
    }
});

module.exports = router;
