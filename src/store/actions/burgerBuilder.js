import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name
    };
}

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    };
}

export const setIngredient = (ingredient) => {
    return {
        type: actionTypes.SET_INGREDIENT,
        ingredient: ingredient
    };
}

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    }
}

export const initIngredient = () => {
    return dispatch => {
        axios.get('https://burgerbuilder-app-bef2b.firebaseio.com/ingredients.json')
        .then(response => {
            //console.log(response.data)
            dispatch(setIngredient(response.data));
        })
        .catch(error => {
            dispatch(fetchIngredientsFailed());
        })
    }
}
