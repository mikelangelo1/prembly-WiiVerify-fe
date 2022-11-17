<template>
  <auth-layout :title="'Reset your password'" :colXl4="true">
    <template v-slot:sidebar>
      <div class="d-flex">
        <!-- ROunded steps -->
        <div class="mx-4">
          <h4 class="fs-2 fw-3">Hey ✋</h4>
          <div class="mb-5">
            <p class="animateColor text-primary">BASIC INFO</p>
            <small class="animateColor"> Let's onboard you now! </small>
          </div>
          <div class="mt-5">
            <p class="animateColor text-grey">ACCOUNT REQUIREMENT</p>
            <small class="animateColor text-grey">
              This stage requires the your email and for number for the account
              creation.
            </small>
          </div>
          <div class="mt-5">
            <p class="animateColor text-grey">BUSINESS SETUP</p>
            <small class="animateColor text-grey">
              Choose a category for your business
            </small>
          </div>
        </div>
      </div>
    </template>
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="formSubmit" class="">
          <div class="col-12">
            <label class="form-label">Enter Email</label>

            <input
              autofocus
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
            <div v-bind:class="$style.errorMessage">
              {{ submitErrorHtml }}
            </div>
          </div>
          <div class="text-center mt-4">
            <button
              :disabled="loading"
              type="submit"
              class="btn btn-primary btn-block"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
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
import { required, email, minLength, maxLength } from "@vuelidate/validators";

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
        email: "",
      },
      messages: {
        email: {
          required: "Email is required",
          email: "Please enter a valid email",
        },
      },
    };
  },
  methods: {
    formSubmit() {
      const data = {
        email: this.form.email,
      };

      this.loading = true;

      axios
        .post("v1/merchant/password/request-reset", data)
        .then((res) => {
          this.submitError = undefined;
          this.loading = false;

          const routeParams = {
            verification_key: res?.data?.verification_key,
            email: this.form.email,
          };

          setTimeout(() => {
            this.$swal.fire({
              icon: "success",
              title: "Successful",
              text:
                res.data.message ||
                "Password reset token has been sent to your email address",
            });

            this.$router
              .push({
                name: "ForgotPassword",
                params: routeParams,
              })

              .catch((err) => {
                console.log("error navigating ", err);
              });
          }, 1200);
        })
        .catch((error) => {
          this.loading = false;

          let errors = [];
          if (error?.response?.data?.errors) {
            errors = error?.response?.data?.errors?.map((err) => err?.msg);
          } else {
            errors = [error?.response?.data?.message];
          }

          let errorText = "";
          errors?.forEach((errText) => {
            errorText = `${errText}\n`;
          });

          this.submitErrorHtml = errorText;
        });
    },
  },

  validations() {
    return {
      form: {
        email: { required, email },
      },
    };
  },
};
</script>
