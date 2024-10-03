// config.js
const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://pool-2da3e3f8acbe.herokuapp.com'
    : 'http://localhost:5001';

export default API_URL;