import { put } from 'redux-saga/effects';
import axios from '../../axios-orders';
import * as actions from '../actions/index'; 

export function* initIngredientSaga(action) {
    try {
    const response = yield axios.get('https://burgerbuilder-app-bef2b.firebaseio.com/ingredients.json')
    //console.log(response.data)
    yield put(actions.setIngredient(response.data));
    }
    catch(error) {
    yield put(actions.fetchIngredientsFailed());
    }
}