import React from "react";
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';


class Header extends React.Component {

    renderContent(){
        if(!this.props.isAuthenticated){
            return [
                    <li>
                        <Link to="/login" className="waves-effect btn" style={{background: `linear-gradient(to right, rgb(255, 128, 0) , rgb(255, 117, 140))`}}>
                            Login
                        </Link>
                    </li>,
                    <li>
                        <Link to="/register" className="waves-effect btn" style={{background: `linear-gradient(to right, rgb(255, 128, 0) , rgb(255, 117, 140))`}}>
                            Sign up
                        </Link>
                    </li>
                    ];
        }

        if(this.props.isAuthenticated){
            return (
                <li>
                    <a href="/api/user/logout" className="waves-effect btn" style={{background: `linear-gradient(to right, rgb(255, 128, 0) , rgb(255, 117, 140))`}} >Logout</a>
                </li>
            );
        }

    }


    render(){
        return(
            <div>
                <nav>
                    <div className="nav-wrapper white">
                        <a className="left" style={{paddingLeft: "5px", fontSize: "20px", color: "black"}}>WaahChat</a>
                        <ul className="right ">
                            <li></li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}


function mapStateToProps(state){
    return {
        isAuthenticated: state.auth.isAuthenticated
    };
}

export default connect(mapStateToProps)(Header);