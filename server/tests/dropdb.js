var mongoose = require('mongoose');

// Variables
var mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.error('Missing MONGODB_URI for dropping test database.');
    process.exit(1);
}

// Drop database
mongoose.connect(mongoURI).catch(function (err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
});
mongoose.connection.dropDatabase().then(async function () {
    let User = require('../models/user');
    let user = new User({
        username: 'testAdmin'
    });

    await user.setPassword('admin');
    await user.save();
    await User.updateOne({ username: 'testAdmin' }, { $set: { isAdmin: true } });

    console.log(`Dropped database: ${mongoURI}`);
    process.exit(0);
});
