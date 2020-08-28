const router = require('express').Router();
const AllChats = require('../models/AllChats');
const auth = require('../middlewares/auth');

router.post('/fetch_chat', auth, async (req, res) => {

    if(!req.body.otherUserId || !req.body.userId){
        return res.status(400).send("otherUserId is a required parameter");
    }

    console.log("before calling AllChats.find");
    try{
        chatDetails = await AllChats.findOne(
        {
            userId: req.body.userId, 
            "otherUserIds.otherUserId": req.body.otherUserId
        },
        {
            "otherUserIds.$.otherUserId": 1
        }
        );
        console.log("Fetched chat details: ", chatDetails.otherUserIds[0]);
        if(!chatDetails.otherUserIds.length){
            return res.status(400).send("There is no chat details for this userId");
        }

        return res.status(200).send(chatDetails.otherUserIds[0]);

    } catch(e){
        console.log("Failed to fetch Chat Details", e);
        return res.status(400).send('Failed to fetch Chat Details');
    }
});

module.exports = router;