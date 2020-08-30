import React from 'react';
import {connect} from 'react-redux';
import {addMessage} from '../actions/chatActions';
import _ from 'lodash';
import './CustomerScrollBar.css';

class ChatScreen extends React.Component{

    messagesEndRef = React.createRef();

    state = { width: window.innerWidth, height: window.innerHeight, textInput: null };

        componentDidMount() {
            console.log("ChatScreen Mounted");
            this.updateWindowDimensions();
            window.addEventListener("resize", this.updateWindowDimensions);

            this.scrollToBottom();

            if(this.props.selectedUser !== null && this.props.auth.user.userId !== null){
                const details = {
                    userId: this.props.auth.user.userId,
                    otherUserId: this.props.selectedUser.userId
                }
                console.log("UPDATE_MSG_READ_COUNTER was called");
                this.props.socket.emit('UPDATE_MSG_READ_COUNTER', details);
            }
        }

        componentDidUpdate(prevProps){
            this.scrollToBottom();
            if(prevProps.selectedUser && this.props.selectedUser && prevProps.selectedUser.userId !== this.props.selectedUser.userId && this.props.auth.user.userId !== null){
                        const details = {
                            userId: this.props.auth.user.userId,
                            otherUserId: prevProps.selectedUser.userId
                        }
                        this.props.socket.emit('UPDATE_MSG_READ_COUNTER', details);
                        console.log("emit Update msg read counter was called", details);
            }
        }

        componentWillUnmount() {
            console.log("ChatScreen Will UnMounted");
            window.removeEventListener("resize", this.updateWindowDimensions);

            if(this.props.selectedUser && this.props.selectedUser.userId !== null && this.props.auth.user.userId !== null && this.props.socket){
                const details = {
                    userId: this.props.auth.user.userId,
                    otherUserId: this.props.selectedUser.userId
                }
                this.props.socket.emit('UPDATE_MSG_READ_COUNTER', details);
                console.log("emit Update msg read counter was called", details);
            }
        }

        scrollToBottom = () => {    
            if(this.messagesEndRef.current){
            console.log(this.messagesEndRef.current.scrollTop);
            this.messagesEndRef.current.scrollIntoView(false);
            console.log(this.messagesEndRef.current.scrollTop);
            }
        };

        updateWindowDimensions = () => {
            this.setState({ width: window.innerWidth, height: window.innerHeight });
        };

        handleTextInputChange = (e) => {
            this.setState({textInput: e.target.value});
        }

        handleOnSubmit = e => {
            e.preventDefault();
            if(!this.props.auth.user.userId || !this.props.selectedUser){
                document.getElementById('mytextarea').value = "";
                return console.log("UserId or other User not available to save message");
            }

            const message = {
                userId: this.props.auth.user.userId,
                otherUserId: this.props.selectedUser.userId,
                sentBy: this.props.auth.user.userId,
                msg: this.state.textInput,
                date: Date.now()
            }

            const emitPrivateMsg = {
                userId: this.props.selectedUser.userId,
                otherUserId: this.props.auth.user.userId,
                sentBy: this.props.auth.user.userId,
                msg: this.state.textInput,
                date: Date.now()
            }
            
            if(document.getElementById('mytextarea')){
                document.getElementById('mytextarea').value = "";
            }
            this.props.addMessage(message);
            this.props.socket.emit('PRIVATE_MSG', this.props.selectedUser.socketId, emitPrivateMsg);
        };

        renderChatScreen(){

            if(this.props.selectedUser === null || this.props.selectedUser === undefined){
                return (
                <div className="collection hoverable" style={{borderRadius: `${this.state.width>600?5:0}px`, height: `${this.state.width>600?this.state.height*0.8:this.state.height}px`, margin: '0px', marginTop: `${this.state.width>600?0:10}px`, borderWidth: "0px"}}>
                    <div className="collection" style={{height: `${this.state.width>600?this.state.height*0.1:this.state.height*0.1}px`, margin: '0px'}}> 
                        <div className="collection-item" style={{background: `linear-gradient(to right, rgb(255, 128, 0) , rgb(255, 117, 140))`}}><h5 style={{textAlign: 'center'}}>{this.props.selectedUser?this.props.selectedUser.userId.toUpperCase():'CHAT SCREEN'}</h5></div>
                    </div>
                    <div className="collection" style={{overflow: "auto", height: `${this.state.width>600?this.state.height*0.7:this.state.height-56}px`, margin: '0px'}}>
                        <div className="collection-item">Select user to chat</div>
                    </div>
                </div>
                );
            }
            if(this.props.selectedUser && this.props.allChats.length < 2){
                return (
                    <div className="collection hoverable" style={{borderRadius: `${this.state.width>600?5:0}px`, height: `${this.state.width>600?this.state.height*0.8:this.state.height}px`, margin: '0px', marginTop: `${this.state.width>600?0:10}px`, borderWidth: "0px"}}>
                        <div className="collection" style={{height: `${this.state.width>600?this.state.height*0.1:this.state.height*0.1}px`, margin: '0px'}}> 
                            <div className="collection-item" style={{background: `linear-gradient(to right, rgb(255, 128, 0) , rgb(255, 117, 140))`}}><h5 style={{textAlign: 'center'}}>{this.props.selectedUser?this.props.selectedUser.userId.toUpperCase():'CHAT SCREEN'}</h5></div>
                        </div>
                        <div className="collection" style={{overflow: "auto", height: `${this.state.width>600?this.state.height*0.6:this.state.height-56}px`, margin: '0px'}}>
                            <div className="collection-item">Start conversation to show up here</div>
                        </div>
                        <div className="collection" style={{height: `${this.state.width>600?this.state.height*0.1:this.state.height*0.1}px`, margin: '0px'}}>
                            <div className="collection-item">    
                                <form onSubmit={this.handleOnSubmit} className="col s12" style={{padding: "0px"}}>
                                    <div className="row" style={{margin: "0px"}}>
                                        <div className="input-field col s9" style={{margin: "0px", padding: "0px"}}>
                                            <textarea id="mytextarea" required onChange={this.handleTextInputChange} placeholder="Type a message" style={{overflow: "auto", rows: "2", resize: "none", border: "1px solid grey"}}></textarea>
                                        </div>
                                        <div className="input-field col s3" style={{margin: "0px"}}>
                                            <input className="btn" style={{background: `linear-gradient(to right, rgb(255, 128, 0) , rgb(255, 117, 140))`}} type="submit" value="Send"></input>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                );
            }

            const userChat = this.props.allChats.find(chat => {
                return chat.otherUserId === this.props.selectedUser.userId;
            });
            
            let counter = 0;
            return(
                <div className="collection hoverable" style={{borderRadius: `${this.state.width>600?5:0}px`, height: `${this.state.width>600?this.state.height*0.8:this.state.height}px`, margin: '0px', marginTop: `${this.state.width>600?0:0}px`, borderWidth: "0px"}}>
                    <div className="collection" style={{height: `${this.state.width>600?this.state.height*0.1:this.state.height*0.1}px`, margin: '0px'}}> 
                        <div className="collection-item" style={{background: `linear-gradient(to right, rgb(255, 128, 0) , rgb(255, 117, 140))`}}><h5 style={{textAlign: 'center'}}>{this.props.selectedUser?this.props.selectedUser.userId.toUpperCase():'CHAT SCREEN'}</h5></div>
                    </div>
                    <div className="collection" style={{overflow: "auto", height: `${this.state.width>600?this.state.height*0.6:this.state.height*0.9-46}px`, margin: '0px'}}>
                            {userChat?
                                _.map(userChat.messages, msg => {
                                    
                                    return (
                                        <div key={counter++} className="collection-item" style={{textAlign: `${this.props.auth.user.userId === msg.sentBy?"right":"left"}`}}>{msg.msg}</div>
                                    );
                                })
                                : null
                            }
                        <div className="collection-item" style={{ float:"left", clear: "both" }}
                            ref={ this.messagesEndRef }>
                        </div>
                    </div>
                    <div className="collection" style={{height: `${this.state.width>600?this.state.height*0.1:this.state.height*0.1}px`, margin: '0px'}}>
                        <div className="collection-item">    
                            <form onSubmit={this.handleOnSubmit} className="col s12" style={{padding: "0px"}}>
                                <div className="row" style={{margin: "0px"}}>
                                    <div className="input-field col s9" style={{margin: "0px", padding: "0px"}}>
                                        <textarea autofocus id="mytextarea" required onChange={this.handleTextInputChange} placeholder="Type a message" style={{overflow: "auto", rows: "2", resize: "none", border: "1px solid grey"}}></textarea>
                                    </div>
                                    <div className="input-field col s3" style={{margin: "0px"}}>
                                        <input className="btn" style={{background: `linear-gradient(to right, rgb(255, 128, 0) , rgb(255, 117, 140))`}} type="submit" value="Send"></input>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }

    render(){
        return(
            this.renderChatScreen()
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    users: state.onlineUsers.users,
    allChats: state.allChats,
    selectedUser: state.selectedUserChat.userSelectedToChat
});

export default connect(mapStateToProps, {addMessage})(ChatScreen);