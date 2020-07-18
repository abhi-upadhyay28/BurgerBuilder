import React, {Component} from 'react';
import Auxiliary from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICE = {
    salad: 0.5,
    bacon: 0.8,
    cheese: 1.5,
    meat: 0.4
}
class BurgerBuilder extends Component{
    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        axios.get('https://burgerbuilder-app-bef2b.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({ingredients: response.data});
        })
        .catch(error => {
            this.setState({error: true});
        })
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
        this.setState({purchaseable: sum > 0 });
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const addPrice = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + addPrice;
        this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
        this.updatePurchaseble(updatedIngredients);

    }
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount - 1;
        if(updatedCount < 0)
        return;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const deductPrice = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - deductPrice;
        this.setState({ingredients: updatedIngredients, totalPrice: newPrice}); 
        this.updatePurchaseble(updatedIngredients);
    }

    purchasingHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
       // alert("You Continue !");
       this.setState({ loading: true });
       const order = {
           Ingredients : this.state.ingredients,
           Price: this.state.totalPrice,
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
            this.setState({ loading: false, purchasing: false });
            
        })
        .catch(error => {
            //console.log(error);
            this.setState({ loading: false, purchasing: false });
        });
    }
    render() {
        const disabledIngredient = {
            ...this.state.ingredients
        }
        for(let key in disabledIngredient){
            disabledIngredient[key] = disabledIngredient[key] < 0;
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded</p>:<Spinner />;
        if(this.state.ingredients){
            burger = (
            <Auxiliary>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                    ingredientAdded={this.addIngredientHandler} 
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledIngredient}
                    purchaseable={this.state.purchaseable}
                    ordered={this.purchasingHandler}
                    price={this.state.totalPrice}
                />
            </Auxiliary>
            );
            orderSummary = <OrderSummary 
            ingredient={this.state.ingredients}
            price={this.state.totalPrice}
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

export default withErrorHandler(BurgerBuilder, axios);