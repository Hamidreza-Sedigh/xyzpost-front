import axios from 'axios';

const api = axios.create({
    baseURL: 'https://xyzpost-api.herokuapp.com/'
})

export default api;

//api.get()
//api.post()