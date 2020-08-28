const mongoose = require('mongoose');
const OtherUserId = require('./OtherUserId');

const AllChats = new mongoose.Schema({
    userId: {
        type: String,
        min: 6,
        max: 255,
        required: true,
    },
    otherUserIds: [OtherUserId],
    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('allChats', AllChats);