import axios from 'axios';


const instance = axios.create( {
  baseURL: "/api",  
  timeout: 5000,
});

// instance.interceptors.request.use(config => {
//   config.headers["Authorization"] = localStorage.getItem("token");
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

export default instance;
