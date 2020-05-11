import * as actionTypes from './actionTypes';
import axios from 'axios'

// const api_key = 'AIzaSyCi1ZL8HS2i1k8Aa6PVLySF0-MU82v1Ihc'

export const authStart = () => {
  console.log('started');
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (idtoken, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: idtoken,
    userId: userId
  };
};

export const authError = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const logout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout())
    },expirationTime*500)
  }
}

export const auth = (email, password, isSignUp) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email : email,
      password : password,
      returnSecureToken: true
    }
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCi1ZL8HS2i1k8Aa6PVLySF0-MU82v1Ihc';
    if (isSignUp) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCi1ZL8HS2i1k8Aa6PVLySF0-MU82v1Ihc';
    }
    axios.post(url,authData)
    .then(res => {
      console.log(res);
      dispatch(authSuccess(res.data.idToken,res.data.localId));
      dispatch(checkAuthTimeout(res.data.expiresIn));
    })
    .catch(err => {
      console.log(err);
      dispatch(authError(err.response.data.error));
    })
  }
}

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  }
}