import {USER_SELECTED_TO_CHAT, DEL_USER_SELECTED_TO_CHAT} from '../actions/types';
//import {} from '../actions/chatActions';

const initialState = {
    userSelectedToChat: null
};

export default function(state = initialState, action){
    
    switch(action.type){
        case USER_SELECTED_TO_CHAT:
            
            return {
                ...state,
                userSelectedToChat: action.payload,
            };
        case DEL_USER_SELECTED_TO_CHAT: 
            return {
                ...state,
                userSelectedToChat: null,
            }
        default: 
         return state;
    }
}

