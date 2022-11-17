<template>
  <auth-layout :title="'Forgot Password'" class="sign-in">
    <div class="auth-form card">
      <div class="card-body">
        <form
          method="post"
          name="myform"
          class="signin_validate row g-3"
          @submit.prevent="formSubmit"
        >
          <div class="col-12">
            <label class="form-label">Reset OTP</label>
            <input
              type="number"
              class="form-control"
              :class="{ 'has-error': v$.form.token.$errors.length }"
              placeholder="345645"
              name="token"
              v-model="v$.form.token.$model"
            />
            <div
              class="input-errors"
              v-for="(error, index) of v$.form.token.$errors"
              :key="index"
            >
              <div class="error-msg" style="color: red">
                {{ messages.token[error.$validator] }}
              </div>
            </div>
          </div>
          <div class="col-12">
            <label class="form-label">New Password</label>
            <input
              type="password"
              class="form-control"
              :class="{ 'has-error': v$.form.password.$errors.length }"
              placeholder="********"
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

          <div class="d-grid gap-2">
            <button
              :disabled="loading"
              type="submit"
              class="btn btn-primary auth-btn"
            >
              Submit
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
    <div class="privacy-link text-center mt-4">
      <a href="https://cycopay.com/company/privacy-policy">Privacy Policy</a>
    </div>
  </auth-layout>
</template>

<style module>
.errorMessage {
  color: red;
}
</style>
<script>
import AuthLayout from "../../components/layouts/AuthLayouts.vue";
import axios from "../../plugins/axios";
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

export default {
  components: { AuthLayout },
  setup() {
    return { v$: useVuelidate() };
  },
  data: function () {
    return {
      submitErrorHtml: undefined,
      loading: false,
      form: {
        token: "",
        password: "",
      },
      remember: false,
      messages: {
        token: {
          required: "Reset token is required",
          maxLength: "Please enter a valid reset token",
        },
        password: {
          required: "Password is required",
          minLength: "Password must be at least 8 characters",
        },
      },
    };
  },
  methods: {
    formSubmit() {
      const data = {
        otp: this.form.token,
        password: this.form.password,
        verification_key: this.$route.params?.verification_key,
        email: this.$route.params?.email,
      };

      this.loading = true;

      axios
        .post("v1/merchant/password/reset", data)
        .then((res) => {
          this.submitError = undefined;
          this.loading = false;

          setTimeout(() => {
            this.$swal.fire({
              icon: "success",
              title: "Successful",
              text:
                res.data.message ||
                "Password reset token has been sent to your email address",
            });

            const loginDetails = {
              email: this.$route.params.email,
              password: this.form.password,
            };
            this.loading = true;

            this.$store.dispatch("auth/login", loginDetails).then((res) => {
              this.loading = false;

              this.$router.push("/").catch((err) => {
                console.log("error navigationg ", err);
              });
            });
          }, 1200);
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
  },

  validations() {
    return {
      form: {
        token: {
          required,
          maxLength: maxLength(6),
        },
        password: {
          required,
          minLength: minLength(8),
        },
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
