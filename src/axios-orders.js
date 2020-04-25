import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://burger-472a9.firebaseio.com/'
});

export default instance;