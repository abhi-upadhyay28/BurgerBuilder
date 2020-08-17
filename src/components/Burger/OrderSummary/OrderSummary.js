import React from 'react';
import Auxiliary from '../../../hoc/Auxiliary'
import Button from '../../UI/Button/Button'

const OrderSummary = props => {
    
        const ingredientSummary = Object.keys(props.ingredient)
        .map(igKey => {
        return (
            <li>
                <span style={{textTransform: 'capitalize'}}>{igKey}</span>: {props.ingredient[igKey]}
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
            <p><strong>Total Price: {props.price.toFixed(2)}</strong></p>
            <p>Continue to checkout</p>
            <Button btnType="Danger" clicked={props.purchasedCancelled}>CANCEL</Button>
            <Button btnType="Success" clicked={props.purchaseContinued}>CONTINUE</Button>
        </Auxiliary>
        );
}

export default OrderSummary;