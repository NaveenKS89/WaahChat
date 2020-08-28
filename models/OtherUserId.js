const mongoose = require('mongoose');
const Message = require('./Message');

const OtherUserId = new mongoose.Schema({
    otherUserId: {
        type: String,
        min: 6,
        max: 255,
        required: true,
    },
    profilePicName: {
        type: String,
        max: 255,
        required: true,
    },
    msgReadCounter: {
        type: Number,
        required: false,
        default: 0
    },
    messages: [Message],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = OtherUserId;