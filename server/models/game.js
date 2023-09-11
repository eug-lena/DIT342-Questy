"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
    name: {type: String, required: true, unique: true, minLength: 1},
    author: {type: String, required: true, minLength: 1},
    releaseDate: {type: Date, required: true},
    tag: [{type: String, required: true, minLength: 1, maxLength: 25}],
});

module.exports = mongoose.model('games', gameSchema);
