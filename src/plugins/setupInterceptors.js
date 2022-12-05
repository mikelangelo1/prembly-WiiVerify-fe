import Axios from "./axios";
import TokenService from "../webServices/token.service";

import EventBus from "../common/EventBus";

let baseURL = "https://swift-pay.onrender.com/";


const setup = (store) => {
  Axios.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken();
      if (token) {
        // config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
        config.headers["x-access-token"] = token; // for Node.js Express back-end
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  Axios.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;

      const rememberMe = store.state.auth.userData?.rememberMe;

      if (originalConfig.url !== "v1/merchant/login" && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;

          // if user did not select remember me option then do not refresh token
          if (!rememberMe) {
            EventBus.dispatch("logout");
            return Axios(originalConfig);
          }

          try {
            const rs = await Axios.post("v1/merchant/refresh-token", {
              refreshToken: TokenService.getLocalRefreshToken(),
            });
            //
            const token = rs.data?.token;
            if (token) {
              store.dispatch("auth/refreshToken", token);
              TokenService.updateLocalAccessToken(token);
              return Axios(originalConfig);
            }
          } catch (_error) {
            EventBus.dispatch("logout");
            return Promise.reject(_error);
          }
        }
      }
      return Promise.reject(err);
    }
  );
};
export default setup;
