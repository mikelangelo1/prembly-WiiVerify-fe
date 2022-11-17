<template>
  <div>
    <div class="row">
      <div class="col-xl-12">
        <!-- <div class="mb-0 pb-0" :class="$style.border_warning">
          <h5 class="">Payout Fee</h5>
          <p>
            Bank accounts outside the EU will require a Payout fee of
            <b>$15 USD</b>.
          </p>
        </div> -->
        <div class="">
          <div class="card-header">
            <div class="btn-group"></div>
          </div>
          <div class="card-body">
            <form
              method="post"
              class="invoice-form"
              name="my-invoice"
              @submit.prevent="formSubmit"
            >
              <div
                class="alert alert-danger"
                v-show="submitErrorHtml"
                v-html="submitErrorHtml"
              ></div>
              <div class="row">
                <div class="col-xl-12">
                  <div class="mb-3">
                    <label class="form-label">Amount (USD)</label>
                    <input
                      type="number"
                      placeholder="25.00"
                      class="form-control"
                      v-model="formValue.amount.value"
                      ref="focusMe"
                    />
                  </div>

                  <div :class="$style.errorMessage">
                    {{ formValue.amount.errorMessage }}
                  </div>
                </div>
                <div class="col-xl-12">
                  <div class="mb-3">
                    <label class="form-label">Description</label>
                    <input
                      type="text"
                      placeholder="Provided a web service."
                      class="form-control"
                      v-model="description"
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
              <div class="d-grid">
                <button
                  :disabled="loading"
                  class="btn btn-primary auth-btn"
                  type="submit"
                >
                  Create
                  <b-spinner
                    variant="light"
                    style="width: 1rem; height: 1rem; margin-left: 20px"
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
}
.border_warning {
  font-size: 11px;
  border: 1px solid #ccc;
  border-left-width: 5px;
  border-left-style: solid;
  border-left-color: #dba618;
  background: #fff;
  padding: 0.5rem 1rem;
  margin: 0 1rem;
  margin-bottom: 2rem;
}
</style>

<script>
// Watchers
let keysToWatch = ["description"];

let watchers = {};
keysToWatch.forEach((key) => {
  watchers[key] = function (newVal, previousVal) {
    this.checkFormCompleteness();
  };
});

import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
import validator from "validator";
import axios from "../../plugins/axios";
export default {
  components: { DashboardLayout },
  data: function () {
    return {
      getPaymentDataError: undefined,
      submitError: undefined,
      formComplete: false,
      formValue: {
        amount: {
          value: "",
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
      },
      description: "",

      //
      formComplete: false,
      submitErrorHtml: undefined,
      loading: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.$refs.focusMe.focus();
    }, 100);
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
        amount: this.formValue.amount.value,
        description: this.description,
      };

      this.loading = true;

      axios
        .post("v1/merchant/stripe/payout", data, config)
        .then((res) => {
          this.submitError = undefined;
          this.loading = false;

          // reset values
          this.formValue.amount.value = 0;
          this.description = undefined;

          // this.$swal.fire({
          //   icon: "success",
          //   title: "Successful",
          //   text: res.data.message || "Your payout request has been received",
          // });
          this.$toast.success(
            res.data.message || "Your payout request has been received"
          );
        })
        .catch((error) => {
          this.loading = false;
          // console.log(error);
          let errors = error?.response?.data
            ? error?.response?.data?.errors
            : ["Error encountered during payout request"];

          let errorText = "";

          errors?.forEach((errText) => {
            errorText = `${errorText} ${errText?.msg} <br>`;
          });
          this.submitErrorHtml = errorText;
          console.log(errorText);

          // this.$swal?.fire({
          //   text:
          //     errorText ||
          //     error?.response?.data?.message ||
          //     "Error encountered during request submission",
          //   icon: "error",
          // });
          this.$toast.error(
            errorText ||
              error.response.data.message ||
              "Error encountered during request submission"
          );
        });
    },
    checkFormCompleteness() {
      let formValid = true;

      // check vue data
      let dataKeys = ["description"];

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
    resetForm() {
      this.description = undefined;
      this.formValue.amount.value = undefined;
    },
  },

  watch: {
    ...watchers,
  },
};
</script>
