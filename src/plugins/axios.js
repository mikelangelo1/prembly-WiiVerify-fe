import axios from "axios";

// let baseURL = "https://api.cycopay.com/api/";
let baseURL = "http://localhost:5000/api/";

if (window.location.origin?.includes("localhost")) {
  baseURL = "http://localhost:5000/api/";
}

const instance = axios.create({
  baseURL,
});

export default instance;
