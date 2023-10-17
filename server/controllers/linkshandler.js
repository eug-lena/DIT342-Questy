"use strict";

module.exports = {
    // Add links to a user
    addUserLinks: function (user) {
        user.links = {
            self: { href: "http://localhost:3000/api/v1/users/" + user._id },
            reviews: { href: "http://localhost:3000/api/v1/reviews?user=" + user._id },
            comments: { href: "http://localhost:3000/api/v1/comments?user=" + user._id }
        };
    },

    // Add links to a game
    addGameLinks: function (game) {
        game.links = {
            self: { href: "http://localhost:3000/api/v1/games/" + game._id },
            reviews: { href: "http://localhost:3000/api/v1/reviews?game=" + game._id }
        };
    },

    // Add links to a review
    addReviewLinks: function (review) {
        review.links =
        {
            self: { href: "http://localhost:3000/api/v1/reviews/" + review._id },
            comments: { href: "http://localhost:3000/api/v1/reviews/" + review._id + "/comments" },
            game: { href: "http://localhost:3000/api/v1/games/" + review.game._id },
            user: { href: "http://localhost:3000/api/v1/users/" + review.user._id }
        };
    },

    // Add links to a comment
    addCommentLinks: function (comment) {
        comment.links = {
            self: { href: "http://localhost:3000/api/v1/comments/" + comment._id },
            review: { href: "http://localhost:3000/api/v1/reviews/" + comment.review },
            user: { href: "http://localhost:3000/api/v1/users/" + comment.user._id }
        };

    }
};
