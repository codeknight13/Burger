import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as actionTypes from '../../store/actions';

import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'



class BurgerBuilder extends Component {
  state = {
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount () {
    // setTimeout(() => {
    //   axios.get('https://burger-472a9.firebaseio.com/ingredients.json')
    //   .then(response => {
    //   console.log('fetched')
    //   this.setState({ingredients: response.data})
    // })
    // .catch(error => {
    //   this.setState({error:true});
    // });
    // }, 5)

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

    let burger = this.state.error ? <p>ingredients can't be loaded</p> : <Spinner/>
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
      orderSummary = <OrderSummary 
                      price={this.props.totalPrice}
                      ingredients={this.props.ings}
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

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    totalPrice : state.totalPrice,
    purchasable : state.purchasable
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded : (ingName) => dispatch({type : actionTypes.ADD_INGREDIENT, ingredientName : ingName}),
    onIngredientRemoved : (ingName) => dispatch({type : actionTypes.REMOVE_INGREDIENT, ingredientName : ingName})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));