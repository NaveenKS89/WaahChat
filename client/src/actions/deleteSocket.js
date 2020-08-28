import {DELETE_SOCKET_ID, ADD_SOCKET_ID} from './types';

//Check token and delete socketId of online user on the DB
export const deleteSocketId = (socketId) => async (dispatch, getState) => {

    dispatch({
        type: DELETE_SOCKET_ID
    });

};

export const addSocketId = (socketId) => async (dispatch, getState) => {
        dispatch({type: ADD_SOCKET_ID, payload: socketId});
};