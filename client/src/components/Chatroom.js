import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import CurrentUsers from './CurrentUsers';
import io from "socket.io-client";
import {deleteSocketId, addSocketId} from '../actions/deleteSocket';
import ChatScreen from './ChatScreen';
import {addMessage, deleteAllMessage, addInitialMessage} from '../actions/chatActions';
import {addInitialOnlineUserList, delFetchedUsers, addNewOnlineUserToList, delOnlineUserfromList} from '../actions/onlineUsers';
import {delUserSelectedToChat} from '../actions/chatActions';

let socketLink;

if(process.env.NODE_ENV === 'production'){
    //we are in production - return prod set of keys
    socketLink = 'https://agile-plateau-29900.herokuapp.com';
}
else{
    //we are in development - return dev set of keys
    socketLink = 'http://localhost:5000';
}

class ChatRoom extends React.Component {

    state = { width: window.innerWidth, height: window.innerHeight, socket: undefined };

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    componentDidMount(){
        
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);

        if(!this.props.isAuthenticated){
            this.props.history.push('/login');
        }

        if(this.props.isAuthenticated){

                let tempSocket = io(`${socketLink}`, {
                    query: {
                      token: this.props.token,
                      email: this.props.user ? this.props.user.email: null,
                      userId: this.props.user? this.props.user.userId: null,
                    }
                  })

                this.setState({socket: tempSocket});
                
                tempSocket.on('connect', async () => {
                    this.props.addSocketId(tempSocket.id);
                });

                tempSocket.on('INITIAL_SAVED_CHATS', initialSavedChats => {
                    console.log("the initial user chat: ", initialSavedChats);
                    this.props.addInitialMessage(initialSavedChats);
                });

                tempSocket.on('INITIAL_ONLINE_USER_LIST', (initialOnlineUserList) => {
                    console.log("the updated user list at client side: ", initialOnlineUserList);
                    this.props.addInitialOnlineUserList(initialOnlineUserList)
                });

                tempSocket.on('ADD_NEW_ONLINE_USER', (addNewOnlineUser) => {
                    console.log("the new user to add online: ", addNewOnlineUser);
                    this.props.addNewOnlineUserToList(...addNewOnlineUser)
                });

                tempSocket.on('DEL_ONLINE_USER', (delNewOnlineUser) => {
                    console.log("deleting online user: ", delNewOnlineUser);
                    this.props.delOnlineUserfromList(delNewOnlineUser)
                });

                tempSocket.on('PRIVATE_MSG', (msg) => {
                    this.props.addMessage(msg);
                });

                tempSocket.on('connect_error', error => {
                    console.log(error);
                });

                tempSocket.on('connect_timeout', timeout => {
                    console.log(timeout);
                });

                tempSocket.on('reconnect', attemptNumber => {
                    console.log(attemptNumber);
                });

                tempSocket.on('reconnect_attempt', (attemptNumber) => {
                    console.log(attemptNumber);
                });

                tempSocket.on('reconnecting', (attemptNumber) => {
                    console.log(attemptNumber);
                });

                tempSocket.on('error', (error) => {
                    console.log(error);
                });

                tempSocket.on('reconnect_error', (error) => {
                    console.log(error);
                });

                tempSocket.on('reconnect_failed', () => {
                    console.log("reconnection failed after max attempt");
                });

                tempSocket.on('disconnect', () => {
                    this.props.deleteSocketId(tempSocket.id);
                    this.setState({socket: undefined});

                });
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
        if(this.state.socket !== null && this.state.socket !== undefined){
        this.state.socket.disconnect();
        }
        this.setState({socket: undefined});
        this.props.deleteAllMessage();
        this.props.delUserSelectedToChat();
        this.props.delFetchedUsers();
    }

    componentDidUpdate(prevProps){
        if(!this.props.isAuthenticated){
            window.removeEventListener("resize", this.updateWindowDimensions);
            if(this.state.socket !== null && this.state.socket !== undefined){
            this.state.socket.disconnect();
            }
            this.setState({socket: undefined});
            this.props.delUserSelectedToChat();
            this.props.history.push('/login');
        }
    }

    render(){
        return (
            <div className="row" style={{height: `${this.state.width > 600 ? this.state.height-64: this.state.height-56}px`, marginBottom: "0px" }}>
                {
                this.state.width > 600 ?
                <div className="col s12 m6 l6" style={{height: `${this.state.width > 600?this.state.height*0.8 :this.state.height-56}px`, marginTop: `${this.state.width>600?this.state.height*0.03 : 0}px`, marginBottom: `${this.state.width>600?this.state.height*0.03 : 0}px`, padding: `${this.state.width>600?10 : 0}px`}}>
                        <CurrentUsers />
                </div>
                :
                this.props.selectedUser !== null ?
                null
                :
                <div className="col s12 m6 l6" style={{height: `${this.state.width > 600?this.state.height*0.8 :this.state.height-56}px`, marginTop: `${this.state.width>600?this.state.height*0.03 : 0}px`, marginBottom: `${this.state.width>600?this.state.height*0.03 : 0}px`, padding: `${this.state.width>600?10 : 0}px`}}>
                        <CurrentUsers />
                </div>
                }
                {
                this.state.width > 600 ?
                <div className="col s12 m6 l6" style={{height: `${this.state.width > 600?this.state.height*0.8 :this.state.height-56}px`, marginTop: `${this.state.width>600?this.state.height*0.03 : 0}px`, marginBottom: `${this.state.width>600?this.state.height*0.03 : 0}px`, padding: `${this.state.width>600?10 : 0}px`}}>
                        <ChatScreen socket={this.state.socket}/>
                </div>
                :
                this.props.selectedUser !== null ?
                <div className="col s12 m6 l6" style={{height: `${this.state.width > 600?this.state.height*0.8 :this.state.height-56}px`, marginTop: `${this.state.width>600?this.state.height*0.03 : 0}px`, marginBottom: `${this.state.width>600?this.state.height*0.03 : 0}px`, padding: `${this.state.width>600?10 : 0}px`}}>
                        <ChatScreen socket={this.state.socket}/>
                </div>
                :
                null
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    token: state.auth.token,
    user: state.auth.user,
    error: state.error,
    socketId: state.socketId.socketId,
    selectedUser: state.selectedUserChat.userSelectedToChat,
});

export default connect(mapStateToProps, {deleteSocketId, addSocketId, addMessage, deleteAllMessage, delFetchedUsers, delUserSelectedToChat, addInitialMessage, addNewOnlineUserToList, delOnlineUserfromList, addInitialOnlineUserList})(withRouter(ChatRoom));