import React from 'react';
import {connect} from 'react-redux';
import {userSelectedToChat, updateMsgReadCounter} from '../actions/chatActions';
import _ from 'lodash';

let imgLink;

if(process.env.NODE_ENV === 'production'){
    //we are in production - return prod set of keys
    imgLink = 'https://agile-plateau-29900.herokuapp.com/userprofilepic/';
}
else{
    //we are in development - return dev set of keys
    imgLink = 'http://localhost:5000/userprofilepic/';
}

class CurrentUsers extends React.Component{
    state = { width: window.innerWidth, height: window.innerHeight };

    componentDidMount(){

        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);

    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    handleClick = (e, user) => {
        e.preventDefault();
        let otherUser = {
            otherUserId: user.userId
        }
        this.props.updateMsgReadCounter(otherUser);
        this.props.userSelectedToChat(user);
    }

    handleClickAllChatUser = (e, otherUserId) => {
        e.preventDefault();
        const user = _.find(this.props.users, (user) => {
            return user.userId === otherUserId;
        });

        if(!user){

        let otherUser = {
            otherUserId: otherUserId
        }
        this.props.updateMsgReadCounter(otherUser);

            const notOnlineUser = {
                userId: otherUserId,
                socketId: null
            }
            return this.props.userSelectedToChat(notOnlineUser);
        }

        let otherUser = {
            otherUserId: user.userId
        }
        this.props.updateMsgReadCounter(otherUser);
        this.props.userSelectedToChat(user);
        
    }

    renderUsers(){
        if(this.props.users === null && this.props.allChats.length < 2 ){
            return (
                <div className="collection hoverable">
                    Loading...
                </div>
            );
        }

        if(this.props.users !== null && this.props.users.length === 1 && this.props.users[0].userId === this.props.selfUserId && this.props.allChats.length < 2){
            return (
                <div className="collection hoverable">
                    There are currently no users online
                </div>
            );
        }

        let allChatUserList = _.map(this.props.allChats, singleChat => {
            if(singleChat.otherUserId === null){
                return null;
            }
            console.log(singleChat.messages[singleChat.messages.length-1].msg);
            let str1 = singleChat.otherUserId.slice(0, 1).toUpperCase();
            let str2 = singleChat.otherUserId.slice(1);
            str1 = str1.concat(str2);

            let isOnline;
            if(this.props.users !== null){
                isOnline = this.props.users.find((user, index, array) => {
                    return user.userId === singleChat.otherUserId;
                })
            }

            let notifictionBadge = ((singleChat.totalMsgReceived - singleChat.msgReadCounter) > 0) ? <span className="new badge">{singleChat.totalMsgReceived - singleChat.msgReadCounter}</span> : null;

            return (
                <a href="!#" onClick={(e) => this.handleClickAllChatUser(e, singleChat.otherUserId)} key={singleChat.otherUserId} className={`collection-item avatar ${(this.props.selectedUser && this.props.selectedUser.userId === singleChat.otherUserId)?'active':''}`}>
                    {notifictionBadge}
                    <img src={`${imgLink}${singleChat.profilePicName}`} alt="" className="circle" />
                    <span className="title" style={{fontWeight: 'bold'}}>{str1}</span>
                    <p style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{singleChat.messages[singleChat.messages.length-1].msg}
                    <br />
                    {isOnline !== undefined? "online" : "offline"}
                    </p>
                </a>
            );
        });
        
        let OnlineUserList =  _.map(this.props.users, user => {
            if(this.props.selfUserId === user.userId){
                return null;
            }
            const alreadyDisplayed = _.find(this.props.allChats, singleChat => {
                return singleChat.otherUserId === user.userId;
            });

            if(alreadyDisplayed){
                return null;
            }

            let str1 = user.userId.slice(0, 1).toUpperCase();
            let str2 = user.userId.slice(1);
            str1 = str1.concat(str2);

            return (
                <a href="!#" onClick={(e) => this.handleClick(e, user)} key={user.userId} className={`collection-item avatar ${(this.props.selectedUser && this.props.selectedUser.userId === user.userId)?'active':''}`}>
                    <img src={`${imgLink}${user.profilePicName}`} alt="" className="circle" />
                    <span className="title" style={{fontWeight: 'bold'}}>{str1}</span>
                    <p>online</p>
                </a>
                )
            });

            return(
                <div>
                {allChatUserList}
                {OnlineUserList}
                </div>
            );
    }

    render(){
        return (
            <div className="collection hoverable" style={{overflow: "auto", borderRadius: `${this.state.width>600?5:0}px`, height: `${this.state.width>600?this.state.height*0.8:this.state.height-56}px`, margin: '0px', borderWidth: `${this.state.width>600?1:0}px`}}>
                <div className="collection-item" style={{background: `linear-gradient(to right, rgb(255, 128, 0) , rgb(255, 117, 140))`}}><h5 style={{textAlign: 'center'}}>USERS ONLINE</h5></div>
                {this.renderUsers()}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    users: state.onlineUsers.users,
    allChats: state.allChats,
    selectedUser: state.selectedUserChat.userSelectedToChat,
    selfUserId: state.auth.user?state.auth.user.userId:null
});

export default connect(mapStateToProps, {userSelectedToChat, updateMsgReadCounter})(CurrentUsers);