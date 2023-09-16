"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    review: {
        type: Schema.Types.ObjectId,
        ref: 'reviews',
        required: true,
        validate: {
            // Review must exist
            validator: async function (review_id) {
                var review = await mongoose.model('reviews').findById(review_id);
                if (review === null) return false;
                return true;
            },
            message: 'Review does not exist'
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
    text: { type: String, required: true, maxLength: [2500, 'Comment must be at most 2500 characters long'] },
    opinion: { type: Boolean, default: null },
    date: { type: Date, default: Date.now },
    isEdited: { type: Boolean, default: false }
});

module.exports = mongoose.model('comments', commentSchema);
