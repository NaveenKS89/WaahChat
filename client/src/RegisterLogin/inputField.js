//SurveyField contains logic for single label and text input

import React from 'react';


export default ({input, label, meta: {error, touched}}) => {

    return (
            <div className="row">
            <div className="input-field">
                <input {...input} placeholder={label} style={{marginBottom: '5px'}} />   
            </div>
                <div className="red-text" >
                    {touched && error}
                </div>
            </div>
    );
};