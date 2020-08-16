import React, {Component} from 'react';
import CheckOutSummary from '../../components/Order/CheckOutSummary/CheckOutSummary';
import { Route, Redirect } from 'react-router-dom';
import ContactData from './ContactData/ContactData';
import { connect } from 'react-redux';

class CheckOut extends Component {
    // state = {
    //     ingredients : null,
    //     totalPrice: 0
    // }

checkoutCancelledHandler = () => {
    this.props.history.goBack();
}
checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
}
    render () {
        let summary = <Redirect to="/" />
        if(this.props.ings) {
            const purchasedRedirect = this.props.purchased ? <Redirect to="/" /> : null;
            summary = (
                <div>
                    {purchasedRedirect}
                    <CheckOutSummary 
                        ingredients = {this.props.ings}
                        checkoutCancelled={this.checkoutCancelledHandler} 
                        checkoutContinued={this.checkoutContinuedHandler}/>
                    <Route 
                        path={this.props.match.url + "/contact-data"}
                        component = {ContactData} />
                </div>
            );
        }
        return summary
    } 

}
const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
}

export default connect(mapStateToProps)(CheckOut);