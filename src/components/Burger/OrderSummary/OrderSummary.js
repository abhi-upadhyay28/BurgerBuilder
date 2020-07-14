import React, { Component } from 'react';
import Auxiliary from '../../../hoc/Auxiliary'
import Button from '../../UI/Button/Button'

class OrderSummary extends Component {
    componentWillUpdate() {
        console.log('[OrderSummary] will update');
    }
    render() {
        const ingredientSummary = Object.keys(this.props.ingredient)
        .map(igKey => {
        return (
            <li>
                <span style={{textTransform: 'capitalize'}}>{igKey}</span>: {this.props.ingredient[igKey]}
            </li>
            );
        });
        return (
        <Auxiliary>
            <h3>Your Order: </h3>
            <p>A delicious Burger with the following ingredients: </p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
            <p>Continue to checkout</p>
            <Button btnType="Danger" clicked={this.props.purchasedCancelled}>CANCEL</Button>
            <Button btnType="Success" clicked={this.props.purchaseContinued}>CONTINUE</Button>
        </Auxiliary>
        );
    }
}

export default OrderSummary;