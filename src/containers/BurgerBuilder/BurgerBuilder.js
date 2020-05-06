import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as actions from '../../store/actions/index';

import axios from '../../axios-orders'
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'



class BurgerBuilder extends Component {
  state = {
    purchasing: false
  }

  componentDidMount () {
    this.props.onInitIngredients();
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
    this.props.onInitPurchase();
    this.props.history.push('./checkout');
  }

  render () {
    const disabledInfo = {
      ...this.props.ings
    };
    const isPurchasable = (this.props.purchasable===0);
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key]<= 0;
    }
    let orderSummary = null;

    let burger = this.props.error ? <p>ingredients can't be loaded</p> : <Spinner/>
    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings}/>      
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded }
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            price={this.props.totalPrice}
            purchasable={isPurchasable}
            ordered={this.purchaseButtonHandler}
          />
        </Aux>
      );
      orderSummary = 
        <OrderSummary 
          price={this.props.totalPrice}
          ingredients={this.props.ings}
          successClick={this.purchaseContinueHandler}
          cancelClick={this.purchaseCancelHandler}
        />
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

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    totalPrice : state.burgerBuilder.totalPrice,
    purchasable : state.burgerBuilder.purchasable,
    error : state.burgerBuilder.error
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded : (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved : (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients : () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));