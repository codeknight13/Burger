import React from 'react'
import classes from './Burger.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'
// import {withRouter} from 'react-router-dom'


const burger = (props) => {
  console.log(classes);
  const transformedIngredients = 
  Object.keys(props.ingredients).map(igKey => {
    return [...Array(props.ingredients[igKey])].map((_, i ) => {
      return <BurgerIngredient key={igKey+i} type={igKey}/>
    });
  }).reduce((arr,el) => {
    return arr.concat(el)
  }, []);
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type='bread-top'/>
      {
        transformedIngredients.length === 0 ?
        <p>Please add something!!!!</p> : transformedIngredients
      }
      <BurgerIngredient type='bread-bottom'/>
      
    </div>
  );
};

export default burger;