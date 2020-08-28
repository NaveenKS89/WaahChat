import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';


class Landing extends React.Component{

    componentDidMount(){
        if(this.props.isAuthenticated){
            this.props.history.push('/chatroom');
        } else {
        this.props.history.push('/login');
        }
    }

    componentDidUpdate(){
        if(this.props.isAuthenticated){
            this.props.history.push('/chatroom');
        } else{

        this.props.history.push('/login');
        }
    }

    renderContent(){
        /*
        if(!this.props.isAuthenticated){
            return (
                <LoginForm />
            )
        }
        */

        return (
            <div className="valign-wrapper center-align">
                Loading...
            </div>
        )
    }

    render(){
        return(
            <div>
                {this.renderContent()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(withRouter(Landing));