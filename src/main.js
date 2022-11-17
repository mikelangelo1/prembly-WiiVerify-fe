import { BootstrapVue, AlertPlugin } from "bootstrap-vue";
import Vue from "vue";
import PerfectScrollbar from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import Toast from "vue-toastification";

import App from "./App.vue";
import "./assets/css/custome.css";
import "./assets/css/popup.css";
import "./assets/css/style.css";
import "./assets/css/inputTel.css";
import "./assets/scss/cycopay.scss";
import "vue-toastification/dist/index.css";
import VueTelInput from "vue-tel-input";
import CountryFlag from "vue-country-flag";
import Vuelidate from "vuelidate";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import OtpInput from "@bachdgvn/vue-otp-input";

import VueCompositionAPI from "@vue/composition-api";

// import VueToast from 'vue-toast-notification';
// import 'vue-toast-notification/dist/theme-sugar.css';

import setupInterceptors from "./plugins/setupInterceptors";
import store from "./store/index";
import { getRouterWithStore } from "./router.js";

const options = {
  confirmButtonColor: "#41b882",
  cancelButtonColor: "#ff7674",
};

const toastOptions = {
  // You can set your default options here
};

Vue.use(Toast, toastOptions);
Vue.component("country-flag", CountryFlag);

Vue.use(AlertPlugin);
Vue.use(VueTelInput);
Vue.use(Vuelidate);
Vue.use(BootstrapVue);
Vue.use(PerfectScrollbar);
Vue.use(VueCompositionAPI);
Vue.use(VueSweetalert2, options);

Vue.component("v-otp-input", OtpInput);
// Vue.use(VueToast);

Vue.config.productionTip = false;

setupInterceptors(store);

const { mainStore, router } = getRouterWithStore({
  mainStore: store,
});

new Vue({
  store: mainStore,
  router,
  render: (h) => h(App),
}).$mount("#app");
