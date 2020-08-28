const mongoose = require('mongoose');

const Message = new mongoose.Schema({
    msg: {
        type: String,
        maxlength: 1024,
        required: true
    },
    sentBy: { //the userID who sent this msg, the user or the otherUser
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = Message;