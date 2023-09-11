"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    game: { type: Schema.Types.ObjectId, ref: 'games', required: true },
    title: { type: String, required: true, maxLength: 50, minLength: 1 },
    rating: { type: Number, required: true, min: 1, max: 10 },
    text: { type: String, maxLength: 2500 },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('reviews', reviewSchema);
