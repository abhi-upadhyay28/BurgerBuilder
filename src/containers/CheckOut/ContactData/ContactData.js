import React, {Component, useState} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updatedObject } from '../../../shared/utility';

const ContactData = props => {
    const [orderForm, setOrderForm] = useState({
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            } ,
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '', 
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipcode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6,
                    maxLength: 6
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            emailId: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    option : [
                    {value: 'fastest', displayValue: 'Fastest'},
                    {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest',
                valid: true
            }
           });
    const [formIsValid, setFormIsValid] = useState(false);

    const orderHandler = (event) => {
        event.preventDefault();
        //console.log(props.ingredients);
        let formData ={};
        for( let formElementIdentifier in orderForm) {
            formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
        }

        const order = {
            Ingredients : props.ings,
            Price: props.price, 
            OrderData: formData,
            userId: props.userId

        }
        props.onOrderBurger(order, props.token);
    }
    const checkValidity = (value, rules) => {
        let isvalid = true;
        
        if(rules && rules.required) {
            isvalid = (value.trim() !== '' ) && isvalid;
        }
        
        if(rules && rules.minLength){
        isvalid = isvalid && value.length >= rules.minLength;
        }
        
        if(rules && rules.maxLength){
        isvalid = isvalid && value.length <= rules.maxLength;
        }

        return isvalid;
    }
    const inputChangedHandler = (event, inputIdentifier) => {
        //console.log(event.target.value);
        // const updatedOrderForm = {
        //     ...orderForm
        // };
        // const updatedFormElement = {
        //     ...updatedOrderForm[inputIdentifier]
        // };
        const updatedFormElement = updatedObject(orderForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, orderForm[inputIdentifier].validation),
            touched: true
        });
        const updatedOrderForm = updatedObject(orderForm, {
            [inputIdentifier]: updatedFormElement
        });
        /*updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement; */
        let formIsValid = true;
        for (let formElementIdentifier in updatedOrderForm) {
            formIsValid = formIsValid && updatedOrderForm[formElementIdentifier].valid;
        }
        setOrderForm(updatedOrderForm);
        setFormIsValid(formIsValid);
    }
    
        let formElementArray = [];
        for( let key in orderForm) {
            formElementArray.push({
                id: key,
                config: orderForm[key]
            });
        }
        
        let form = (
            <form onSubmit={orderHandler}>
            {formElementArray.map(formElement => (
                <Input 
                    key={formElement.id}
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig} 
                    value = {formElement.config.value}
                    invalid = {!formElement.config.valid}
                    validation = {formElement.config.validation}
                    touched = {formElement.config.touched}
                    changed = { (event) => inputChangedHandler(event, formElement.id)}/>
            ))}
            <Button 
                btnType="Success" disabled={!formIsValid}>Order Now</Button>
        </form>
        );
        if(props.loading)
        form = <Spinner />
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact details</h4>
                {form}
            </div>
        );
}
const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
}

const mapDispatchToProps = dispatch => {
    return {
    onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));