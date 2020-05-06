import React , { Component } from "react";

import Order from '../../components/Order/Order'
import Aux from '../../hoc/Aux/Aux'
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index'
import Spinner from '../../components/UI/Spinner/Spinner'
import {connect} from 'react-redux'


class Orders extends Component {
  componentDidMount () {
    this.props.onFetchOrders();
  }

  render () {
    let orders = <Spinner />
    if (!this.props.loading) {
      orders =(
        <Aux>
          {
            this.props.orders.map(order => (
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
    return (
      <div>
        {orders}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    orders: state.order.orders,
    loading: state.order.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchOrders: () => dispatch(actions.fetchOrders())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders , axios));