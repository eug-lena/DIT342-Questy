"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Review = require('../models/review');
var Comment = require('../models/comment');

var userSchema = new Schema({
    username: { type: String, required: true, unique: true, match: [/^[a-zA-Z0-9]{6,18}$/, "Username can only be letters and number between 6-18 length"] }, // Minimum six characters, only letters and numbers
    password: { type: String, required: true },
    bio: { type: String, default: 'This user has not set a bio yet.' },
    following: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    pinnedReview: {
        type: Schema.Types.ObjectId,
        ref: 'reviews',
        validate: {
            validator: async function (value) {
                const review = await Review.findById(value);
                if (review === null) {
                    return false;
                }

                return true;
            },
            message: 'Review does not exist'
        }
    }
});

userSchema.pre('findOneAndDelete', { document: false, query: true }, async function () {
    const doc = await this.model.findOne(this.getFilter());
    if (doc === null) {
        return;
    }

    await nullifyUserForReviewsAndComments(doc);
});

userSchema.pre('deleteMany', { document: false, query: true }, async function () {
    const docs = await this.model.find(this.getFilter());
    if (docs === null) {
        return;
    }

    for (const doc of docs) {
        await nullifyUserForReviewsAndComments(doc);
    }
});

async function nullifyUserForReviewsAndComments(doc) {    
    const reviews = await Review.find({ user: doc._id });
    if (reviews !== null) {
        for (const review of reviews) {
            review.user = undefined;
            await review.save();
        }
    }

    const comments = await Comment.find({ user: doc._id });
    if (comments !== null) {
        for (const comment of comments) {
            comment.user = undefined;
            await comment.save();
        }
    }
}

module.exports = mongoose.model('users', userSchema);
