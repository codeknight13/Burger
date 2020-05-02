import * as actionTypes from './actions';

const initialState = {
  ingredients : {
    salad: 0,
    cheese: 0,
    meat: 0,
    bacon: 0
  },
  totalPrice : 2.25,
  purchasable : 0
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
      return {
        ...state,
        ingredients : {
          ...state.ingredients,
          [action.ingredientName] : state.ingredients[action.ingredientName] + 1
        },
        totalPrice : state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        purchasable : state.purchasable + 1
      };
    case actionTypes.REMOVE_INGREDIENT :
      return {
        ...state,
        ingredients : {
          ...state.ingredients,
          [action.ingredientName] : state.ingredients[action.ingredientName] - 1
        },
        totalPrice : state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
        purchasable : state.purchasable + 1
      };
    default : 
     return state;
  }
};

export default reducer;