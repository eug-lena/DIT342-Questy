"use strict";

var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');
var cors = require('cors');
var history = require('connect-history-api-fallback');

// Session libraries & dependencies
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MongoStore = require('connect-mongo');

// HTTP Method Override
var methodOverride = require('method-override');

// Controllers
var usersController = require('./controllers/users');
var gamesController = require('./controllers/games');
var reviewsController = require('./controllers/reviews');
var commentsController = require('./controllers/comments');
var authenticateController = require('./controllers/authenticate');

// Variables
var mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gameReviewDB';
var port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(mongoURI).catch(function (err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
});

// Create Express app
var app = express();

// HTTP Method Override
app.use(methodOverride('_method'));

// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// HTTP request logger
app.use(morgan('dev'));
// Enable cross-origin resource sharing for frontend must be registered before api
const corsOptions = {
    origin: [
        'http://localhost:8080',
        'http://localhost:3000'
    ],
    credentials: true
}
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Passport configuration
var mongoclient = mongoose.connection.getClient()
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ client: mongoclient }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 14 // 2 weeks
    }
}));
app.use(passport.initialize());
app.use(passport.session());
let User = require('./models/user');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Import routes
app.get('/api', function (req, res) {
    res.json({ 'message': 'Welcome to your DIT342 backend ExpressJS project!' });
});

// Controllers usage
app.use('/api/v1/users', usersController);
app.use('/api/v1/games', gamesController);
app.use('/api/v1/reviews', reviewsController);
app.use('/api/v1/comments', commentsController);
app.use('/api/v1/authenticate', authenticateController);

// Catch all non-error handler for api (i.e., 404 Not Found)
app.use('/api/*', function (req, res) {
    res.status(404).json({ 'message': 'Not Found' });
});

// Configuration for serving frontend in production mode
// Support Vue.js HTML 5 history mode
app.use(history());
// Serve static assets
var root = path.normalize(__dirname + '/..');
var client = path.join(root, 'client', 'dist');
app.use(express.static(client));

// Error handler (i.e., when exception is thrown) must be registered last
var env = app.get('env');
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    console.error(err.stack);
    var err_res = {
        'message': err.message,
        'error': {}
    };
    if (env === 'development') {
        // Return sensitive stack trace only in dev mode
        err_res['error'] = err.stack;
    }
    res.status(err.status || 500);
    res.json(err_res);
});

app.listen(port, function (err) {
    if (err) throw err;
    console.log(`Express server listening on port ${port}, in ${env} mode`);
    console.log(`Backend: http://localhost:${port}/api/`);
    console.log(`Frontend (production): http://localhost:${port}/`);
});

module.exports = app;
