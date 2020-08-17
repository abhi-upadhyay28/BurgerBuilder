import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';

import Auxiliary from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

const BurgerBuilder = props =>{
    const [purchasing, setPurchasing] = useState(false); 

    useEffect(() => {
        props.onInitIngredient();
    }, []);
    

    const updatePurchaseble = (Ingredient) => {
        const Ingredients = Ingredient;
        const sum = Object.keys(Ingredients)
        .map(igKey => {
            return Ingredients[igKey];
        })
        .reduce((sum,el) => {
            return sum+el;
        },0);
        return sum > 0;
    }

    const purchasingHandler = () => {
        if(props.isAuthenticated){
        setPurchasing(true);
        }
        else {
            props.onSetAuthRedirectPath("/checkout")
            props.history.push("/auth");
        }
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        props.onInitPurchase();
        props.history.push("/checkout");
    }
        const disabledIngredient = {
            ...props.ings
        }
        for(let key in disabledIngredient){
            disabledIngredient[key] = disabledIngredient[key] < 0;
        }
        let orderSummary = null;
        let burger = props.error ? <p>Ingredients can't be loaded</p>:<Spinner />;
        if(props.ings){
            burger = (
            <Auxiliary>
                <Burger ingredients={props.ings}/>
                <BuildControls 
                    ingredientAdded={props.onIngredientAdded} 
                    ingredientRemoved={props.onIngredientRemoved}
                    disabled={disabledIngredient}
                    purchaseable={updatePurchaseble(props.ings)}
                    ordered={purchasingHandler}
                    price={props.price}
                    isAuth={props.isAuthenticated}
                />
            </Auxiliary>
            );
            orderSummary = <OrderSummary 
            ingredient={props.ings}
            price={props.price}
            purchaseCancelled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler}/>;
        }
        return (
            <Auxiliary>
                <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
                </Modal>
                {burger}
            </Auxiliary>
        );
}
const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null 
    };  
};
const mapDispatchToProps = dispatch => {
    return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredient: () => dispatch(actions.initIngredient()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));