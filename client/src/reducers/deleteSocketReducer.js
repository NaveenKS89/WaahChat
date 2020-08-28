import {DELETE_SOCKET_ID, ADD_SOCKET_ID} from '../actions/types';

export default function(state = { socketId: null }, action){
    switch(action.type){
        case DELETE_SOCKET_ID:
            return {
                ...state,
                socketId: null
            };
        case ADD_SOCKET_ID:
            return {
                ...state,
                socketId: action.payload
            };
        default: 
         return state;
    }
}