import React, {Component} from 'react';
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


class BurgerBuilder extends Component{
    state = {
        purchasing: false,
    }

    componentDidMount () {
        console.log(this.props);
        this.props.onInitIngredient();
    }

    updatePurchaseble = (Ingredient) => {
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

    purchasingHandler = () => {
        if(this.props.isAuthenticated){
        this.setState({purchasing: true});
        }
        else {
            this.props.onSetAuthRedirectPath("/checkout")
            this.props.history.push("/auth");
        }
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push("/checkout");
    }
    render() {
        const disabledIngredient = {
            ...this.props.ings
        }
        for(let key in disabledIngredient){
            disabledIngredient[key] = disabledIngredient[key] < 0;
        }
        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can't be loaded</p>:<Spinner />;
        if(this.props.ings){
            burger = (
            <Auxiliary>
                <Burger ingredients={this.props.ings}/>
                <BuildControls 
                    ingredientAdded={this.props.onIngredientAdded} 
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled={disabledIngredient}
                    purchaseable={this.updatePurchaseble(this.props.ings)}
                    ordered={this.purchasingHandler}
                    price={this.props.price}
                    isAuth={this.props.isAuthenticated}
                />
            </Auxiliary>
            );
            orderSummary = <OrderSummary 
            ingredient={this.props.ings}
            price={this.props.price}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}/>;
        }
        return (
            <Auxiliary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                {orderSummary}
                </Modal>
                {burger}
            </Auxiliary>
        );
    }
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