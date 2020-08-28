import {combineReducers} from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import onlineUsersReducer from './OnlineUsersReducer';
import {reducer as reduxForm} from 'redux-form';
import socketIdreducer from './deleteSocketReducer';
import selectedUserChatReducer  from './userSelectedToChatReducer';
import allChatReducer from './allChatReducer';


export default combineReducers({
    auth: authReducer,
    error: errorReducer,
    onlineUsers: onlineUsersReducer,
    socketId: socketIdreducer,
    selectedUserChat: selectedUserChatReducer,
    allChats: allChatReducer,
    form: reduxForm
});