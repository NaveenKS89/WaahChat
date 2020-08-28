import { ADD_INITIAL_ONLINE_USERS, DEL_CURRENT_USERS, ADD_NEW_ONLINE_USER_TO_LIST, DEL_ONLINE_USER_FROM_LIST, USER_SELECTED_TO_CHAT } from '../actions/types';

export const addInitialOnlineUserList = (updatedUserList) => (dispatch) => {
    dispatch({type: ADD_INITIAL_ONLINE_USERS, payload: updatedUserList});
}

export const addNewOnlineUserToList = (userToAdd) => (dispatch, getState) => {

    const selectedUser = getState().selectedUserChat.userSelectedToChat !== null ? getState().selectedUserChat.userSelectedToChat.userId: null;
    if(selectedUser !== null && selectedUser === userToAdd.userId){
        dispatch({type: USER_SELECTED_TO_CHAT, payload: userToAdd});
    }

    dispatch({type: ADD_NEW_ONLINE_USER_TO_LIST, payload: userToAdd});
}

export const delOnlineUserfromList = (userToDel) => (dispatch) => {
    dispatch({type: DEL_ONLINE_USER_FROM_LIST, payload: userToDel});
}

export const delFetchedUsers = () => (dispatch) => {

    return dispatch({type: DEL_CURRENT_USERS});

};