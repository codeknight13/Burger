import React , {Component} from 'react';
import classes from './Order.css'
import Button from '../../components/UI/Button/Button'
import axios from '../../axios-orders'
import dateformat from 'dateformat'
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index'


class Order extends Component {
  render () {
    // console.log(this.props);
    const ingredients = [];
      for (let ingredientName in this.props.ingredients) {
        ingredients.push({
          name : ingredientName,
          amount : this.props.ingredients[ingredientName]
      });
    }

    const ingredientOutput = ingredients.map(ig => {
      return  <span 
                key={ig.name}
                style={{
                  textTransform: 'capitalize',
                  display: 'inline-block',
                  margin: '0 8px',
                  border: '1px solid #ccc',
                  padding: '5px'
                }}
              >
                {ig.name} : {ig.amount}
              </span>
    })

    return (
      <div className={classes.Order}>
        <div style = {{float: 'right'}}>
          <strong style={{paddingRight:'10px'}}>
            {dateformat(this.props.time,"h:MM TT dddd dS mmmm")}
          </strong>
          <Button 
            style={{paddingTop:'30px'}}
            btnType='Danger' 
            clicked={() => {
              console.log(this.props.id);
              const id = this.props.id
                axios.delete('/orders/'+id+'.json?auth='+this.props.token)
                  .then(res => {
                      console.log('res',res);
                      console.log(this.props.orders)
                      this.props.onDeleteOrder(id);
                    }
                  )
              }
            }
          >
            Delete Order
          </Button>
        </div>
        <p>Ingredients : {ingredientOutput}</p>
        <p>Price : <strong> {this.props.price}$</strong> </p>  
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    orders: state.order.orders
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDeleteOrder: (id) => dispatch(actions.deleteOrder(id))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Order);