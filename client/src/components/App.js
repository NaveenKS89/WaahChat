import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Header from './Header';
import {store} from '../index';
import { loadUser, logout } from '../actions/authActions';
import RegisterUser from '../RegisterLogin/RegisterUser';
import Landing from './Landing';
import LoginForm from '../RegisterLogin/LoginForm';
import ChatRoom from './Chatroom';
import {connect} from 'react-redux'


class App extends React.Component {
    state = { width: window.innerWidth, height: window.innerHeight};

    componentDidMount(){
        this.updateWindowDimensions();
            window.addEventListener("resize", this.updateWindowDimensions);

        store.dispatch(loadUser());
        if(this.props.isAuthenticated){
            this.props.history.push('/chatroom');
        }
    }

    componentWillUnmount(){
        window.removeEventListener("resize", this.updateWindowDimensions);
        store.dispatch(logout(this.props.socketId));
    }

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    render(){
    return (
        <div style={{minWidth: '381px', height: `${this.state.height}px`}}>
            <BrowserRouter>
                    <div style={{height: `${this.state.height}px`}}>
                        <Header />
                        <Route path="/" exact component={Landing}/>
                        <Route path="/login" exact component={LoginForm} />
                        <Route path="/register" exact component={RegisterUser} />
                        <Route path="/chatroom" exact component={ChatRoom} />
                    </div>
            </BrowserRouter>
        </div>
    );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    socketId: state.socketId.socketId
});

export default connect(mapStateToProps)(App);