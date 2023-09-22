"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
    name: { type: String, required: true, unique: true, maxLength: [75, 'Name must be at most 75 characters long'] },
    author: { type: String, required: true, maxLength: [75, 'Author must be at most 75 characters long'] },
    releaseDate: { type: Date, required: true },
    tag: {
        type: [{
            type: String,
            maxLength: 25,
        }],
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: 'Tag must be an array with at least one element'
        },
    }
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
