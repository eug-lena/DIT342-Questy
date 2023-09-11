"use strict";

var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Review = require('../models/review');
var User = require('../models/user');

// ------------ CREATE ------------

// Create a new comment
router.post('/', async function (req, res, next) {

    // Check if text is a string
    if (typeof req.body.text !== 'string') {
        return res.status(400).json({ "message": "Bad Request: text must be a string" });
    }

    // check if opinion is a boolean
    if (typeof req.body.opinion !== 'boolean') {
        return res.status(400).json({ "message": "Bad Request: opinion must be a boolean" });
    }

    // Check text length
    if (req.body.text.length > 2500) {
        return res.status(400).json({ "message": "Bad Request: text must be less than 2500 characters" });
    }

    var comment = new Comment(req.body);
    try {
        if (await User.findById(req.body.userId) === null) {
            return res.status(400).json({ "message": "Bad Request: user does not exist" });
        }

        if (await Review.findById(req.body.reviewId) === null) {
            return res.status(400).json({ "message": "Bad Request: review does not exist" });
        }

        // So it is not overwritten by the request
        comment.date = Date.now();
        await comment.save();
        res.status(201).json(comment);
        
    } catch (err) {
        next(err);
    }
});


module.exports = router;
