import React, {Component} from 'react';
import CheckOutSummary from '../../components/Order/CheckOutSummary/CheckOutSummary';
import { Route } from 'react-router-dom';
import ContactData from './ContactData/ContactData';

class CheckOut extends Component {
    state = {
        ingredients : null,
        totalPrice: 0
}
componentWillMount () {
    const query = new URLSearchParams(this.props.location.search);
    //console.log(query.entries);  
    // console.log(this.props);
    const ingredients = {};
    let price=0;
    for(let params of query.entries()){
        //console.log(params);
        //console.log()
        if(params[0]==="price"){
            price=params[1];
        }
        else{
        ingredients[params[0]] = +params[1];
        }
    }
    this.setState({ingredients: ingredients, totalPrice: price});
}
checkoutCancelledHandler = () => {
    this.props.history.goBack();
}
checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
}
    render () {
        return (
            <div>
                <CheckOutSummary 
                    ingredients = {this.state.ingredients}
                    checkoutCancelled={this.checkoutCancelledHandler} 
                    checkoutContinued={this.checkoutContinuedHandler}/>
                <Route 
                    path={this.props.match.url + "/contact-data"}
                    render = {(props) => (<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props}/>)} />
            </div>
        );
    } 

}

export default CheckOut;