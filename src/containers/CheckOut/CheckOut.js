import React, {Component} from 'react';
import CheckOutSummary from '../../components/Order/CheckOutSummary/CheckOutSummary';
import { Route } from 'react-router-dom';
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
        return (
            <div>
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

}
const mapStateToProps = state => {
    return {
        ings: state.ingredients
    }
}

export default connect(mapStateToProps)(CheckOut);