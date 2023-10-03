"use strict";

module.exports = {

    queryCreation: function (req) {
        // Exclude 'excludedFields' from 'query'
        var query = { ...req.query };
        // _method is used for method override
        var excludedFields = ['_method', 'sort', 'fields', 'limit', 'offset'];
        excludedFields.forEach(excludedField => delete query[excludedField]);

        // Reconstruct to MongoDB query operators (adds '$' in front of 'match', i.e 'gt' -> '$gt')
        var queryStr = JSON.stringify(query);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        return JSON.parse(queryStr);
    },

    // Sorting query
    sortQuery: function (req, query) {
        // Reconstruct to MongoDB sort operators
        const sort = req.query.sort.split(',').join(' ');
        query = query.sort(sort);
        return query;
    },

    // Field limiting
    fieldQuery: function (req, query) {
        // Reconstruct to MongoDB field limiting operators
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
        return query;
    }

};
