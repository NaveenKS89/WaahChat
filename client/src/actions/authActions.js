import axios from 'axios';
import {returnErrors, clearErrors} from './errorActions';
import {deleteSocketId} from './deleteSocket';

import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_FAIL,
    REGISTER_SUCCESS
} from '../actions/types';


//Check token and Load user
export const loadUser = () => async (dispatch, getState) => {
    dispatch({type: USER_LOADING});

    try{
    const response = await axios.get('/api/user/current_user', tokenConfig(getState));
        if(response) {
            dispatch(clearErrors());
            dispatch({type: USER_LOADED, payload: response.data});
        }
    } catch(err){
        if(err){
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({type: AUTH_ERROR, });
        }
    }
}
//Register user
export const register = ({userId, email, password, imgData}, history) => async dispatch => {
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };

    console.log(userId[0]);
    const imgConfig = {
        headers: {
            'x-userId': userId[0]
        }
    }

        try{
            const imgName = await axios.post('/api/user/upload_image', imgData, imgConfig);
            console.log(imgName.data);

                //Request body
                const body = JSON.stringify({
                userId: userId[0], 
                email: email[0], 
                password: password[0],
                profilePicName: imgName.data
                });

                try{
                    const response = await axios.post('/api/user/register', body, config);
                    alert("Register Successful!");
                    setTimeout(() => {
                    history.push('/chatroom');
                    }, 1000);
            
                    dispatch(clearErrors());
                    dispatch({
                    type: REGISTER_SUCCESS,
                    payload: response.data
                    });
            
                } catch (err){
                dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
                dispatch({
                type: REGISTER_FAIL
                });
                }
        }catch(err){
        dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
        dispatch({
        type: REGISTER_FAIL
        });
    }
}


//Login user
export const userLogin = ({email, password}, history) => async dispatch => {
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };

    //Request body
    const body = JSON.stringify({
            email: email[0], 
            password: password[0]
        });

    try{
        const response = await axios.post('/api/user/login', body, config);
        alert("Login Successful!")
        setTimeout(() => {
            history.push('/chatroom');
        }, 1000);
        dispatch(clearErrors());
        dispatch({
            type: LOGIN_SUCCESS,
            payload: response.data
        });

    } catch (err){
        dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'));
        dispatch({
            type: LOGIN_FAIL
        });
    }
}

// Logout User
export const logout = (socketId) => dispatch =>  {
    dispatch(deleteSocketId(socketId));
    dispatch({
      type: LOGOUT_SUCCESS
    });
  };


//Setup config/headers and token
export const tokenConfig = getState => {

    //Get token from localStorage
    const token = getState().auth.token;

    //Headers
    const config = {
        headers: {
            "Content_type": "application/json"
        }
    };

    if(token){
        config.headers['x-auth-token'] = token;
        
    }

    return config;
    
}

