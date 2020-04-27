import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 1.5,
  meat: 3,
  bacon: 2.75
}

class BurgerBuilder extends Component {
  state = {
    ingredients: null, 
    totalPrice: 2.25,
    purchasable: 0,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount () {
    setTimeout(() => {
      axios.get('https://burger-472a9.firebaseio.com/ingredients.json')
      .then(response => {
      console.log('fetched')
      this.setState({ingredients: response.data})
    })
    .catch(error => {
      this.setState({error:true});
    });
    }, 5)
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
    // window.location.reload();
    
    const queryParams = [];
    for (let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    }
    queryParams.push('price=' + this.state.totalPrice);
    const queryString = queryParams.join('&');
    this.props.history.push({
      pathname: '/checkout',
      search: '?' + queryString
    });
  }

  render () {
    const disabledInfo = {
      ...this.state.ingredients
    };
    const isPurchasable = (this.state.purchasable===0);
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key]<= 0;
    }
    let orderSummary = null;

    let burger = this.state.error ? <p>ingredients can't be loaded</p> : <Spinner/>
    if (this.state.ingredients) {
      burger = (
        <Aux>
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
      orderSummary = <OrderSummary 
                      price={this.state.totalPrice}
                      ingredients={this.state.ingredients}
                      successClick={this.purchaseContinueHandler}
                      cancelClick={this.purchaseCancelHandler}
                      />
    }
    if (this.state.loading) {
      orderSummary = <Spinner />;
    }
    return (
      <Aux>
        <Modal 
          show={this.state.purchasing}
          modalClosed = {this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);