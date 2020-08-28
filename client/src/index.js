import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';


import App from './components/App';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(reducers, {}, composeEnhancers(applyMiddleware(thunk)));

document.querySelector('#root').style.height = window.innerHeight;

ReactDOM.render(
<Provider store={store}>
    <App /> 
</Provider>,
document.querySelector('#root')
);