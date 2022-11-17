import AuthService from "../webServices/auth.service";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = user
  ? { status: { loggedIn: true }, profile: user }
  : { status: { loggedIn: false }, profile: null };

export const userModule = {
  namespaced: true,
  state: initialState,
  mutations: {
    getProfileSuccess(state, user) {
      //
      let newUser = state.userData;
      newUser.user = user;
      localStorage.setItem("user", JSON.stringify(newUser));

      state.userData = user;
    },
  },
};
