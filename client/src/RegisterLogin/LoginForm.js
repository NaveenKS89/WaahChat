//SurveyForm shows a form for a user to add input
import React from 'react';
import { reduxForm, Field }  from 'redux-form';
import inputField from './inputField';
import _ from 'lodash';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
//import {register} from '../actions/authActions';
import { withRouter } from 'react-router-dom';

const FIELDS = [
    {label: 'Email', name: 'email'},
    {label: 'password', name: 'password'}
];



class LoginForm extends React.Component{

    state = {
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

    onLoginSubmit = e => {

        console.log('reached OnLoginSubmit');
        const {email, password} = this.state;

        //Create user Object
        const login = {
            email,
            password
        };

        //this.props.register(newUser, this.props.history); //need to update
    };

    onChange = e => {
        this.setState({ [e.target.name] : [e.target.value] });
    };

    render(){
        return(
            <div className="container center-align">
                <div className="card">
                <h4 style={{paddingTop: "10px"}}>Login to account</h4>
                <form className="container" onSubmit={this.props.handleSubmit((e) => this.onLoginSubmit(e))}>
                    {this.renderFields()}
                    <input type="submit" name="submit" value="Login" className="btn-flat white-text" style={{background: `linear-gradient(to right, rgb(255, 128, 0) , rgb(255, 117, 140))`}} />
                </form>
                <div style={{padding: "20px"}}><p className="black-text" style={{padding: "5px"}}>Or</p>
                <Link to="/register" className="btn-flat white-text" style={{background: `linear-gradient(to right, rgb(255, 128, 0) , rgb(255, 117, 140))`}}>
                    Sign up
                </Link>
                </div>
                </div>
            </div>
        )
    }
}

function validate(values){
    const errors = {};

    //errors.recipients = validateEmails(values.recipients || '');
 
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
    form: 'loginForm',
})(connect(mapStateToProps, {})(withRouter(LoginForm)));