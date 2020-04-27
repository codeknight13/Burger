import React, { Component } from "react";

import Button from '../../../components/UI/Button/Button'
import axios from '../../../axios-orders'
import classes from './ContactData.css'
import Spinner from '../../../components/UI/Spinner/Spinner'
import {withRouter} from 'react-router-dom'
import Input from '../../../components/UI/Input/Input'

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'YourName'
        },
        value: ''
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: ''
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP'
        },
        value: ''
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: ''
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your E-Mail'
        },
        value: ''
      },
      deliveryMethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'cheapest'},
          ]
        },
        value: ''
      }
    },
    loading :false
  }

  inputChangedHandler = (event,identifier) => {
    const updatedOrderForm = {...this.state.orderForm};
    const updatedFormElement = {...updatedOrderForm[identifier]};
    updatedFormElement.value = event.target.value;
    updatedOrderForm[identifier] = updatedFormElement;
    this.setState({
      orderForm:updatedOrderForm
    })
  }

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({loading: true});
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
    setTimeout(() => {
      axios.post('/orders.json',order)
        .then(
          response => {
            console.log(response);
            this.setState({loading: false });
          }
        )
        .then(
          this.props.history.push('/')
        )
        .catch( this.setState({loading: false }));
      }, 100 );
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
              changed={(event) => this.inputChangedHandler(event,formElement.id)}
            />
          ))}
          <Button btnType='Success'>ORDER</Button>
      </form>
    );
    let message = 'Enter your Contact Data'
    if (this.state.loading) {
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

export default withRouter(ContactData);