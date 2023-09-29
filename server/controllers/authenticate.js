"use strict";

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureMessage: true }));

router.post('/register', function (req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            return res.status(400).json({ "message": err.message });
        }

        passport.authenticate('local')(req, res, function () {
            return res.redirect('/');
        });
    });
});

router.get('/isAuthenticated', function (req, res) {
    console.log(req.isAuthenticated());
    return res.json({ "authentication": req.isAuthenticated(), "user": req.user });
});

router.delete('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
    });
});

module.exports = router;