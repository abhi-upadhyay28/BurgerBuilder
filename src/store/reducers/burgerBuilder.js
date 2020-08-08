import * as actionTypes from '../actions/actionTypes';
import { updatedObject } from '../utility';

const INGREDIENT_PRICE = {
    salad: 0.5,
    bacon: 0.8,
    cheese: 1.5,
    meat: 0.4
}
const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
    building: false
}
const addIngredient = (state, action) => {
    const updatedIngredient = {[action.ingredientName]: state.ingredients[action.ingredientName] + 1}
    const updatedIngredients =  updatedObject(state.ingredients, updatedIngredient);
    const updatedState = {
        ingredients: updatedIngredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICE[action.ingredientName],
        building: true
    }
    return updatedObject(state, updatedState);
};
const removeIngredient = (state, action) => {
    const updatedIng = {[action.ingredientName]: state.ingredients[action.ingredientName] + 1}
    const updatedIngs =  updatedObject(state.ingredients, updatedIng);
    const updatedSt = {
        ingredients: updatedIngs,
        totalPrice: state.totalPrice + INGREDIENT_PRICE[action.ingredientName],
        building: true
    }
    return updatedObject(state, updatedSt);
};
const setIngredient = (state, action) => {
    return updatedObject(state, {
        ingredients: {
            salad: action.ingredient.salad,
            bacon: action.ingredient.bacon,
            cheese: action.ingredient.cheese,
            meat: action.ingredient.meat
        },
        totalPrice: 4,
        error: false,
        building: false
    });
};
const fetchIngredientsFailed = (state, action) => {
    return updatedObject(state, {error: true});
};
const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.ADD_INGREDIENT: return addIngredient(state,action); 
        case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action);
        case actionTypes.SET_INGREDIENT: return setIngredient(state, action);
        case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFailed(state, action);
        default:
            return state;
    }
}

export default reducer;