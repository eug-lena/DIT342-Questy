"use strict";

var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* 
todo:
get all comments
get all reviews
*/

// ------------ CREATE ------------

// Create a new user
router.post('/', async function (req, res, next) {
    var user = new User(req.body);
    try {
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        // ValidationError is thrown when a required field is missing or is invalid
        if (err.name === 'ValidationError') {
            return res.status(400).json({ "message": err.message });
        }

        // MongoError with code 11000 is thrown when a duplicate key is found
        if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(400).json({ "message": "User already exists" });
        }

        next(err);
    }
});

// ------------ READ ------------

// Get all users
router.get('/', async function (req, res, next) {
    try {
        var users = await User.find();
        res.status(200).json({ "users": users });
    } catch (err) {
        next(err);
    }
});

// Get a user by id
router.get('/id/:id', async function (req, res, next) {
    var id = req.params.id;
    try {
        var user = await User.findById(id);
        if (user === null) {
            return res.status(404).json({ "message": "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        next(err);
    }
});

// Get a user by username
router.get('/user/:username', async function (req, res, next) {
    var username = req.params.username;
    try {
        var user = await User.findOne({ username: username });
        if (user === null) {
            return res.status(404).json({ "message": "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
});

// ------------ UPDATE ------------

// Replace a user by id
router.put('/id/:id', async function (req, res, next) {
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
        res.status(201).json(user);
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
router.patch('/id/:id', async function (req, res, next) {
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
        res.status(201).json(user);
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
router.delete('/id/:id', async function (req, res, next) {
    var id = req.params.id;
    try {
        var user = await User.findOneAndDelete({ _id: id });
        if (user === null) {
            return res.status(404).json({ "message": "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }
        next(err);
    }
});

// Delete a user by username
router.delete('/user/:username', async function (req, res, next) {
    var username = req.params.username;
    try {
        var user = await User.findOneAndDelete({ username: username });
        if (user === null) {
            return res.status(404).json({ "message": "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
});

// Delete all users
router.delete('/', async function (req, res, next) {
    try {
        const user = await User.find().deleteMany();
        res.status(200).json("All users deleted");
    } catch (err) {
        next(err);
    }
});

module.exports = router;
