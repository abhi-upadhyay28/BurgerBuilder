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
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component{
    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        console.log(this.props);
        // axios.get('https://burgerbuilder-app-bef2b.firebaseio.com/ingredients.json')
        // .then(response => {
        //     this.setState({ingredients: response.data});
        // })
        // .catch(error => {
        //     this.setState({error: true});
        // })
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
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
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
        let burger = this.state.error ? <p>Ingredients can't be loaded</p>:<Spinner />;
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
                />
            </Auxiliary>
            );
            orderSummary = <OrderSummary 
            ingredient={this.props.ings}
            price={this.props.price}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}/>;
        }
        if(this.state.loading){
            orderSummary = <Spinner />;
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
        ings: state.ingredients,
        price: state.totalPrice
    };  
};
const mapDispatchToProps = dispatch => {
    return {
    onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
    onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})  
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));