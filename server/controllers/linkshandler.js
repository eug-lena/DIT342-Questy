"use strict";

module.exports = {
    // Add links to a user
    addUserLinks: function (user) {
        user.links = [
            {
                rel: "self", href: "http://localhost:3000/api/v1/users/" + user._id
            },
            {
                rel: "reviews", href: "http://localhost:3000/api/v1/reviews/user/" + user._id
            }
        ];
    },

    // Add links to a game
    addGameLinks: function (game) {
        game.links = [
            {
                rel: "self", href: "http://localhost:3000/api/v1/games/" + game._id
            },
            {
                rel: "reviews", href: "http://localhost:3000/api/v1/reviews/game/" + game._id
            }
        ];
    },

    // Add links to a review
    addReviewLinks: function (review) {
        review.links = [
            {
                rel: "self", href: "http://localhost:3000/api/v1/reviews/" + review._id
            },
            {
                rel: "new_comment", href: "http://localhost:3000/api/v1/reviews/" + review._id + "/comment"
            },
            {
                rel: "comments", href: "http://localhost:3000/api/v1/comments/review/" + review._id
            }
        ];
    },

    // Add links to a comment
    addCommentLinks: function (comment) {
        comment.links = [
            {
                rel: "self", href: "http://localhost:3000/api/v1/comments/" + comment._id
            }
        ];
    }
};