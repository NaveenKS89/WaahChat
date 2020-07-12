//SurveyForm shows a form for a user to add input
import React from 'react';
import { reduxForm, Field }  from 'redux-form';
import inputField from './inputField';
import _ from 'lodash';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {register} from '../actions/authActions';
import { withRouter } from 'react-router-dom';
import {clearErrors} from '../actions/errorActions';

const FIELDS = [
    {label: 'Username', name: 'userId'},
    {label: 'Email', name: 'email'},
    {label: 'password', name: 'password'},
];



class RegisterUser extends React.Component{

    state = {
        userId: '',
        email: '',
        password: '',
        msg: null
    }

    renderFields(){
            return _.map(FIELDS, (field)=> {
                const {label, name} = field;

                if( name === 'password') {
                    return <Field component={inputField} onChange={this.onChange} key={name} label={label} name = {name} type="password" />
                }
                return <Field component={inputField} onChange={this.onChange} key={name} label={label} name = {name} type="text" />
            });
    };

    componentDidUpdate(prevProps){
        const {error} = this.props;

        if(error !== prevProps.error ){
            //check for register error
            if(error.id === "REGISTER_FAIL"){
                this.setState({msg: error.msg})
            } else{
                this.setState({msg: null});
            }
        }

        if(this.props.isAuthenticated){
            this.props.clearErrors();
        }
    }

    renderError(){
        if(!this.state.msg){
            return null;
        }

        return (
            <div className="red-text" style={{padding: "5px"}}>
                {this.state.msg}
            </div>
        )
    }

    onRegisterSubmit = e => {

        console.log('reached OnRegisterSubmit');
        const {userId, email, password} = this.state;

        //Create user Object
        const newUser = {
            userId,
            email,
            password
        };

        this.props.register(newUser, this.props.history);
    };

    onChange = e => {
        this.setState({ [e.target.name] : [e.target.value] });
    };

    render(){
        return(
            <div className="container center-align">
                <div className="card">
                    <h4 style={{paddingTop: "10px"}}>Sign up</h4>
                    <form className="container" onSubmit={this.props.handleSubmit((e) => this.onRegisterSubmit(e))}>
                        {this.renderFields()}
                        {this.renderError()}
                        <input type="submit" name="submit" value="Sign up" className="btn-flat white-text" style={{background: `linear-gradient(to right, rgb(255, 128, 0) , rgb(255, 117, 140))`}} />
                    </form>
                    <div style={{padding: "20px"}}><p className="black-text" style={{padding: "5px"}}>Or</p>
                    <Link to="/login" className="btn-flat white-text" style={{background: `linear-gradient(to right, rgb(255, 128, 0) , rgb(255, 117, 140))`}}>
                        Login
                    </Link>
                    </div>
                </div>
            </div>
        )
    }
}

function validate(values){
    const errors = {};
 
    _.each(FIELDS, ({name}) =>{
        if(!values[name]){
            errors[name] = `${name} is a required field`;
        }
    });

    return errors;
} 

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});

export default reduxForm({
    validate: validate,
    form: 'registerForm',
})(connect(mapStateToProps, {register, clearErrors})(withRouter(RegisterUser)));