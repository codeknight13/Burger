import React, {Component} from 'react'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import classes from './Auth.css'
import Spinner from '../../components/UI/Spinner/Spinner'


import * as actions from '../../store/actions/index'
import {connect} from 'react-redux'
import { Redirect } from 'react-router-dom'


class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your E-Mail'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 8
        },
        valid: false,
        touched: false
      },
    },
    isSignUp: true,
    shouldRedirect: false
  }

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
        return true;
    }
    
    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }

    return isValid;
}

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
        touched: true
      }
    }
    this.setState({controls: updatedControls});
  }

  componentWillReceiveProps = (nextProps) => {
    // console.log('componentWillReceiveProps ' , nextProps, nextProps.token)
    if (nextProps.token) {
      this.setState({shouldRedirect: true})
    }
  }

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp)
  }

  switchAuthModeHandler = () => {
    console.log('called', this.state.isSignUp)
    const isSignUp = !this.state.isSignUp
    this.setState({isSignUp:isSignUp})
  }

  render () {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id:key,
        config:this.state.controls[key]
      })
    }
    let form = formElementsArray.map(formElement => (
      <Input 
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        touched={formElement.config.touched}
        invalid={!formElement.config.valid}
        changed={(event) => this.inputChangedHandler(event,formElement.id)}
      />
    ))
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = (
        <p style={{color: "#ff3344"}}>{this.props.error.message}</p>
      )
    }
    if (this.props.loading) {
      form = <Spinner />
    }

    let output = (
      <div className={classes.Auth}>
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button customStyles={{'float': 'left', "marginLeft": "15px"}} btnType='Success'>{!this.state.isSignUp ? 'SIGN IN':'SIGN UP'}</Button>
        </form>
        <Button clicked={this.switchAuthModeHandler} customStyles={{"float": 'right'}} btnType='Danger'>GO TO {this.state.isSignUp ? 'SIGN IN':'SIGN UP'}</Button>
      </div>
    )

    if (this.state.shouldRedirect) {
      output = <Redirect to='/' />
    }

    return output;
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);