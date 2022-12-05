import axios from "axios";

let baseURL = "https://swift-pay.onrender.com/";

if (window.location.origin?.includes("localhost")) {
  baseURL = "https://swift-pay.onrender.com/";
}

const instance = axios.create({
  baseURL,
});

export default instance;
