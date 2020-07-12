import {combineReducers} from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import {reducer as reduxForm} from 'redux-form';


export default combineReducers({
    auth: authReducer,
    error: errorReducer,
    form: reduxForm
});