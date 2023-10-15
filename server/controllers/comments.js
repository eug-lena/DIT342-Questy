"use strict";

var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var queryHandler = require('./queryhandler');
var linksHandler = require('./linkshandler');

// ------------ CREATE ------------

// Create a new comment
router.post('/', async function (req, res, next) {

    // Check if user is authenticated
    if (!req.isAuthenticated()) {
        return res.status(401).json({ "message": "You need to login to post comments" });
    }

    var comment = new Comment(req.body);
    try {
        // To ensure that date, isEdited and user are set correctly
        comment.user = req.user._id;
        comment.date = Date.now();
        comment.isEdited = false;

        await comment.save();
        return res.status(201).json(comment);

    } catch (err) {
        // CastError is thrown when an invalid id is passed
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

// ------------ READ ------------

// Get comment(s) by query
router.get('/', async function (req, res, next) {
    try {
        // Create query from query parameters
        var query = Comment.find(queryHandler.queryCreation(req));
        if (req.query.sort) {
            query = queryHandler.sortQuery(req, query);
        }
        if (req.query.fields) {
            query = queryHandler.fieldQuery(req, query);
        }

        // Get all matching documents
        var comments = await query.populate('user', 'username');

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
                    rel: "self", href: "http://localhost:3000/api/v1/comments" + req.url
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
router.get('/:id', async function (req, res, next) {
    var id = req.params.id;
    try {
        var comment = await Comment.findById(id).populate('user', 'username');
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

        // Check if user is authorized to edit this comment
        if (!req.isAuthenticated() || comment.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ "message": "You are not authorized to edit this comment" });
        }

        // Update the comment
        comment.text = req.body.text;
        comment.opinion = req.body.opinion;
        comment.isEdited = true;

        await comment.save();
        return res.status(201).json(comment);

    } catch (err) {
        // CastError is thrown when an invalid id is passed
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
        return res.status(201).json(comment);

    } catch (err) {
        // CastError is thrown when an invalid id is passed
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
    var id = req.params.id;
    try {
        var comment = await Comment.findOneAndDelete({ _id: id });
        if (comment === null) {
            return res.status(404).json({ "message": "User not found" });
        }
        return res.status(200).json(comment);

    } catch (err) {
        // CastError is thrown when an invalid id is passed to finOneAndDelete
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }
        next(err);
    }
});

// Delete comment(s) by query
router.delete('/', async function (req, res, next) {
    try {
        // Create query from query parameters
        var query = Comment.find(queryHandler.queryCreation(req));

        // Delete all matching documents
        const comments = await query.deleteMany();

        if (comments.deletedCount === 0) {
            return res.status(404).json({ "message": "Comment(s) not found" });
        }

        return res.status(200).json({ "message": "Comment(s) deleted", "deletedCount": comments.deletedCount });

    } catch (err) {
        // CastError is thrown when an invalid id is passed
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        next(err);
    }
});

module.exports = router;
