import axios from "../plugins/axios";

import TokenService from "./token.service";

class AuthService {
  login(user) {
    return axios
      .post("v1/merchant/login", {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (response.data.token) {
          TokenService.setUser({
            ...response.data,
            rememberMe: user?.rememberMe,
          });
        }
        return response.data;
      });
  }
  loginOTP(user) {
    return axios.post("v1/merchant/2FA/login", user).then((response) => {
      if (response.data?.token) {
        TokenService.setUser({
          ...response?.data,
          rememberMe: user?.rememberMe,
        });
      }
      return response.data;
    });
  }
  logout() {
    TokenService.removeUser();
  }
  register(user) {
    return axios.post("v1/merchant/signup", {
      ...user,
    });
  }
}
export default new AuthService();
