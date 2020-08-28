import axios from 'axios';
import {USER_SELECTED_TO_CHAT, ADD_MESSAGE, DEL_ALL_MESSAGE, DEL_USER_SELECTED_TO_CHAT, ADD_INIT_MESSAGES, UPDATE_MSG_READ_COUNTER} from './types';
import {tokenConfig} from './authActions';

export const userSelectedToChat = (user) => async (dispatch) => {

    /*
    console.log(getState().auth.user.userId);
    const body = {
        otherUserId: user.userId, //The userID of other chat user to fetch the chat messages of.
        userId: getState().auth.user.userId,
    };
    */

    dispatch({type: USER_SELECTED_TO_CHAT, payload: user});

    /*
    try{
    const chatDetails = await axios.post('/api/chat/fetch_chat', body, tokenConfig(getState));

        if(chatDetails === null){
            console.log("There are no messages with this user");
            return dispatch({type: USER_SELECTED_TO_CHAT, payload: finalchatDetails});
        }
        if(chatDetails) {
            finalchatDetails = {
                selectedUser: user,
                messages: chatDetails.data
            }
            dispatch({type: USER_SELECTED_TO_CHAT, payload: finalchatDetails});
        }
    } catch(err){
        if(err){
            console.log("Unable to fetch chat details for user: ", user.userId);
            dispatch({type: USER_SELECTED_TO_CHAT, payload: finalchatDetails});
        }
    } 
    */
};

export const delUserSelectedToChat = () => (dispatch) => {
    return dispatch({type: DEL_USER_SELECTED_TO_CHAT});
};


export const addMessage = (message) => async (dispatch, getState) => {

    if(!message ){
        return console.log("userId or otherUserId or msg or date is not present");
    }

    const allChat = getState().allChats;
    const selectedChatUserId = getState().selectedUserChat.userSelectedToChat !== null ?  getState().selectedUserChat.userSelectedToChat.userId : null;

    const isAlreadyChatted = allChat.find((otherUser) => {return otherUser.otherUserId === message.otherUserId});
            console.log(message.otherUserId);
            console.log(isAlreadyChatted);
            if(isAlreadyChatted === undefined){
                const body = {
                    userId: message.otherUserId
                };
                console.log(body);
                const picName = await axios.post('/api/user/fetch_pic_name', body, tokenConfig(getState));
                console.log(picName.data);
                return dispatch({type: ADD_MESSAGE, payload: {...message, selectedChatUserId: selectedChatUserId, profilePicName: picName.data}});
            }
    dispatch({type: ADD_MESSAGE, payload: {...message, selectedChatUserId: selectedChatUserId}});

};

export const deleteAllMessage = () => (dispatch, getState) => {

    dispatch({type: DEL_ALL_MESSAGE});

};

export const addInitialMessage = (initMessages) => dispatch => {
    dispatch({type: ADD_INIT_MESSAGES, payload: initMessages});
};

export const updateMsgReadCounter = (otherUserId) => dispatch => {
    dispatch({type: UPDATE_MSG_READ_COUNTER, payload: otherUserId});
};