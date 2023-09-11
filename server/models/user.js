"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/},
    password: { type: String, required: true },
    bio: { type: String, default: 'This user has not set a bio yet.' },
    following: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    pinnedReview: { type: Schema.Types.ObjectId, ref: 'reviews' }
});

module.exports = mongoose.model('users', userSchema);
