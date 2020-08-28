//const router = require('express').Router();
const UsersCurrentlyOnline = require('../models/CurrentlyOnline');
//const auth = require('../middlewares/auth');
const User = require('../models/User');

async function addNewOnlineUser(query, socketId){

    const {token, userId, email} = query;
    let onlineUser;
    const user = await User.findOne({email: email}, {password: 0});

    try{
        onlineUser = await UsersCurrentlyOnline.findOneAndUpdate(
        {email: email}, 
        {
            $set: {
                socketId: socketId
            } 
        },
        {
            returnNewDocument: true,
            useFindAndModify: false
        }
        );
        
    } catch(e){
        console.log("failed to update new online user in DB", e);
        return null;
    }

    if(onlineUser){
        return onlineUser;
    }

    const newOnlineUser = new UsersCurrentlyOnline({
        userId: user.userId,
        email: user.email,
        socketId: socketId,
        profilePicName: user.profilePicName
    });

    //Save the created user to MongoDB

    try{
        const savedNewOnlineUser = await newOnlineUser.save();
        return savedNewOnlineUser;
    } catch(e){
        console.log("unable to save the new online user on DB: ", e);
        return null;
    }
}

/*
router.post('/add_new_online_user', auth, async (req, res) => {

    const {email, socketId} = req.body;
    console.log(req.body);
    let onlineUser;
    if(!email || !socketId){
        return res.status(400).send("currentUser is a required parameter");
    }
    const user = await User.findOne({email: email}, {password: 0});

    if(user === null){
        return res.status(400).send('Please register first to fetch details');
    } else if(user){

    try{
        onlineUser = await UsersCurrentlyOnline.findOneAndUpdate(
        {email: email}, 
        {
            $set: {
                socketId: socketId
            } 
        },
        {
            returnNewDocument: true,
            useFindAndModify: false
        }
        );
        
    } catch(e){
        console.log("failed to update new online user in DB", e);
        return res.status(400).send('Failed to update new online user in DB: ');
    }
}

if(onlineUser){
    return res.status(200).send(onlineUser);
}

const newOnlineUser = new UsersCurrentlyOnline({
    userId: user.userId,
    email: user.email,
    socketId: socketId,
    profilePicName: user.profilePicName
});

//Save the created user to MongoDB

try{
    const savedNewOnlineUser = await newOnlineUser.save();
    return res.status(200).send(savedNewOnlineUser);
} catch(e){
    console.log("unable to save the new online user on DB: ", e);
    return res.status(400).send("Failed to save the new online user on DB");
}

});
*/

async function deleteOnlineUser(socketId){
    try{
        const onlineUser = await UsersCurrentlyOnline.findOneAndDelete({socketId: socketId});

        if(onlineUser){
            console.log(onlineUser);
            return true;
        }

    } catch(err){

        if(err){
            console.log(err);
        return false;
        }

    }
}


/*
router.post('/delete_online_user', auth, async (req, res) => {


    try{
        const onlineUser = await UsersCurrentlyOnline.findOneAndDelete({socketId: req.body.socketId});
        console.log(onlineUser)
        if(onlineUser){
            return res.status(200).send(onlineUser);
        }
    } catch(err){
        if(err){
        return res.status(500).send(err);
        }
    }
});


router.get('/fetch_users', auth, async (req, res) => {

    try{
    const onlineUsers = await UsersCurrentlyOnline.find({},{date: 0});
        return res.status(200).send(onlineUsers);
    } catch(e){
        return res.status(400).send('Failed to fetch current online users');
    }
});

module.exports = router;
*/

module.exports = {addNewOnlineUser, deleteOnlineUser};