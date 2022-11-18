import axios from "axios";

let baseURL = "https://swift-pay.herokuapp.com/api/";

if (window.location.origin?.includes("localhost")) {
  baseURL = "https://swift-pay.herokuapp.com/api/";
}

const instance = axios.create({
  baseURL,
});

export default instance;
