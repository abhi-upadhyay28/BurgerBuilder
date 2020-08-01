import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';

class ContactData extends Component {
    state = {
        orderForm : {
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
           },
        loading: false,
        formIsValid: false
    }
    orderHandler = (event) => {
        event.preventDefault();
        console.log(this.props.ingredients);
        this.setState({ loading: true });
        let formData ={};
        for( let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        const order = {
            Ingredients : this.props.ings,
            Price: this.props.price, 
            OrderData: formData

        }
        axios.post('/orders.json', order)
         .then(response => {
             //console.log(response);
             this.setState({ loading: false });
             this.props.history.push("/");
             
         })
         .catch(error => {
             //console.log(error);
             this.setState({ loading: false });
         }); 
    }
    checkValidity (value, rules) {
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
    inputChangedHandler = (event, inputIdentifier) => {
        //console.log(event.target.value);
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;
        for (let formElementIdentifier in updatedOrderForm) {
            formIsValid = formIsValid && updatedOrderForm[formElementIdentifier].valid;
        }
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
    }
    
    render() {
        let formElementArray = [];
        for( let key in this.state.orderForm) {
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }
        
        let form = (
            <form onSubmit={this.orderHandler}>
            {formElementArray.map(formElement => (
                <Input 
                    key={formElement.id}
                    elementType={formElement.config.elementType} 
                    elementConfig={formElement.config.elementConfig} 
                    value = {formElement.config.value}
                    invalid = {!formElement.config.valid}
                    validation = {formElement.config.validation}
                    touched = {formElement.config.touched}
                    changed = { (event) => this.inputChangedHandler(event, formElement.id)}/>
            ))}
            <Button 
                btnType="Success" disabled={!this.state.formIsValid}>Order Now</Button>
        </form>
        );
        if(this.state.loading)
        form = <Spinner />
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact details</h4>
                {form}
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    };
}

export default connect(mapStateToProps)(ContactData);