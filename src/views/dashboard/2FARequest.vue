<template>
  <dashboard-layout :pageName="'Two Factor Authentication'">
    <div class="auth-form card">
      <div class="card-body">
        <h3 class="text-center">
          An 6 digit code was just sent to your mobile number
        </h3>

        <form
          method="post"
          name="myform"
          class="signin_validate row g-3"
          @submit.prevent="formSubmit"
        >
          <!-- <div class="col-12">
            <label class="form-label">OTP</label>
            <input
              type="number"
              class="form-control"
              placeholder="345645"
              name="otp"
              v-model="otp"
            />
          </div>
          <div class="d-grid gap-2">
            <button
              :disabled="loading || !otp"
              @click="formSubmit()"
              class="btn btn-primary auth-btn"
            >
              Submit
            </button>
            <div style="text-align: center"></div>
          </div> -->
          <div class="otp_display d-flex justify-content-center">
            <v-otp-input
              ref="otpInput"
              input-classes="otp-input"
              separator="-"
              :num-inputs="6"
              :should-auto-focus="true"
              :is-input-num="true"
              @on-change="handleOnChange"
              @on-complete="handleComplete"
            />
          </div>
          <div class="text-center">
            You did not get the code?
            <a
              href="#"
              :disabled="loading"
              @click.prevent="resendRequest()"
              class="btn-none mx-2"
            >
              Resend
            </a>
          </div>
        </form>
      </div>
    </div>
  </dashboard-layout>
</template>

<style lang="scss">
.errorMessage {
  color: red;
}
.otp-input {
  width: 5.5rem;
  height: 5.5rem;
  padding: 5px;
  margin: 0 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
  &.error {
    border: 1px solid red !important;
  }
}
.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.otp_display {
  display: flex;
  flex-wrap: wrap;
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

<script>
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";

import UserService from "../../webServices/user.service";

export default {
  components: { DashboardLayout },
  data: function () {
    return {
      otp: undefined,
      loading: false,
      verification_key: undefined,
    };
  },
  mounted() {
    this.loading = true;
    UserService.request2FA()
      .then((res) => {
        this.loading = false;

        this.verification_key = res?.data?.verification_key;
      })
      .catch((error) => {
        this.loading = false;

        this.$swal?.fire({
          text:
            error?.response?.data?.message ||
            error.message ||
            "Error occured requesting OTP",
          icon: "failure",
        });
      });
  },
  methods: {
    handleComplete(val) {
      this.formValue.otp.value = val;
      this.formSubmit();
    },
    resendRequest() {
      this.loading = true;
      UserService.request2FA()
        .then((res) => {
          this.loading = false;
          this.$swal?.fire({
            text: "Request Resent",
            icon: "success",
            buttonsStyling: false,
          });

          this.verification_key = res?.data?.verification_key;
        })
        .catch((error) => {
          this.loading = false;

          this.$swal?.fire({
            text:
              error?.response?.data?.message ||
              error.message ||
              "Error occured requesting OTP",
            icon: "failure",
          });
        });
    },
    handleOnChange(e) {
      this.otp = e;
    },
    formSubmit() {
      const data = {
        verification_key: this.verification_key,
        otp: this.otp,
      };

      this.loading = true;
      UserService.verify2FA(data)
        .then((res) => {
          this.loading = false;

          this.$swal?.fire({
            text: "Two Factor authentication enabled successfully",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn fw-bold btn-light-primary",
            },
          });

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
              error.message ||
              "Error occured submitting OTP",
            icon: "failure",
          });
        });
    },
  },
};
</script>
