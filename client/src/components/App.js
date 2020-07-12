import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Header from './Header';
import {store} from '../index';
import { loadUser } from '../actions/authActions';
import RegisterUser from '../RegisterLogin/RegisterUser';
import Landing from './Landing';
import LoginForm from '../RegisterLogin/LoginForm';


class App extends React.Component {

    componentDidMount(){
        store.dispatch(loadUser());
    }

    render(){
    return (
        <div style={{padding: "0px", border: "0px", boxSizing: "border-box"}}>
            <BrowserRouter>
                <div className="row">
                    <div className="col s12 m12 l12">
                        <Header />
                        <Route path="/" exact component={Landing}/>
                        <Route path="/login" exact component={LoginForm} />
                        <Route path="/register" exact component={RegisterUser} />
                    </div>
                </div>
            </BrowserRouter>
        </div>
    );
    }
}

export default App;