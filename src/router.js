import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

// Demo
import Demo from "./views/Demo.vue";

// Auth
import Signin from "./views/auth/Signin.vue";
import EmailVerification from "./views/auth/EmailVerification.vue";
import Reset from "./views/auth/Reset.vue";
import ForgotPassword from "./views/auth/ForgotPassword.vue";
import Signup from "./views/auth/Signup.vue";
import Step1 from "./views/auth/Step-1.vue";
import TwoFactorLogin from "./views/auth/TwoFaLogin.vue";

// Dashboard
import Index from "./views/dashboard/Index.vue";
import CreateInvoice from "./views/dashboard/CreateInvoice.vue";
import Invoice from "./views/dashboard/Invoice.vue";
import Notification from "./views/dashboard/Notification.vue";
import Payment from "./views/dashboard/Payment.vue";
import Wallet from "./views/dashboard/Wallet.vue";
import Profile1 from "./views/dashboard/Profile.vue";
import TwoFARequest from "./views/dashboard/2FARequest.vue";

// Settings
import Profile from "./views/dashboard/settings/Profile.vue";
import API from "./views/dashboard/settings/API.vue";
// import Activity from "./views/dashboard/settings/Activity";
import PaymentMethod from "./views/dashboard/settings/PaymentMethod.vue";
import Security from "./views/dashboard/settings/Security.vue";
import VerifyDocument from "./views/dashboard/VerifyDocument.vue";
//
import AddCard from "./views/dashboard/AddCard.vue";
import Onboarding from "./views/dashboard/Onboarding.vue";
import AddBank from "./views/dashboard/AddBank.vue";
import VerifyAccount from "./views/dashboard/VerifyAccount.vue";

//
import requestPayout from "./views/dashboard/Payout.vue";
//
import store from "./store";

const routes = [
  // Settings
  {
    path: "/settings-payment-method",
    name: "PaymentMethod",
    component: PaymentMethod,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/settings-api",
    name: "API",
    component: API,
    meta: {
      requiresAuth: true,
    },
  },
  // {
  //   path: "/settings-activity",
  //   name: "Activity",
  //   component: Activity,
  //   meta: {
  //     requiresAuth: true,
  //   },
  // },
  {
    path: "/settings-security",
    name: "Security",
    component: Security,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/settings-profile",
    name: "Profile",
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },
  // Dashboard
  {
    path: "/profile",
    name: "Profile1",
    component: Profile1,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/balance",
    name: "Wallet",
    component: Wallet,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/bill",
    name: "Payment",
    component: Payment,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/notification",
    name: "Notification",
    component: Notification,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/invoice",
    name: "Invoice",
    component: Invoice,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/create-invoice",
    name: "CreateInvoice",
    component: CreateInvoice,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/",
    name: "Index",
    component: Index,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/upload",
    name: "VerifyDocument",
    component: VerifyDocument,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/verify-account",
    name: "VerifyAccount",
    component: VerifyAccount,
    meta: {
      requiresAuth: true,
    },
  },
  //
  {
    path: "/add-card",
    name: "AddCard",
    component: AddCard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/add-bank",
    name: "AddBank",
    component: AddBank,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/Onboarding",
    name: "Onboarding",
    component: Onboarding,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/request-payout",
    name: "requestPayout",
    component: requestPayout,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/twofactor-request",
    name: "TwoFARequest",
    component: TwoFARequest,
    meta: {
      requiresAuth: true,
    },
  },

  //
  // Demo
  {
    path: "/demo",
    name: "Demo",
    component: Demo,
  },
  //
  // auth
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/reset",
    name: "reset",
    component: Reset,
  },
  {
    path: "/reset-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/otp-1",
    name: "Step1",
    component: Step1,
  },
  {
    path: "/twofactor-login",
    name: "TwoFactorLogin",
    component: TwoFactorLogin,
  },
  {
    path: "/verify-email",
    name: "EmailVerification",
    component: EmailVerification,
  },
];

const router = new VueRouter({
  mode: "history",
  base: "https://swift-pay.onrender.com/",
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = store.state.user?.status?.loggedIn;

  let isAuth = to?.meta?.requiresAuth;

  let loggedOutRoutes = ["EmailVerification", "signup", "signin"];
  let isNotAuth = loggedOutRoutes.some((route) => {
    let match = route?.toLowerCase() == to?.name?.toLowerCase();
    return match;
  });

  if (!loggedIn && isAuth) {
    return next({
      path: "/signin",
      query: { redirect: to.fullPath },
    });
  }

  // if user is logged out, whenever he tries to navigate to these screens, redirect to dashboard

  if (loggedIn && isNotAuth) {
    return next("/");
  }
  next();
});

export const getRouterWithStore = ({ mainStore }) => {
  const router = new VueRouter({
    mode: "history",
    base: "http://localhost:5000/",
    routes,
  });

  router.beforeEach((to, from, next) => {
    const loggedIn = mainStore.state.auth?.status?.loggedIn;

    let isAuth = to?.meta?.requiresAuth;

    let loggedOutRoutes = ["EmailVerification", "signup", "signin"];
    let isNotAuth = loggedOutRoutes.some((route) => {
      let match = route?.toLowerCase() == to?.name?.toLowerCase();
      return match;
    });

    if (!loggedIn && isAuth) {
      return next({
        path: "/signin",
        query: { redirect: to.fullPath },
      });
    }

    // if user is logged out, whenever he tries to navigate to these screens, redirect to dashboard

    if (loggedIn && isNotAuth) {
      return next("/");
    }
    next();
  });

  return {
    router,
    mainStore,
  };
};

export default router;
