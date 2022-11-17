<template>
  <auth-layout>
    <template v-slot:sidebar>
      <div class="d-flex">
        <!-- ROunded steps -->
        <div class="mx-4">
          <h4 class="fs-2 fw-3">Verification</h4>
          <div class="mb-5">
            <p class="animateColor text-primary">VERIFY YOUR EMAIL</p>
            <small class="animateColor">
              In order to receive access to the dashboard, verify your email.
              Check the OTP code we have sent and input it.
            </small>
          </div>
        </div>
      </div>
    </template>
    <div class="auth-form card">
      <div class="bg-white">
        <form class="identity-upload">
          <div class="identity-content">
            <p>
              We sent verification code to your email
              <strong class="text-dark">{{ $route.params.email }}</strong
              >. Please input the code to get started
            </p>
            <div
              v-if="formValue.otp.errorMessage"
              class="alert alert-danger text-left"
            >
              {{ formValue.otp.errorMessage }}
            </div>
            <div v-if="submitError" class="alert alert-danger text-left">
              {{ submitError }}
            </div>
            <div
              class="otp_display d-flex justify-content-center"
              style="margin-bottom: 8px"
            >
              <v-otp-input
                ref="otpInput"
                input-classes="otp-verify"
                separator="-"
                :num-inputs="6"
                :should-auto-focus="true"
                :is-input-num="true"
                @on-change="handleOnChange"
                @on-complete="handleComplete"
              />
            </div>
            <!-- <div

              class="col-12"
            >
              <label class="form-label">OTP</label>
              <input
                type="number"
                class="form-control"
                :class="{
                  'has-error': formValue.otp.errorMessage || submitError,
                }"
                placeholder=""
                name="otp"
                v-model="formValue.otp.value"
                @input="handleTextChange($event, 'otp')"
              />

            </div> -->
            <div class="my-4">
              <button
                v-show="loading"
                type="submit"
                class="btn btn-primary py-2"
              >
                <b-spinner
                  variant="light"
                  style="width: 1rem; height: 1rem; margin-left: 10px"
                ></b-spinner>
              </button>
            </div>
          </div>
        </form>
      </div>
      <div class="text-center">
        <a
          target="_blank"
          style="margin-right: 40px"
          class="c-link c-button-unstyled margin_right_250 p-get_started__email_app_link"
          href="https://mail.google.com/mail/u/0/"
          rel="noopener noreferrer"
          ><img
            class="margin_right_50"
            alt=""
            srcset="
              https://a.slack-edge.com/bv1-9/get-started-icon-gmail-b3b3a57.png,
              https://a.slack-edge.com/bv1-9/get-started-icon-gmail@2x-e80b706.png 2x
            " />
          Open Gmail<span aria-label="(opens in new tab)"></span
        ></a>
        <a
          target="_blank"
          class="c-link c-button-unstyled p-get_started__email_app_link"
          href="https://outlook.live.com/mail/0/inbox"
          rel="noopener noreferrer"
          ><img
            class="margin_right_50"
            alt=""
            srcset="
              https://a.slack-edge.com/bv1-9/get-started-icon-outlook-55f9ac5.png,
              https://a.slack-edge.com/bv1-9/get-started-icon-outlook@2x-4cc97d5.png 2x
            " />
          Open Outlook<span aria-label="(opens in new tab)"></span
        ></a>
        <p class="hint">Can't find your code? Check your spam folder!</p>
      </div>
    </div>
    <!-- <b-modal ref="my-modal" hide-footer title="Signup Successful">
      <div class="d-block text-center">
        <h3>Your Account has been created successfully</h3>
      </div>
    </b-modal> -->
  </auth-layout>
</template>

<script>
import AuthLayout from "../../components/layouts/AuthLayouts.vue";
import validator from "validator";
import axios from "../../plugins/axios";
import { capitalize } from "../../utils/strings";

export default {
  components: { AuthLayout },
  data: function () {
    return {
      formValue: {
        otp: {
          value: undefined,
          errorMessage: undefined,
          valid: false,
        },
      },
      submitError: undefined,
      loading: false,
    };
  },
  methods: {
    handleTextChange(event, key) {
      let value = event?.target?.value?.trim();

      if (value == "" || !value) {
        this.formValue[key].errorMessage = capitalize(`${key} cannot be empty`);
        this.formValue[key].valid = false;
      } else {
        this.formValue[key].value = value;
        this.formValue[key].errorMessage = undefined;
        this.formValue[key].valid = true;
      }
    },
    handleOnChange(e) {
      this.formValue.otp.value = e;
    },
    handleComplete(val) {
      this.formValue.otp.value = val;
      this.formSubmit();
    },
    formSubmit() {
      // this.$router.push("/verify-step-2");
      this.loading = true;
      const data = {
        otp: this.formValue.otp.value,
        email: this.$route.params.email,
        verification_key: this.$route.params.verification_key,
      };

      console.log("submit data ", data);

      axios
        .post("verify-email/verify/otpemail", data)
        .then((res) => {
          this.showSuccessModal();
          this.loading = false;
          this.submitError = undefined;
        })
        .catch((error) => {
          this.loading = false;
          this.$toast.error(error?.response?.data);
          if (error?.response?.data) {
            this.submitError = error?.response?.data?.details;
            return;
          }
          this.submitError = "Error encountered while verifying email";
        });
    },
    showSuccessModal() {
      // this.$refs["my-modal"].show();

      setTimeout(() => {
        // this.$router.push({ name: "Signin" });
        const loginDetails = {
          email: this.$route.params.email,
          password: this.$route.params.password,
        };
        this.loading = true;

        this.$store.dispatch("auth/login", loginDetails).then((res) => {
          this.loading = false;

          this.$router.push("/").catch((err) => {
            console.log("error navigationg ", err);
          });
        });
      }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-form.card {
  max-width: 600px;
  margin: 0 auto;
}
</style>

<style>
.otp-verify {
  width: 3.5rem;
  height: 3.5rem;
  padding: 5px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
}

@media screen and (max-width: 980px) {
  .otp-input {
    width: 5rem;
    height: 5rem;
  }
  .otp_display {
    justify-content: center;
  }
}

@media screen and (max-width: 820px) {
  .otp-input {
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>
