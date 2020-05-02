import React , { Component } from "react";

import Order from '../../components/Order/Order'
import Aux from '../../hoc/Aux/Aux'
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

class Orders extends Component {

  state = {
    orders:[],
    loading: true,
    date: null
  }

  componentDidMount () {
    axios.get('/orders.json')
      .then(res => {
        const orders = [];
        for (let key in res.data) {
          orders.push({
            ...res.data[key],
            id:key
          })
        }
        console.log(res);
        this.setState({orders:orders,loading: false})
      })
      .catch(err => {
        this.setState({loading: false})
      })
  }

  render () {

    return (
      <Aux>
        {
          this.state.orders.map(order => (
            <Order 
              key={order.id}
              id={order.id}
              ingredients={order.ingredients}
              price={order.price}
              time={order.time}
            />
          ))
        }
      </Aux>
    )
  }
}

export default withErrorHandler(Orders , axios);