"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
    name: { type: String, required: true, unique: true, minLength: [1, 'Name must be at least 1 character long'] },
    author: { type: String, required: true, minLength: [1, 'Author must be at least 1 character long'] },
    releaseDate: { type: Date, required: true },
    tag: [{ type: String, required: true, minLength: [1, 'Must be at least 1 character long'], maxLength: [25, 'Must be at most 25 characters long'] }],
});

// Cascade delete reviews when a game is deleted for findOneAndDelete
gameSchema.pre('findOneAndDelete', { document: false, query: true }, async function () {
    var Review = require('../models/review');
    const doc = await this.model.findOne(this.getFilter());
    if (doc === null) return;
    await Review.deleteMany({ game: doc._id });
});

// Cascade delete reviews when games is deleted for deleteMany
gameSchema.pre('deleteMany', { document: false, query: true }, async function () {
    var Review = require('../models/review');
    const docs = await this.model.find(this.getFilter());
    if (docs === null) return;
    for (const doc of docs) {
        await Review.find({ game: doc._id }).deleteMany();
    }
});

module.exports = mongoose.model('games', gameSchema);
