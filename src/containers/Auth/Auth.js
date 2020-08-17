import React, { useState, useEffect } from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import {Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import { updatedObject } from '../../shared/utility';

const Auth = props => {
    const [authForm, setAuthForm] = useState({
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Mail Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        });
        const [isSignup, setIsSignup] = useState(true);
    
    useEffect(() => {
        if(!props.buildingBurger && props.authRedirectPath !== "/"){
            props.onSetAuthRedirectPath();
        }
    }, []);

    const checkValidity = (value, rules) => {
        let isvalid = true;
        
        if(rules && rules.required) {
            isvalid = (value.trim() !== '' ) && isvalid;
        }
        
        if(rules && rules.minLength){
        isvalid = isvalid && value.length >= rules.minLength;
        }

        if (rules && rules.isEmail ) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isvalid = pattern.test( value ) && isvalid
        }

        if (rules && rules.isNumeric ) {
            const pattern = /^\d+$/;
            isvalid = pattern.test( value ) && isvalid
        }

        return isvalid;
    }
    const inputChangedHandler = (event, controlName) => {
        const updatedControls = updatedObject(authForm, {
            [controlName]: updatedObject(authForm[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, authForm[controlName].validation),
                touched: true
            })  
        });
        setAuthForm(updatedControls);
    }
    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(authForm.email.value, authForm.password.value, isSignup);
    }
    const switchAuthModeHandler = () => {
        setIsSignup(!isSignup);
        // this.setState(prevState => {
        //     return {isSignup: !prevState.isSignup}
        // });
    }
        let formElementArray = [];
        for( let key in authForm) {
            formElementArray.push({
                id: key,
                config: authForm[key]
            });
        }
        let form = (
            formElementArray.map(formElement => (
                <Input 
                    key={formElement.id}
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig} 
                    value = {formElement.config.value}
                    invalid = {!formElement.config.valid}
                    validation = {formElement.config.validation}
                    touched = {formElement.config.touched}
                    changed = { (event) => inputChangedHandler(event, formElement.id)}/>
            )));

        if(props.loading){
            form = <Spinner />
        }
        
        let errormessage = null;
        if(props.error){
            errormessage = (
                <p>{props.error.message}</p>
            );
        }

        let authRedirect = null;
        if(props.isAuthenticated){
            authRedirect = <Redirect to={props.authRedirectPath}/>;
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errormessage}
                <form onSubmit = {submitHandler}>
                    {form}
                    <Button btnType = "Success">SUBMIT</Button>
                </form>
                <Button 
                    btnType = "Danger"
                    clicked={switchAuthModeHandler}>SWITCH TO {isSignup ? 'SIGNUP' : 'SIGNIN'} </Button>
                
            </div>
        );
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/"))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth); 