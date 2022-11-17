<template>
  <div
    class="sign-in d-flex align-items-center justify-content-center flex-column custom-image"
    :class="$style.height"
  >
    <div class="auth-form card">
      <div class="card-body">
        <h3 class="sign-in card-special-title mb-4 sign-in-title">
          Sign in to your account
        </h3>
        <p class="mt-2 mb-4">
          Don't have an account?
          <router-link class="text-primary" to="signup">Sign up</router-link>
        </p>
        <form
          method="post"
          name="myform"
          class="signin_validate row g-3"
          @submit.prevent="formSubmit"
        >
          <div class="col-12">
            <label class="form-label">Email</label>
            <input
              ref="focusMe"
              type="email"
              class="form-control"
              :class="{ 'has-error': v$.form.email.$errors.length }"
              name="email"
              v-model="v$.form.email.$model"
            />
            <div
              class="input-errors"
              v-for="(error, index) of v$.form.email.$errors"
              :key="index"
            >
              <div class="error-msg" style="color: red">
                {{ messages.email[error.$validator] }}
              </div>
            </div>
          </div>
          <div class="Box-root Padding-top--32" style="padding-top: -3px"></div>
          <div class="col-12">
            <label class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              :class="{ 'has-error': v$.form.password.$errors.length }"
              name="password"
              v-model="v$.form.password.$model"
            />
            <div
              class="input-errors"
              v-for="(error, index) of v$.form.password.$errors"
              :key="index"
            >
              <div class="error-msg" style="color: red">
                {{ messages.password[error.$validator] }}
              </div>
            </div>
          </div>
          <div class="col-6 mt-4">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
                v-model="remember"
              />
              <label class="form-check-label" for="flexSwitchCheckDefault"
                >Remember me</label
              >
            </div>
          </div>

          <div class="col-6 text-end mt-4">
            <router-link to="reset">Forgot your Password?</router-link>
          </div>
          <div class="d-grid gap-2">
            <button
              :disabled="loading"
              type="submit"
              class="btn btn-success auth-btn"
            >
              Continue
            </button>
            <div
              style="text-align: center"
              v-html="submitErrorHtml"
              :class="$style.errorMessage"
            ></div>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<style module>
.errorMessage {
  color: red;
}
.height {
  height: 100vh;
}
</style>

<script src="https://cdn.jsdelivr.net/npm/vue-tel-input@4.4.0/dist/vue-tel-input.umd.js"></script>

<script>
import AuthLayout from "../../components/layouts/AuthLayouts.vue";

import useVuelidate from "@vuelidate/core";
import { required, email, minLength, maxLength } from "@vuelidate/validators";
import userService from "../../webServices/user.service";
export default {
  components: { AuthLayout },
  setup() {
    return { v$: useVuelidate() };
  },
  mounted() {
    setTimeout(() => {
      this.$refs.focusMe.focus();
    }, 100);
  },
  data: function () {
    return {
      submitErrorHtml: undefined,
      loading: false,
      form: {
        email: "",
        password: "",
      },
      remember: true,
      messages: {
        email: {
          required: "Email is required",
          email: "Please enter a valid email",
        },
        password: {
          required: "Password is required",
          minLength: "Password must be at least 6 characters",
        },
      },
    };
  },
  methods: {
    formSubmit() {
      this.signIn();

      //
    },
    async signIn() {
      const data = {
        email: this.form.email,
        password: this.form.password,
        rememberMe: this.remember,
      };

      this.$store
        .dispatch("auth/login", data)
        .then((res) => {
          this.loading = false;

          if (res?.user) {
            setTimeout(() => {
              this.$router.push("/").catch((err) => {
                console.log("error navigating ", err);
              });
            }, 2000);
            this.$toast.success("Successfully logged in", {
              timeout: 2000,
            });
          }
          if (res?.verification_key) {
            this.$router.push({
              name: "TwoFactorLogin",
              params: {
                verification_key: res?.verification_key,
                rememberMe: this.remember,
                email: this.form.email,
              },
            });
          }
        })
        .catch((error) => {
          this.loading = false;
          let errors = error?.response?.data
            ? error?.response?.data?.errors
            : ["Error encountered in signup"];
          let errorText = "";
          errors.forEach((errText) => {
            errorText = `${errorText}<div>${
              errText?.msg ? errText?.msg : errText?.message
            }</div>`;
          });
          this.submitErrorHtml = errorText;
        });
    },
    async recaptcha() {
      // (optional) Wait until recaptcha has been loaded.
      await this.$recaptchaLoaded();

      // Execute reCAPTCHA with action "login".
      const token = await this.$recaptcha("login");
      console.log("token", token);

      // Do stuff with the received token.
    },
  },
  validations() {
    return {
      form: {
        email: { required, email },
        password: { required },
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.auth-form.card {
  max-width: 600px;
  margin: 0 auto;
}
</style>
