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
    {label: 'Username', name: 'userId', type: 'text'},
    {label: 'Email', name: 'email', type: 'text'},
    {label: 'Password', name: 'password', type: 'text'},
    {label: 'Image', name: 'image', type: 'file'},
];


    let previewLogoUrl= "https://via.placeholder.com/200?text=Preview+pic";
    const mimeType= "image/jpeg, image/png";
    const maxWeight=1024;
    const maxWidth=1024;
    const maxHeight=1024

class RegisterUser extends React.Component{

    
    state = {
        userId: '',
        email: '',
        password: '',
        msg: null,
        selectedFile: null
    }

    componentDidMount(){
        if(this.props.isAuthenticated){
            alert("You are already registered");
            setTimeout(() => {
                this.props.history.push('/chatroom');
            }, 500);
            
            
        }
    }

    renderFields(){
            return _.map(FIELDS, (field)=> {
                const {label, name, type} = field;
                if(type === 'file'){
                    return <Field 
                            component={this.renderFileInput} 
                            validate={[this.validateImageWeight, this.validateImageFormat, this.validateImageWidth, this.validateImageHeight]} 
                            key={name} 
                            label={label} 
                            name={name}
                            accept={mimeType} />   
                }

                return <Field 
                component={inputField} 
                onChange={this.onChange} 
                key={name} 
                label={label} 
                name={name} 
                type={type} />
            });
    };

    handlePreview = imageUrl => {
        const previewImageDom = document.querySelector('#preview-image');
        previewImageDom.src = imageUrl;
      };

    renderFileInput = ({ input, label, meta }) => {
        return (
            <div>
                <div className="input-field">
                <label>Profile Image</label>
                <input
                name={input.name}
                type='file'
                onChange={event => this.handleChange(event, input)} 
                style={{marginBottom: '5px'}}
                required
                />
                { meta && meta.invalid && meta.error && meta.dirty && (
                    <div className="red-text" style={{marginBottom: '20px'}}>
                        {meta.error}
                    </div>
                )
                }
                </div>
                
                <div>
                    <img
                    src={previewLogoUrl}
                    alt="preview"
                    id='preview-image'
                    className="circle"
                    style={{ height: "200px", width: "200px", objectFit: "cover" }}
                    />
                </div>
            </div>
        );
    };

    handleChange = (event, input) => {
        event.preventDefault();
        let imageFile = event.target.files[0];
        console.log(imageFile);
        this.setState({selectedFile: imageFile});
        if (imageFile) {
            const localImageUrl = URL.createObjectURL(imageFile);
            const imageObject = new window.Image();
            imageObject.onload = () => {
                imageFile.width = imageObject.naturalWidth;
                imageFile.height = imageObject.naturalHeight;
                input.onChange(imageFile);
                URL.revokeObjectURL(imageFile);
            };
            imageObject.src = localImageUrl;
            this.handlePreview(localImageUrl);
        }
    };
    
    validateImageWeight = imageFile => {
        if (imageFile && imageFile.size) {
          // Get image size in kilobytes
          const imageFileKb = imageFile.size / (1024*1024);
          if (imageFileKb > maxWeight) {
            return `Image size must be less or equal to ${maxWeight}mb`;
          }
        }
      };
    
      validateImageWidth = imageFile => {
        if (imageFile) {
    
          if (imageFile.width > maxWidth) {
            return `Image width must be less or equal to ${maxWidth}px`;
          }
        }
      };
    
      validateImageHeight = imageFile => {
        if (imageFile) {
    
          if (imageFile.height > maxHeight) {
            return `Image height must be less or equal to ${maxHeight}px`;
          }
        }
      };
      
      validateImageFormat = imageFile => {
        if (imageFile) {
    
          if (!mimeType.includes(imageFile.type)) {
            return `Image type must be ${mimeType}`;
          }
        }
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
            alert("You are already registered");
            setTimeout(() => {
                this.props.history.push('/chatroom');
            }, 500);
            
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

        const imgData = new FormData();
        imgData.append('file', this.state.selectedFile);


        const {userId, email, password} = this.state;

        //Create user Object
        const newUser = {
            userId,
            email,
            password,
            imgData
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
        
        if(!(name === 'image') && !values[name]){
            errors[name] = `${name} is a required field`;
        }

        if(name === 'image' && !values[name]){
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