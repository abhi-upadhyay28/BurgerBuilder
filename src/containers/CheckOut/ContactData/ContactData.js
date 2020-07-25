import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalcode: ''
        },
        loading: false
    }
    orderHandler = (event) => {
        event.preventDefault();
        console.log(this.props.ingredients);
        this.setState({ loading: true });
        const order = {
            Ingredients : this.props.ingredients,
            Price: this.props.price,
            Customer : {
                 Name: 'Abhishek Upadhyay',
                 Address : {
                    HouseNo: 'Qtr 284/2',
                    Street: 'Air Force Station Ojhar',
                    City: 'Nashik',
                    State: 'Maharashtra',
                    Pincode: '422207'
                 },
             EmailId: 'upadhyay28abhishek@gmail.com',
             DeliveryOption: 'Fastest'  
            }
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
    render() {
        let form = (
            <form>
            <input className={classes.Input} type="text" name="name" placeholder="Your Name" />
            <input className={classes.Input} type="email" name="email" placeholder="Your Email" />
            <input className={classes.Input} type="text" name="street" placeholder="Street Name" />
            <input className={classes.Input} type="text" name="postalcode" placeholder="PostalCode" />
            <Button 
                btnType="Success"
                clicked={this.orderHandler}>Order Now</Button>
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

export default ContactData;