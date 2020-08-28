import {ADD_MESSAGE, DEL_ALL_MESSAGE, ADD_INIT_MESSAGES, UPDATE_MSG_READ_COUNTER} from '../actions/types';
import _ from 'lodash';

const initialState = [{
    otherUserId: null,
    profilePicName: null,
    msgReadCounter: 0,
    totalMsgReceived: 0,
    messages: []
}];

export default function(state = initialState, action){
    
    switch(action.type){
        case ADD_INIT_MESSAGES:
            if(action.payload === undefined){
                return state;
            } 
            let initMsgs = _.map(action.payload.otherUserIds, otherUserId => {
                let receivedCounter = 0;
                return {
                    otherUserId: otherUserId.otherUserId,
                    msgReadCounter: otherUserId.msgReadCounter,
                    profilePicName: otherUserId.profilePicName,
                    messages: _.map(otherUserId.messages, message => {
                        if(otherUserId.otherUserId === message.sentBy){
                            receivedCounter = receivedCounter + 1;
                        }
                        let mesg = {
                            sentBy: message.sentBy,
                            msg: message.msg,
                            date: message.date
                        }
                        return mesg;
                    }),
                    totalMsgReceived: receivedCounter
                }
            });
            console.log(action.payload.otherUserIds);
            return [...state, ...initMsgs];

        case ADD_MESSAGE:
            const isAlreadyChatted = state.find((otherUser) => {return otherUser.otherUserId === action.payload.otherUserId});
            if(isAlreadyChatted === undefined){

                const msg = {
                    sentBy: action.payload.sentBy,
                    msg: action.payload.msg,
                    date: action.payload.date
                };

                const counter = action.payload.sentBy === action.payload.selectedChatUserId ? 1 : 0;

                const msgReceivedCounter = action.payload.sentBy === action.payload.otherUserId ? 1 : 0;
                const newOtherUser = [...state];
                newOtherUser.push({otherUserId: action.payload.otherUserId, msgReadCounter: counter, totalMsgReceived: msgReceivedCounter, profilePicName: action.payload.profilePicName, messages: [msg]});
                return newOtherUser;

            }
            const UpdatedMessage = _.map(state, userMsg => {
                if(userMsg.otherUserId === action.payload.otherUserId){

                    const counter = action.payload.sentBy === action.payload.selectedChatUserId ? userMsg.msgReadCounter+1 : userMsg.msgReadCounter;
                    const msg = {
                        sentBy: action.payload.sentBy,
                        msg: action.payload.msg,
                        date: action.payload.date
                    }

                    const msgReceivedCounter = action.payload.sentBy === action.payload.otherUserId ? userMsg.totalMsgReceived + 1 : userMsg.totalMsgReceived;
                    const UpdatedMsg = [...userMsg.messages];
                    UpdatedMsg.push(msg);
                    return {...userMsg, msgReadCounter: counter, totalMsgReceived: msgReceivedCounter, messages: UpdatedMsg};
                }
                return userMsg;
            });

            return UpdatedMessage;

        case UPDATE_MSG_READ_COUNTER:
            const isUserAlreadyChatted = state.find((otherUser) => {return otherUser.otherUserId === action.payload.otherUserId});
            if(isUserAlreadyChatted !== undefined){
                let count = 0;
                state.forEach(otheruser => {
                    if(otheruser.otherUserId === action.payload.otherUserId){
                        otheruser.messages.forEach(mesg => {
                            if(mesg.sentBy === action.payload.otherUserId){
                                count = count + 1;
                            }
                        });
                    }
                });

                const UpdatedMessage = _.map(state, userMsg => {
                    if(userMsg.otherUserId === action.payload.otherUserId){
                        return {...userMsg, msgReadCounter: count};
                    }
                    return userMsg;
                });
    
                return UpdatedMessage;
        }
        
        return state;

        case DEL_ALL_MESSAGE: 
                return [{
                    profilePicName: null,
                    otherUserId: null,
                    msgReadCounter: 0,
                    totalMsgReceived: 0,
                    messages: []
                }];

        default: 
         return state;
    }
}

