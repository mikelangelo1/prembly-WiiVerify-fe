<template>
  <auth-layout :title="'Confirm by SMS code'" :alert="true">
    <div class="auth-form card">
      <div class="card-body">
        <p class="text-center mb-3">
          Enter the verification code sent to your phone
        </p>
        <form @submit.prevent="formSubmit" class="row g-3">
          <div class="col-12">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="ri-smartphone-line"></i>
                </span>
              </div>
              <input
                type="text"
                v-model="otp"
                class="form-control"
                placeholder="123456"
              />
            </div>
          </div>
          <div class="col-12">
            <div class="text-center">
              <button type="submit" class="btn btn-primary btn-block">
                Submit
              </button>
            </div>
          </div>
        </form>
        <!-- <div class="new-account mt-3">
          <p>
            Didn't get a code?
            <router-link class="text-primary" to="otp-1">Resend</router-link>
          </p>
        </div> -->
      </div>
    </div>
  </auth-layout>
</template>

<script>
import AuthLayout from "../../components/layouts/AuthLayouts.vue";
import UserService from "../../webServices/user.service";

export default {
  components: { AuthLayout },
  data: function () {
    return {
      otp: undefined,
      loading: false,
      verification_key: undefined,
    };
  },
  mounted() {
    console.log("this.$route?.params ", this.$route?.params);
  },
  methods: {
    formSubmit() {
      const data = {
        verification_key: this.$route?.params?.verification_key,
        otp: this.otp,
        rememberMe: this.$route?.params?.rememberMe,
        email: this.$route?.params?.email,
      };

      this.loading = true;
      this.$store
        .dispatch("auth/loginOTP", data)
        .then((res) => {
          this.loading = false;

          setTimeout(() => {
            this.$router?.push({
              path: "/",
            });
          }, 2000);
        })
        .catch((error) => {
          this.loading = false;

          this.$swal?.fire({
            text:
              error?.response?.data?.message ||
              error?.message ||
              "Error occured submitting OTP",
            icon: "failure",
          });
        });
    },
  },
};
</script>
