import { ADD_INITIAL_ONLINE_USERS, DEL_CURRENT_USERS, ADD_NEW_ONLINE_USER_TO_LIST, DEL_ONLINE_USER_FROM_LIST } from '../actions/types';
import _ from 'lodash';

export default function(state = { users: null }, action){
    switch(action.type){
        case ADD_INITIAL_ONLINE_USERS:
            return {
                ...state,
                users: action.payload
            };

        case ADD_NEW_ONLINE_USER_TO_LIST:
            const SocketIdExists = _.find(state.users, (user) => {
                return (user.socketId === action.payload.socketId && user.userId === action.payload.userId);
            });

            if(SocketIdExists){
                return state;
            }
            const userExists = _.find(state.users, (user) => {
                return user.userId === action.payload.userId;
            });

            if(!userExists){
                return {
                    ...state,
                    users: [...state.users, action.payload]
                };
            }

            const userArray = _.filter(state.users, (user) => {
                return user.socketId !== action.payload.socketId;
            });

            return {
                ...state,
                users: [...userArray, action.payload]
            };

        case DEL_ONLINE_USER_FROM_LIST: 

            const userDeletedArray = _.filter(state.users, (user) => {
                return user.socketId !== action.payload;
            });

            return {
                ...state,
                users: userDeletedArray
            };

        case DEL_CURRENT_USERS:
            return {
                ...state,
                users: null
            }
        default:
         return state;
    }
}