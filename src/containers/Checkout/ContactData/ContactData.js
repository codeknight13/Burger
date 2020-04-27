import React, { Component } from "react";

import Button from '../../../components/UI/Button/Button'
import axios from '../../../axios-orders'
import classes from './ContactData.css'
import Spinner from '../../../components/UI/Spinner/Spinner'
import {withRouter} from 'react-router-dom'

class ContactData extends Component {
  state = {
    name: '',
    email: '',
    address: {
      street: '',
      postalCode: ''
    },
    loading :false
  }

  orderHandler = (event) => {
    event.preventDefault();
    this.setState({loading: true});
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.totalPrice,
      customer: {
        name: 'vikram',
        address: {
          street: 'wall street'
        },
        email: 'kirtivikram13@gmail.com'
      },
      deliveryMethod : 'contactData.js'
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
      }, 297);
  }

  render () {
    let form = (
      <form>
          <input className={classes.Input} type='text' name='name' placeholder='your name' />
          <input className={classes.Input} type='email' name='email' placeholder='your email' />
          <input className={classes.Input} type='text' name='Street' placeholder='your Street' />
          <input className={classes.Input} type='text' name='PostalCode' placeholder='your PostalCode' />
          <Button btnType='Success' clicked={this.orderHandler} >ORDER</Button>
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