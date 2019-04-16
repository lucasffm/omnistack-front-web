import Axios from 'axios';

const API = Axios.create({
  baseURL: 'https://omnistack-backlucas.herokuapp.com'
});

export default API;
