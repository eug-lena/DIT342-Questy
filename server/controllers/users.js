"use strict";

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Util = require('./util');

function addUserLinks(user) {
    user.links = [
        {
            rel: "self", href: "http://localhost:3000/api/v1/users/" + user._id
        },
        {
            rel: "reviews", href: "http://localhost:3000/api/v1/reviews/user/" + user._id
        }
    ];
}

// ------------ CREATE ------------

// Create a new user
router.post('/', async function (req, res, next) {
    var user = new User(req.body);
    try {
        await user.save();
        return res.status(201).json(user);
    } catch (err) {
        // MongoServerError with code 11000 is thrown when a duplicate key is found
        if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(400).json({ "message": "A user with that username already exists" });
        }

        // ValidationError is thrown when a required field is missing or is invalid
        if (err.name === 'ValidationError') {
            return res.status(400).json({ "message": err.message });
        }

        next(err);
    }
});

// ------------ READ ------------

// Get user(s) by query
router.get('/', async function (req, res, next) {
    try {
        // Create query from query parameters
        var query = User.find(Util.queryCreation(req));
        if (req.query.sort) {
            query = Util.sortQuery(req, query);
        }
        if (req.query.fields) {
            query = Util.fieldQuery(req, query);
        }

        // Get all matching documents
        var users = await query;

        if (users.length === 0) {
            return res.status(404).json({ "message": "User(s) not found" });
        }

        if (!req.query.fields || req.query.fields.split(',').includes('links')) {
            // Add links to each user
            users = users.map(user => user.toObject());
            users.forEach(function (user) {
                addUserLinks(user);
            });
        }

        return res.status(200).json({
            users,
            "links": [
                {
                    rel: "self", href: "http://localhost:3000/api/v1/users" + req.url
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

// Get a user by id
router.get('/:id', async function (req, res, next) {
    var id = req.params.id;
    try {
        var user = await User.findById(id);
        if (user === null) {
            return res.status(404).json({ "message": "User not found" });
        }

        // Add links to user
        user = user.toObject();
        addUserLinks(user);

        return res.status(200).json(user);
    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        next(err);
    }
});

// ------------ UPDATE ------------

// Replace a user by id
router.put('/:id', async function (req, res, next) {
    var id = req.params.id;
    try {
        const user = await User.findById(id);
        if (user === null) {
            return res.status(404).json({ "message": "User not found" });
        }

        user.username = req.body.username;
        user.password = req.body.password;
        user.bio = req.body.bio;
        user.following = req.body.following;
        user.pinnedReview = req.body.pinnedReview;

        await user.save();
        return res.status(201).json(user);
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
            return res.status(400).json({ "message": "User already exists" });
        }
        next(err);
    }
});

// Update a user by id 
router.patch('/:id', async function (req, res, next) {
    var id = req.params.id;
    try {
        const user = await User.findById(id);
        if (user === null) {
            return res.status(404).json({ "message": "User not found" });
        }

        user.username = (req.body.username || user.username);
        user.password = (req.body.password || user.password);
        user.bio = (req.body.bio || user.bio);
        user.following = (req.body.following || user.following);
        user.pinnedReview = (req.body.pinnedReview || user.pinnedReview);

        await user.save();
        return res.status(201).json(user);
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
            return res.status(400).json({ "message": "User already exists" });
        }

        next(err);
    }
});

// ------------ DELETE ------------

// Delete a user by id
router.delete('/:id', async function (req, res, next) {
    var id = req.params.id;
    try {
        var user = await User.findOneAndDelete({ _id: id });
        if (user === null) {
            return res.status(404).json({ "message": "User not found" });
        }
        return res.status(200).json(user);
    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }
        next(err);
    }
});

// Delete user(s) by query
router.delete('/', async function (req, res, next) {
    try {
        // Create query from query parameters
        var query = User.find(Util.queryCreation(req));

        // Delete all matching documents
        const users = await query.deleteMany();

        if (users.deletedCount === 0) {
            return res.status(404).json({ "message": "User(s) not found" });
        }

        return res.status(200).json({ "message": users.deletedCount + " users deleted" });
    } catch (err) {
        // CastError is thrown when an invalid id is passed
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        next(err);
    }
});

module.exports = router;
