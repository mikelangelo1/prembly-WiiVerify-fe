import AuthService from "../webServices/auth.service";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = user
  ? { status: { loggedIn: true }, userData: user }
  : { status: { loggedIn: false }, userData: null };

export const authModule = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        (user) => {
          // in case of 2FA users
          if (user?.token) {
            commit("loginSuccess", user);
          }

          return Promise.resolve(user);
        },
        (error) => {
          commit("loginFailure");
          return Promise.reject(error);
        }
      );
    },
    loginOTP({ commit }, user) {
      return AuthService.loginOTP(user).then(
        (user) => {
          if (user?.token) {
            commit("loginSuccess", user);
          }
          return Promise.resolve(user);
        },
        (error) => {
          commit("loginFailure");
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit("logoutSuccess");
      localStorage.clear();
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        (response) => {
          commit("registerSuccess");
          return Promise.resolve(response.data);
        },
        (error) => {
          commit("registerFailure");
          return Promise.reject(error);
        }
      );
    },
    refreshToken({ commit }, accessToken) {
      commit("refreshToken", accessToken);
    },
  },
  getters: {
    getAuthUser(state) {
      return state.userData != null ? state.userData.user : user.user;
    },
  },
  mutations: {
    getProfileSuccess(state, user) {
      //
      let newUser = state.userData;
      newUser.user = user;
      localStorage.setItem("user", JSON.stringify(newUser));

      state.userData = user;
    },
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.userData = user.user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.userData = null;
    },
    refreshToken(state, accessToken) {
      state.status.loggedIn = true;
      state.user = { ...state.user, accessToken: accessToken };
    },
    logoutSuccess(state) {
      state.status.loggedIn = false;
      state.user = null;
      state = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
  },
};
