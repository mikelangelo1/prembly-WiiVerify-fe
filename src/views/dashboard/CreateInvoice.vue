<template>
  <div>
    <div>
      <b-alert show variant="warning" v-if="!isVerified">
        <h4 class="alert-heading">NOTE!</h4>
        <p v-if="isVerified == null">
          You must complete all steps of account verification before creating an
          invoice. Click
          <router-link to="/verify-account"> here</router-link> to get verified.
        </p>
        <hr />
      </b-alert>
      <div
        style="text-align: center"
        v-html="submitErrorHtml"
        v-show="submitErrorHtml"
        class="alert alert-danger"
        :class="$style.errorMessage"
      ></div>
      <div class="col-12">
        <div class="bg-white">
          <div v-if="isVerified" class="card-body">
            <form
              method="post"
              class="invoice-form"
              name="my-invoice"
              @submit.prevent="formSubmit"
              v-if="isVerified"
            >
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input
                      ref="focusMe"
                      type="text"
                      placeholder="Web Service"
                      class="form-control"
                      v-model="name"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Amount (USD)</label>
                    <input
                      type="number"
                      placeholder="5.00"
                      step=".01"
                      class="form-control"
                      v-model="formValue.amount.value"
                      required
                    />
                  </div>

                  <div :class="$style.errorMessage">
                    {{ formValue.amount.errorMessage }}
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Description</label>
                    <input
                      type="text"
                      placeholder="Provided a web service."
                      class="form-control"
                      v-model="description"
                      required
                    />
                  </div>
                </div>
              </div>
              <hr />
              <div class="row"></div>
              <div class="row">
                <div class="mb-3 col-xl-6"></div>
                <div class="col-1"><span></span></div>
              </div>
              <div class="add-reset d-flex justify-content-between">
                <button
                  :disabled="loading"
                  class="btn btn-primary d-flex justify-content-center align-items-center auth-btn"
                  type="submit"
                >
                  <span><i class="bi bi-plus"></i></span>Create

                  <b-spinner
                    variant="light"
                    style="width: 1rem; height: 1rem; margin-left: 10px"
                    v-show="loading"
                  ></b-spinner>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.errorMessage {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>

<script>
// Watchers
let keysToWatch = ["name", "description"];

let watchers = {};
keysToWatch.forEach((key) => {
  watchers[key] = function (newVal, previousVal) {
    this.checkFormCompleteness();
  };
});
import moment from "moment";
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
import validator from "validator";
import axios from "../../plugins/axios";

import Userservice from "../../webServices/user.service";
export default {
  components: { DashboardLayout },

  data: function () {
    return {
      getPaymentDataError: undefined,
      submitError: undefined,
      formComplete: false,
      getProfileError: undefined,
      profileData: undefined,
      countryName: undefined,
      dateJoined: moment().format("DD/MM/YYYY"),
      userData: {
        user: undefined,
      },
      formValue: {
        amount: {
          value: "",
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
      },
      name: "",
      description: "",
      //
      formComplete: false,
      submitErrorHtml: undefined,
      loading: false,
      //
      merchant: undefined,
      isVerified: undefined,
    };
  },
  mounted() {
    setTimeout(() => {
      this.$refs.focusMe.focus();
    }, 100);
    let user = this.$store.state.auth?.userData?.user;
    this.userData = this.$store.state.auth.userData;
    Userservice.getProfileData()
      .then((res) => {
        this.userData = {
          ...this.userData,
          user: res?.data?.profile,
        };
        if (res?.data?.profile?.firstName) {
          // update Vuex store for user data
          // this.$store.commit("user/getProfileSuccess", res?.data?.profile);
        }
        this.getProfileError = undefined;
        this.profileData = res?.data?.profile;
        this.countryName = I18nCountries.getName(
          this.profileData?.country,
          "en"
        );
        this.dateJoined = moment(this.profileData?.date).format("DD/MM/YYYY");
      })
      .catch((error) => {
        console.log("error getting profile ", error);
        this.getProfileError = "Error while retrieving profile data";
      });
    Userservice.getVerificationStatus().then((res) => {
      console.log(res.data);
      this.isVerified = res?.data?.user?.individual?.address?.website;
    });
  },

  methods: {
    handleTextChange(event, key) {
      let value = event?.target?.value?.trim();

      if (value == "" || !value) {
        this.formValue[key].errorMessage = `${key} cannot be empty`;
      }

      // Amount validation
      if (key == "amount") {
        if (!validator.isNumeric(value)) {
          this.formValue.amount.errorMessage = "Please input valid amount";
          this.formValue.amount.valid = false;
        } else if (value < 1) {
          this.formValue.amount.errorMessage =
            "Input an amount greater or equal to 1";
          this.formValue.amount.valid = false;
        } else {
          this.formValue.amount.errorMessage = undefined;
          this.formValue.amount.valid = true;
        }
      }
    },
    formSubmit() {
      const config = {
        headers: {
          "x-access-token": this.$store.state.auth?.userData?.token,
        },
      };

      const data = {
        statement_descriptor: this.name,
        amount: this.formValue.amount.value,
        description: this.description,
      };

      this.loading = true;

      axios
        .post(
          "v1.1/merchant/payment/initialize/create-payment-link",
          data,
          config
        )
        .then((res) => {
          this.submitError = undefined;
          this.loading = false;
          this.$emit("paymentLinks", "deji money");
          if (res?.data?.paymentLink) {
            // reset fields
            this.name = undefined;
            this.formValue.amount.value = undefined;
            this.description = undefined;

            this.copyToClipBoard(res?.data?.paymentLink);
            this.$toast.success("Created & copied to clipboard!", {
              timeout: 2000,
            });
          } else {
            this.$swal?.fire({
              text: res.data?.message || "Payment link not created",
              icon: "failure",
            });
          }
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);

          this.$swal?.fire({
            text:
              error?.response?.data?.message ||
              "Error encountered while creating invoice: " +
                error.response.data.error,
            icon: "failure",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn fw-bold btn-danger",
            },
          });
        });
    },
    copyToClipBoard(paymentLink) {
      navigator.clipboard.writeText(paymentLink);
    },
    checkFormCompleteness() {
      let formValid = true;

      // check vue data
      let dataKeys = ["name", "description"];

      dataKeys.forEach((key) => {
        if (!this[key] || this[key]?.trim() == "") {
          formValid = formValid && false;
        }
      });

      // check formValue object
      for (let key in this.formValue) {
        if (!this.formValue[key].valid) {
          formValid = formValid && false;
        }
      }

      this.formComplete = formValid;
    },
    async getCurrentlyLoginUser() {},
  },

  watch: {
    ...watchers,
  },
};
</script>
