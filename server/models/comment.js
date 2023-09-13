"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    review: { type: Schema.Types.ObjectId, ref: 'reviews', required: true },
    text: { type: String, required: true, maxLength: 2500 },
    opinion: { type: Boolean, default: null },
    date: { type: Date, default: Date.now },
    isEdited: { type: Boolean, default: false }
});

module.exports = mongoose.model('comments', commentSchema);
