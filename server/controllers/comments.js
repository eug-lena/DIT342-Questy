"use strict";

var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');

// ------------ CREATE ------------

// Create a new comment
router.post('/', async function (req, res, next) {
    var comment = new Comment(req.body);
    try {
        // To ensure that date and isEdited are set correctly
        comment.date = Date.now();
        comment.isEdited = false;

        await comment.save();
        res.status(201).json(comment);

    } catch (err) {
        // ValidationError is thrown when a required field is missing or is invalid
        if (err.name === 'ValidationError') {
            res.status(400).json({ "message": err.message });
        }

        next(err);
    }
});

// ------------ READ ------------

// Get all comments
router.get('/', async function (req, res, next) {
    try {
        var comments = await Comment.find();
        res.status(200).json(comments);

    } catch (err) {
        next(err);
    }
});

// Get a comment by id
router.get('/:id', async function (req, res, next) {
    try {
        var comment = await Comment.findById(req.params.id);
        if (comment === null) {
            return res.status(404).json({ "message": "Comment not found" });
        }
        res.status(200).json(comment);

    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        next(err);
    }
});

// Get all comments for a review sorted by dates in descending order
router.get('/review/:id', async function (req, res, next) {
    try {
        var comments = await Comment.find({ review: req.params.id }).sort({ date: -1 }); // -1 = descending order
        res.status(200).json(comments);

    } catch (err) {
        // CastError is thrown when an invalid id is passed to find
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        next(err);
    }
});

// Get all comments for a review, based on the opinion, sorted by dates in descending order
router.get('/review/:id/opinion/:opinion', async function (req, res, next) {
    try {
        var comments = await Comment.find({ review: req.params.id, opinion: req.params.opinion }).sort({ date: -1 }); // -1 = descending order
        res.status(200).json(comments);

    } catch (err) {
        // CastError is thrown when an invalid id is passed to find
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        next(err);
    }
});

// ------------ UPDATE ------------

// Replace a comment by id
router.put('/:id', async function (req, res, next) {
    try {
        var comment = await Comment.findById(req.params.id);
        if (comment === null) {
            return res.status(404).json({ "message": "Comment not found" });
        }

        // Update the comment
        comment.text = req.body.text;
        comment.opinion = req.body.opinion;
        comment.isEdited = true;

        await comment.save();
        res.status(200).json(comment);

    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        // ValidationError is thrown when a required field is missing or is invalid
        if (err.name === 'ValidationError') {
            return res.status(400).json({ "message": err.message });
        }

        next(err);
    }
});

// Update a comment by id
router.patch('/:id', async function (req, res, next) {
    try {
        var comment = await Comment.findById(req.params.id);
        if (comment === null) {
            return res.status(404).json({ "message": "Comment not found" });
        }

        comment.text = (req.body.text || comment.text);
        comment.opinion = (req.body.opinion || comment.opinion);
        comment.isEdited = true;

        await comment.save();
        res.status(200).json(comment);

    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        // ValidationError is thrown when a required field is missing or is invalid
        if (err.name === 'ValidationError') {
            return res.status(400).json({ "message": err.message });
        }

        next(err);
    }
});

// ------------ DELETE ------------

// Delete a comment by id
router.delete('/:id', async function (req, res, next) {
    try {
        var comment = await Comment.findOneAndDelete({ _id: id });
        if (comment === null) {
            return res.status(404).json({ "message": "User not found" });
        }
        res.status(200).json(comment);

    } catch (err) {
        // CastError is thrown when an invalid id is passed to finOneAndDelete
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }
        next(err);
    }
});

// Delete all comments for a review
router.delete('/review/:id', async function (req, res, next) {
    try {
        var comments = await Comment.deleteMany({ review: req.params.id });
        res.status(200).json(comments);

    } catch (err) {
        // CastError is thrown when an invalid id is passed to deleteMany
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }
        next(err);
    }
});

// Delete all comments for a user
router.delete('/user/:id', async function (req, res, next) {
    try {
        var comments = await Comment.deleteMany({ user: req.params.id });
        res.status(200).json(comments);

    } catch (err) {
        // CastError is thrown when an invalid id is passed to deleteMany
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }
        next(err);
    }
});

// Delete all comments
router.delete('/', async function (req, res, next) {
    try {
        var comments = await Comment.deleteMany();
        res.status(200).json(comments);

    } catch (err) {
        next(err);
    }
});

module.exports = router;
