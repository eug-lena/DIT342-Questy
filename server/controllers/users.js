"use strict";

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var queryHandler = require('./queryhandler');
var linksHandler = require('./linkshandler');
var passport = require('passport');

// ------------ CREATE ------------

// Create a new user
router.post('/', async function (req, res, next) {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            return res.status(400).json({ "message": err.message });
        }

        passport.authenticate('local')(req, res, function () {
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }

                res.status(201).send({ user, 'message': 'User created & authenticated' });
            });
        });
    });
});

// ------------ READ ------------

// Get user(s) by query
router.get('/', async function (req, res, next) {
    try {
        // Create query from query parameters
        var query = User.find(queryHandler.queryCreation(req));
        if (req.query.sort) {
            query = queryHandler.sortQuery(req, query);
        }
        if (req.query.fields) {
            query = queryHandler.fieldQuery(req, query);
        }

        // Get all matching documents
        var users = await query;
        if (users.length === 0) {
            return res.status(404).json({ "message": "User(s) not found" });
        }

        // Populate following
        if (!req.query.fields || req.query.fields.split(',').includes('following')) {
            users = await User.populate(users, { path: 'following', select: 'username' });
        }

        // Populate pinnedReview
        if (!req.query.fields || req.query.fields.split(',').includes('pinnedReview')) {
            users = await User.populate(users, { path: 'pinnedReview', populate: { path: 'game', select: 'name' } });
        }

        if (!req.query.fields || req.query.fields.split(',').includes('links')) {
            // Add links to each user
            users = users.map(user => user.toObject());
            users.forEach(function (user) {
                linksHandler.addUserLinks(user);
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
        // Find user by id
        var user = await User.findById(id);
        if (user === null) {
            return res.status(404).json({ "message": "User not found" });
        }

        // Populate fields
        user = await User.populate(user, { path: 'following', select: 'username' });
        user = await User.populate(user, { path: 'pinnedReview', populate: { path: 'game', select: 'name' } });

        // Add links to user
        user = user.toObject();
        linksHandler.addUserLinks(user);

        return res.status(200).json(user);
    } catch (err) {
        // CastError is thrown when an invalid id is passed to findById
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        next(err);
    }
});

// Get a users (with id) most recent reviews by people they follow
router.get('/:id/followingReviews', async function (req, res, next) {
    var id = req.params.id;
    try {
        var user = await User.findById(id);
        if (user === null) {
            return res.status(404).json({ "message": "User not found" });
        }

        // Find reviews by users that the user follows and sort by most recent
        let Review = require('../models/review');
        var reviews = await Review.find({ user: { $in: user.following } }).sort({ _id: -1 }).limit(3).populate('user', 'username').populate('game', 'name');

        return res.status(200).json(reviews);
    }
    catch (err) {

        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }
        next(err);
    }

});

// Get a users (with id) most recent activity
router.get('/:id/recentActivity', async function (req, res, next) {
    var id = req.params.id;
    try {
        var user = await User.findById(id);
        if (user === null) {
            return res.status(404).json({ "message": "User not found" });
        }

        // Find reviews by user and sort by most recent
        let Review = require('../models/review');
        var reviews = await Review.find({ user: user._id }).sort({ _id: -1 }).limit(3).populate('game', 'name');

        // For each review, add type: 'review', and split date by 'T'
        reviews = reviews.map(review => review.toObject());
        reviews.forEach(function (review) {
            review.type = 'review';
            var date = new Date(review.date);
            review.date = date.toISOString().split('T')[0];
        });        
        
        // Find comments by user and sort by most recent
        let Comment = require('../models/comment');
        var comments = await Comment.find({ user: user._id }).sort({ _id: -1 }).limit(3).populate('review', 'title');

        // For each comment, add type: 'comment'

        // Combine reviews and comments
        var recentActivity = reviews.concat(comments);

        // Sort by date
        recentActivity.sort((a, b) => (a.date < b.date) ? 1 : -1);

        return res.status(200).json(recentActivity);
    }
    catch (err) {
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

        // Check if authenticated user is owner of user
        if (!req.isAuthenticated() || req.user._id.toString() !== user._id.toString()) {
            return res.status(401).json({ "message": "You are not authorized to edit this user" });
        }

        // user.username = req.body.username; // Can't change username
        user.bio = req.body.bio;
        user.following = req.body.following;
        user.pinnedReview = req.body.pinnedReview;

        await user.save();
        return res.status(201).json(user);
    } catch (err) {
        // MongoServerError with code 11000 is thrown whenever you try to change a unique field to a value that already exists in the collection
        if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(400).json({ "message": "User already exists" });
        }

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

// Update a user by id 
router.patch('/:id', async function (req, res, next) {
    var id = req.params.id;
    try {
        const user = await User.findById(id);
        if (user === null) {
            return res.status(404).json({ "message": "User not found" });
        }

        // Check if authenticated user is owner of user
        if (!req.isAuthenticated() || req.user._id.toString() !== user._id.toString()) {
            return res.status(401).json({ "message": "You are not authorized to edit this user" });
        }

        // user.username = (req.body.username || user.username); // Can't change username
        if (req.body.bio !== undefined) {
            user.bio = req.body.bio
        }

        if (req.body.following !== undefined) {
            user.following = req.body.following
        }

        if (req.body.pinnedReview !== undefined) {
            user.pinnedReview = req.body.pinnedReview
        }

        await user.save();
        return res.status(201).json(user);
    } catch (err) {
        // MongoServerError with code 11000 is thrown whenever you try to change a unique field to a value that already exists in the collection
        if (err.name === 'MongoServerError' && err.code === 11000) {
            return res.status(400).json({ "message": "User already exists" });
        }

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
        var query = User.find(queryHandler.queryCreation(req));

        // Delete all matching documents
        const users = await query.deleteMany();

        if (users.deletedCount === 0) {
            return res.status(404).json({ "message": "User(s) not found" });
        }

        var response = {
            "message": "User(s) deleted",
            "deletedCount": users.deletedCount
        };

        return res.status(200).json({ "message": "User(s) deleted", "deletedCount": users.deletedCount });
    } catch (err) {
        // CastError is thrown when an invalid id is passed
        if (err.name === 'CastError') {
            return res.status(400).json({ "message": "Invalid " + err.path });
        }

        next(err);
    }
});

module.exports = router;
