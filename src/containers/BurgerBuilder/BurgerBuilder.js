import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 1.5,
  meat: 3,
  bacon: 2.75
}

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    }, 
    totalPrice: 2.25,
    purchasable: 0,
    purchasing: false
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount+1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    const newPurchasable = this.state.purchasable + 1;
    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients,
      purchasable: newPurchasable
    })
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount<=0) {
      return;
    }
    const updatedCount = oldCount-1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceAddition;
    const newPurchasable = this.state.purchasable - 1;
    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients,
      purchasable: newPurchasable
    })
  }

  purchaseButtonHandler = () => {
    this.setState({
      purchasing: true
    })
  }

  purchaseCancelHandler = () => {
    this.setState({
      purchasing: false
    })
  }
  
  purchaseContinueHandler = () => {
    window.location.reload();
  }

  render () {
    const disabledInfo = {
      ...this.state.ingredients
    };
    const isPurchasable = (this.state.purchasable===0);
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key]<= 0;
    }
    return (
      <Aux>
        <Modal 
          show={this.state.purchasing}
          modalClosed = {this.purchaseCancelHandler}
        >
          <OrderSummary 
            price={this.state.totalPrice}
            ingredients={this.state.ingredients}
            successClick={this.purchaseContinueHandler}
            cancelClick={this.purchaseCancelHandler}
          />
        </Modal>
        <Burger ingredients={this.state.ingredients}/>      
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            price={this.state.totalPrice}
            purchasable={isPurchasable}
            ordered={this.purchaseButtonHandler}
          />
      </Aux>
    );
  }
}

export default BurgerBuilder;