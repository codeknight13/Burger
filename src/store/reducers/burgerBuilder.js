import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility'

const initialState = {
  ingredients : null,
  totalPrice : 2.25,
  purchasable : 0,
  error: false
};

const INGREDIENT_PRICES = {
  salad: 1.5,
  cheese: 2.0,
  meat: 3.5,
  bacon: 2.75
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT :
      const aUpdatedIngredient = { [action.ingredientName] : state.ingredients[action.ingredientName] + 1 }
      const aUpdatedIngredients = updateObject(state.ingredients,aUpdatedIngredient)
      const aUpdatedState = {
        ingredients: aUpdatedIngredients,
        totalPrice : state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        purchasable : state.purchasable + 1
      }
      return updateObject(state,aUpdatedState);
    case actionTypes.REMOVE_INGREDIENT :
      const rUpdatedIngredient = { [action.ingredientName] : state.ingredients[action.ingredientName] - 1 }
      const rUpdatedIngredients = updateObject(state.ingredients,rUpdatedIngredient)
      const rUpdatedState = {
        ingredients: rUpdatedIngredients,
        totalPrice : state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
        purchasable : state.purchasable - 1
      }
      return updateObject(state,rUpdatedState);
    case actionTypes.SET_INGREDIENTS :
      return {
        ...state,
        ingredients : action.ingredients,
        error : false,
        totalPrice: initialState.totalPrice
      }
    case actionTypes.FETCH_INGREDIENTS_FAILED :
      return {
        ...state,
        error :  true
      }
    default : 
     return state;
  }
};

export default reducer;