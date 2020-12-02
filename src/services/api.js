import axios from 'axios';

const api = axios.create({
    //baseURL: 'http://localhost:8000'
    baseURL: 'https://xyzpost-api.herokuapp.com/'
})

export default api;

//api.get()
//api.post()