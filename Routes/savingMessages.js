const AllChats = require('../models/AllChats');
const AllUsers = require('../models/User');

async function addMessageUserId(message){

    const {otherUserId, userId, sentBy, msg, date} = message;

    const senderExists = await AllChats.findOne({userId: otherUserId});
    const receiverExists = await AllChats.findOne({userId: otherUserId, "otherUserIds.otherUserId": userId }, {"otherUserIds.otherUserId": 1} );
    const profilePicUser = await AllUsers.findOne({userId: userId});

    if(senderExists === null){
        const insertsenderMsg = {
            userId: otherUserId,
            date: date,
            otherUserIds: {otherUserId: userId, profilePicName: profilePicUser.profilePicName, date: date, messages: {msg: msg, sentBy: sentBy, date: date}}
        };
        
        try{
        const response = await AllChats.insertMany(insertsenderMsg);
        console.log(response);
            return true;
        } catch(err) {
            console.log(err);
            return false;
        }
    }

    if(receiverExists === null){
        const insertMsg = {
            otherUserId: userId,
            profilePicName: profilePicUser.profilePicName,
            date: date,
            messages: [{msg: msg, sentBy: sentBy, date: date}]
        };

        try{
            await AllChats.findOneAndUpdate({userId: otherUserId}, {$push: {"otherUserIds": insertMsg}});
            return true;
        } catch(err){
            console.log(err);
            return false;
        }
    }

    console.log("userId does exist");
    const Msg = {
        msg: msg, 
        sentBy: sentBy, 
        date: date
    }

    try{
        await AllChats.findOneAndUpdate({userId: otherUserId, "otherUserIds.otherUserId": userId }, { $push: {"otherUserIds.$.messages": Msg}, $inc : {"otherUserIds.$.msgReadCounter": 1}} );
        return true;
    } catch(err){
        console.log(err);
        return false;
    }
}

async function addMessageOtherUserId(message){

    const {otherUserId, userId, sentBy, msg, date} = message;

    const receiverExists = await AllChats.findOne({userId: otherUserId});
    const senderExists = await AllChats.findOne({userId: otherUserId, "otherUserIds.otherUserId": userId }, {"otherUserIds.otherUserId": 1} );
    const profilePicUser = await AllUsers.findOne({userId: userId});

    console.log(receiverExists);
    console.log(senderExists);

    if(receiverExists === null){
        const insertsenderMsg = {
            userId: otherUserId,
            date: date,
            otherUserIds: {otherUserId: userId, profilePicName: profilePicUser.profilePicName, date: date, messages: {msg: msg, sentBy: sentBy, date: date}}
        };
        
        console.log(insertsenderMsg);

        try{
        const response = await AllChats.insertMany(insertsenderMsg);
        console.log(response);
            return true;
        } catch(err) {
            console.log(err);
            return false;
        }
    }

    if(senderExists === null){
        const insertMsg = {
            otherUserId: userId,
            profilePicName: profilePicUser.profilePicName,
            date: date,
            messages: [{msg: msg, sentBy: sentBy, date: date}]
        };

        try{
            await AllChats.findOneAndUpdate({userId: otherUserId}, {$push: {"otherUserIds": insertMsg}});
            return true;
        } catch(err){
            console.log(err);
            return false;
        }
    }

    console.log("userId does exist");
    const Msg = {
        msg: msg, 
        sentBy: sentBy, 
        date: date
    }

    try{
        await AllChats.findOneAndUpdate({userId: otherUserId, "otherUserIds.otherUserId": userId }, { $push: {"otherUserIds.$.messages": Msg}} );
        return true;
    } catch(err){
        console.log(err);
        return false;
    }

}

async function updateMsgReadCounter(details){
    if(!details.userId || !details.otherUserId){
        return;
    }

    try{
        /*
        const updatedCount = await AllChats.aggregate(
            [
                {
                    $match: {
                        userId: details.userId,
                        "otherUserIds.otherUserId": details.otherUserId,
                        "messages.sentBy": details.otherUserId
                    }
                },
                    {
                        $set: { $count: "otherUserIds.$.msgReadCounter"}
                    }
            ]
        );
        */
        let counter = await AllChats.aggregate([
            {$match: {userId: details.userId}},
            {$unwind: "$otherUserIds"},
            {$match: {"otherUserIds.otherUserId": details.otherUserId}},
            {$unwind: "$otherUserIds.messages"},
            {$match: {"otherUserIds.messages.sentBy": details.otherUserId}},
            {$count: "counter"}
        ]);

        console.log(counter[0]);
        if(counter[0] !== undefined){
        await AllChats.findOneAndUpdate(
            {userId: details.userId}, 
            {$set: {"otherUserIds.$[elem].msgReadCounter": counter[0].counter}},
            {arrayFilters: [{"elem.otherUserId": details.otherUserId}]}
            );
            console.log("Updated message read counter");
        }
    } catch(err){

        console.log(err);
    }
}

module.exports = {addMessageUserId, addMessageOtherUserId, updateMsgReadCounter};