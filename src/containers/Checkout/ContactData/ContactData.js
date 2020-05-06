import React, { Component } from "react";
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button'
import axios from '../../../axios-orders'
import classes from './ContactData.css'
import Spinner from '../../../components/UI/Spinner/Spinner'
import {withRouter} from 'react-router-dom'
import Input from '../../../components/UI/Input/Input'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../../store/actions/index'

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP'
        },
        value: '',
        validation: {
          required: true,
          reqLength: 6
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your E-Mail'
        },
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'cheapest'},
          ]
        },
        value: 'fastest',
        validation: {

        },
        valid: true,
        touched: false
      }
    },
    formIsValid : false
  }

  checkValidity(value , rules) {
    // console.log('checkValidity', value)
    let isValid = true;
    
    if (rules.required) {
      isValid = value.trim() !=='';
    }

    if (rules.reqLength) {
      // console.log(typeof(value),value);
      isValid = value.length===rules.reqLength;
      // console.log(this.state.orderForm.zipCode.valid)
    }

    return isValid;
  }

  inputChangedHandler = (event,identifier) => {
    console.log('someoneClicked')
    const updatedOrderForm = {...this.state.orderForm};
    const updatedFormElement = {...updatedOrderForm[identifier]};
    updatedFormElement.value = event.target.value;
    if (!updatedFormElement.touched)
    updatedFormElement.elementConfig.placeholder+=' is required'
    updatedFormElement.touched = true;
    updatedFormElement.valid = 
    this.checkValidity(updatedFormElement.value,updatedFormElement.validation);
    // console.log('inputChangedHandler' , updatedFormElement.value)
    updatedOrderForm[identifier] = updatedFormElement;
  
    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid &= updatedOrderForm[inputIdentifier].valid
    }
  
    this.setState({
      orderForm:updatedOrderForm,
      formIsValid : formIsValid
    })
  }

  orderHandler = (event) => {
    event.preventDefault();
    const formData = {};
    for (let formElement in this.state.orderForm) {
      formData[formElement] = this.state.orderForm[formElement].value;
    }
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
      orderData: formData,
      time: new Date()
    }
    this.props.onOrderBurger(order);
  }

  render () {
    const formElementArray = [];
    for (let key in this.state.orderForm) {
      formElementArray.push({
        id:key,
        config:this.state.orderForm[key]
      })
    }
    let form = (
      <form onSubmit={this.orderHandler}>
          {formElementArray.map(formElement => (
            <Input 
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              touched={formElement.config.touched}
              invalid={!formElement.config.valid}
              changed={(event) => this.inputChangedHandler(event,formElement.id)}
            />
          ))}
          <Button disabled = {!this.state.formIsValid} btnType='Success'>ORDER</Button>
      </form>
    );
    let message = 'Enter your Contact Data'
    if (this.props.loading) {
      message='Loading...';
      form =<Spinner />
    }
    return (
      <div className={classes.ContactData}>
        <h4>{message}</h4>
        {form}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    loading: state.order.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onOrderBurger: (orderData) => dispatch(actions.purchaseBurger(orderData))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData,axios));