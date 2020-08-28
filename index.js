const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const currentOnlineUsersRoutes = require('./Routes/OnlineUserRoutes');
const cors = require('cors');
const getChatDetails = require('./Routes/getChatDetails');
const UsersCurrentlyOnline = require('./models/CurrentlyOnline');
const addMessage = require('./Routes/savingMessages');
const AllChats = require('./models/AllChats');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());
//Import authRoute for login Routes
const authRoute = require('./Routes/authRoutes');
const auth = require('./middlewares/auth');

dotenv.config();

//Connect to MongoDB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to DB!');
});

//Middlewares
app.use('/api/user', authRoute);
//app.use('/chat/onlineusers', currentOnlineUsersRoutes);
require('./Routes/getProfilePicRoutes')(app);
app.use('/api/chat', auth, getChatDetails);

if(process.env.NODE_ENV === 'production'){

    const path = require('path');
    //To serve files like main.js and main.css in production environment
    app.use(express.static(path.resolve(__dirname,'client/build')));
  
    //TO serve files that express doesn't recongnize any routes
    
    app.get('*', (req, res)=>{
      res.sendFile(path.resolve(__dirname, 'client','build', 'index.html'));
    });
  }

io.on('connection', async socket => {
    console.log("socket connected with Socket ID: ", socket.id);

    let success = await currentOnlineUsersRoutes.addNewOnlineUser(socket.handshake.query, socket.id)

    if(success !== null){
    let onlineUsers, allChat;

    allChat = await AllChats.find({userId: socket.handshake.query.userId});

    if(allChat !== undefined){
        console.log("All saved chat on db for user ", socket.handshake.query.userId, " is: ", allChat);
        io.to(socket.id).emit('INITIAL_SAVED_CHATS', ...allChat);
    }

    try{
        onlineUsers = await UsersCurrentlyOnline.find({},{date: 0});
            console.log("Successfully fetched updated online users post new user logged in",onlineUsers);
        } catch(e){
            console.log("Failed to get updated current online users after a new user logged in");
    }
    
    io.to(socket.id).emit('INITIAL_ONLINE_USER_LIST', onlineUsers);

    try{
        onlineUser = await UsersCurrentlyOnline.find({socketId: socket.id},{date: 0});
            console.log("Successfully fetched updated online user post new user logged in", onlineUser);
        } catch(e){
            console.log("Failed to get updated current online user after a new user logged in");
    }

    io.emit('ADD_NEW_ONLINE_USER', onlineUser);
    }

    socket.on('PRIVATE_MSG', (socketId, msg) => {
        socket.to(socketId).emit('PRIVATE_MSG', msg);
        addMessage.addMessageUserId(msg);
        console.log(msg);
        let flipMsg = msg;
        let {otherUserId, userId} = msg;
        flipMsg.otherUserId = userId;
        flipMsg.userId = otherUserId;
        console.log("flipped users detail: ", flipMsg);
        addMessage.addMessageOtherUserId(flipMsg);
    });

    socket.on('UPDATE_MSG_READ_COUNTER', details => {
        addMessage.updateMsgReadCounter(details);
    });

    socket.on('disconnect', async reason => {
            console.log("socket disconnected with socket ID: ", socket.id);
            console.log("reason for disconnection: ", reason);
            let success = await currentOnlineUsersRoutes.deleteOnlineUser(socket.id);
            if(success) {
                
                console.log("successfully deleted online user on DB");

                io.emit('DEL_ONLINE_USER', socket.id);

            } else {
                console.log("failed to delete online user on DB");
            }
        });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Server up and running'));