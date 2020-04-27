import React , {Component} from 'react';
import classes from './Order.css'
import Button from '../../components/UI/Button/Button'
import axios from '../../axios-orders'

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
          <Button 
            btnType='Danger' 
            clicked={() => {
              console.log(this.props.id);
              const id = this.props.id
                axios.delete('/orders/'+id+'.json')
                  .then(res => {
                      console.log('res',res);
                      window.location.reload();
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

export default Order;