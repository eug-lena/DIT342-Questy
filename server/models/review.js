"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    game: {
        type: Schema.Types.ObjectId,
        ref: 'games',
        required: true,
        validate: {
            // Game must exist
            validator: async function (game_id) {
                var Game = require('../models/game');
                const doc = await Game.findById(game_id);
                if (doc === null) return false;
                return true;
            },
            message: 'Game does not exist'
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        validate: {
            // Can either be null or a user that exists
            validator: async function (user_id) {
                if (user_id === null) return true;
                
                var User = require('../models/user');
                const doc = await User.findById(user_id);
                if (doc === null) return false;
                return true;
            },
            message: 'User does not exist'
        }
    },
    title: { type: String, required: true, maxLength: [50, 'Title cannot exceed 50 characters'], minLength: [1, 'Title must be at least 1 character long'] },
    rating: { type: Number, required: true, min: [1, 'Rating must be at least 1'], max: [10, 'Rating cannot exceed 10'] },
    text: { type: String, maxLength: [2500, 'Review cannot exceed 2500 characters'] },
    date: { type: Date, default: Date.now },
    isEdited: { type: Boolean, default: false }
});

// Index for unique user-game pairs
reviewSchema.index({ user: 1, game: 1 }, { unique: true })

// Cascade delete comments when a review is deleted for findOneAndDelete
reviewSchema.pre('findOneAndDelete', { document: false, query: true }, async function () {
    var Comment = require('../models/comment');
    const doc = await this.model.findOne(this.getFilter());
    if (doc === null) {
        return;
    }
    await Comment.deleteMany({ review: doc._id });
});

// Cascade delete comments when reviews are deleted for deleteMany
reviewSchema.pre('deleteMany', { document: false, query: true }, async function () {
    var Comment = require('../models/comment');
    const docs = await this.model.find(this.getFilter());
    if (docs === null) {
        return;
    }
    for (const doc of docs) {
        await Comment.deleteMany({ review: doc._id });
    }
});

module.exports = mongoose.model('reviews', reviewSchema);
