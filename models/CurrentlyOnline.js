const mongoose = require('mongoose');

const UsersCurrentlyOnline = new mongoose.Schema({
    userId: {
        type: String,
        min: 6,
        max: 255,
        required: true,
    },
    email: {
        type: String,
        min: 6,
        max: 255,
        required: true,
    },
    socketId: {
        type: String,
        max: 255,
        required: true
    },
    lastOnline: {
        type: Date,
        default: Date.now
    },
    profilePicName: {
        type: String,
        max: 255,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('users_currently_online', UsersCurrentlyOnline);