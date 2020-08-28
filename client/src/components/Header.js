import React from "react";
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {logout} from '../actions/authActions';


class Header extends React.Component {

    renderContent(){
        if(this.props.isAuthenticated){
            return (
                <button  onClick={() =>this.props.logout(this.props.socketId)} className="waves-effect btn" style={{background: `linear-gradient(to right, rgb(255, 128, 0) , rgb(255, 117, 140))`, marginRight: '5px'}}>
                        Logout
                </button>
            );
        }

            return [
                <li key={1}>
                    <Link to="/login" className="waves-effect btn" style={{background: `linear-gradient(to right, rgb(255, 128, 0) , rgb(255, 117, 140))`}}>
                        Login
                    </Link>
                </li>,
                <li key={2}>
                    <Link to="/register" className="waves-effect btn" style={{background: `linear-gradient(to right, rgb(255, 128, 0) , rgb(255, 117, 140))`}}>
                        Sign up
                    </Link>
                </li>
                ];

    }

    render(){
        return(
            <div>
                <nav>
                    <div className="nav-wrapper white">
                        <Link to="/" style={{paddingLeft: "5px", fontSize: "30px", color: "black"}}>
                            WaahChat
                        </Link>
                        <ul className="right ">
                            {this.renderContent()}
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}


function mapStateToProps(state){
    return {
        isAuthenticated: state.auth.isAuthenticated,
        socketId: state.socketId.socketId
    };
}

export default connect(mapStateToProps, {logout})(Header);