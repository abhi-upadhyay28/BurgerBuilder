import React, {Component} from 'react';
import CheckOutSummary from '../../components/Order/CheckOutSummary/CheckOutSummary';
import { Route, Redirect } from 'react-router-dom';
import ContactData from './ContactData/ContactData';
import { connect } from 'react-redux';

const CheckOut = props => {
    // state = {
    //     ingredients : null,
    //     totalPrice: 0
    // }

const checkoutCancelledHandler = () => {
    props.history.goBack();
}
const checkoutContinuedHandler = () => {
    props.history.replace('/checkout/contact-data');
}
        let summary = <Redirect to="/" />
        if(props.ings) {
            const purchasedRedirect = props.purchased ? <Redirect to="/" /> : null;
            summary = (
                <div>
                    {purchasedRedirect}
                    <CheckOutSummary 
                        ingredients = {props.ings}
                        checkoutCancelled={checkoutCancelledHandler} 
                        checkoutContinued={checkoutContinuedHandler}/>
                    <Route 
                        path={props.match.url + "/contact-data"}
                        component = {ContactData} />
                </div>
            );
        }
        return summary

}
const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
}

export default connect(mapStateToProps)(CheckOut);