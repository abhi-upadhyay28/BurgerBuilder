import axios from 'axios';

const instance = axios.create({
    baseURL : 'https://burgerbuilder-app-bef2b.firebaseio.com/'
});

export default instance;