"use strict";

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(400).json({ "message": 'User does not exist or password is incorrect' });
        }

        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }

            res.send({ 'message': 'User authenticated' });
        });
    })(req, res, next);
});

router.get('/isAuthenticated', function (req, res) {
    try {
        if (req.isAuthenticated()) {
            return res.json({ "authenticated": true, "username": req.user.username, "_id": req.user._id });
        } else {
            return res.json({ "authenticated": false });
        }
    } catch (err) {
        return next(err);
    }
});

router.delete('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.json({ "message": "User logged out" });
    });
});

module.exports = router;