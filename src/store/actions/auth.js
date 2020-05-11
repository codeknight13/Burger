import * as actionTypes from './actionTypes';
import axios from 'axios'
// import {connect} from 'react-redux'

// const api_key = 'AIzaSyCi1ZL8HS2i1k8Aa6PVLySF0-MU82v1Ihc'

export const authStart = () => {
  // console.log('started');
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
  localStorage.removeItem('token');
  localStorage.removeItem('expirationTime');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout())
    },expirationTime*1000)
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
        // console.log(res);
        const expirationTime = new Date(new Date().getTime() + res.data.expiresIn*1000);
        localStorage.setItem('token', res.data.idToken);
        localStorage.setItem('expirationTime', expirationTime);
        localStorage.setItem('userId', res.data.localId);
        dispatch(authSuccess(res.data.idToken,res.data.localId));
        dispatch(checkAuthTimeout(res.data.expiresIn));
      })
      .catch(err => {
        // console.log(err);
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

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      // console.log('token not found');
      dispatch(logout());
    } else {
      const expirationTime = new Date(localStorage.getItem('expirationTime'));
      // console.log(expirationTime);
      if (expirationTime > new Date()) {
        const userId = localStorage.getItem('userId');
        dispatch(authSuccess(token,userId));
        dispatch(checkAuthTimeout((expirationTime.getTime()- new Date().getTime())/1000))
      } else {
        // console.log('time out');
        dispatch(logout());
      }
    }
  }
}