<template>
  <div class="row gx-0 position-relative">
    <auth-layout>
      <template v-slot:sidebar>
        <div class="d-flex">
          <!-- ROunded steps -->
          <div
            class="px-3 mt-5 pt-2 translate"
            :class="{ translate_10: step_two, translate_20: step_three }"
          >
            <div :class="$style.dot_border">
              <span :class="$style.dot_bg"></span>
            </div>
          </div>
          <div class="mx-4">
            <h4 class="fs-2 fw-bold">Steps</h4>
            <div class="mb-5">
              <p
                class="animateColor"
                :class="{
                  'text-primary': step_one,
                  'text-grey': !step_one,
                }"
              >
                BASIC INFO
              </p>
              <small class="animateColor" :class="{ 'text-grey': !step_one }">
                Let's onboard you now!
              </small>
            </div>
            <div class="mt-5">
              <p
                class="animateColor"
                :class="{ 'text-primary': step_two, 'text-grey': !step_two }"
              >
                REQUIREMENTS
              </p>
              <small class="animateColor" :class="{ 'text-grey': !step_two }">
                This stage requires your email and your phone number for account
                creation
              </small>
            </div>
            <div class="mt-5">
              <p
                class="animateColor"
                :class="{
                  'text-primary': step_three,
                  'text-grey': !step_three,
                }"
              >
                BUSINESS SETUP
              </p>
              <small class="animateColor" :class="{ 'text-grey': !step_three }">
                You are now able to select a business category needed for the
                account.
              </small>
            </div>
          </div>
        </div>
      </template>
      <div>
        <div>
          <h4 class="fs-1 mb-1 fw-bold">Sign up</h4>
          <p class="mb-3">Create an account to start transacting daily.</p>
          <p
            class="h4"
            style="cursor: pointer"
            v-if="(!step_one && step_two) || (step_three && !step_two)"
            @click="goBack"
          >
            <b-icon-arrow-left variant="primary"></b-icon-arrow-left>
          </p>
        </div>
        <div class="">
          <form
            method="post"
            name="myform"
            class="signin_validate row g-3"
            @submit.prevent="formSubmit"
          >
            <div class="px-0" v-show="submitErrorHtml">
              <div class="alert alert-danger" v-html="submitErrorHtml"></div>
            </div>

            <!-- STEP ONE -->
            <div v-show="step_one">
              <div class="col-xxl-6 col-xl-6 col-lg-6 col-md-6 mb-3">
                <label class="form-label">Account type</label>
                <select
                  id="type"
                  v-model="business_type"
                  class="form-select"
                  name="businessType"
                >
                  <option value="">Select an Account Type</option>
                  <option
                    v-for="item in accountTypes"
                    v-bind:value="item.value"
                    :key="item.id"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </div>

              <div class="col-12 mb-4" v-show="business_type == 'company'">
                <label class="form-label">Company Name</label>
                <input
                  type="text"
                  class="form-control"
                  name="name"
                  v-model="companyName"
                />
                <div
                  class="input-errors"
                  v-for="(error, index) of v$.form.companyName.$errors"
                  :key="index"
                >
                  {{ error.$message }}
                </div>
              </div>
              <div v-show="business_type == 'individual'">
                <div class="col-xxl-12 col-xl-12 col-lg-12 col-md-12 mb-3">
                  <label class="form-label">First Name</label>
                  <input
                    type="text"
                    class="form-control py-4"
                    name="name"
                    v-model="firstName"
                    autofocus="true"
                    ref="focusMe"
                  />
                  <div
                    class="input-errors"
                    v-for="(error, index) of v$.form.firstName.$errors"
                    :key="index"
                  >
                    {{ error.$message }}
                  </div>
                </div>
                <div class="col-xxl-12 col-xl-12 col-lg-12 col-12 mb-3">
                  <label class="form-label">Last Name</label>
                  <input
                    type="text"
                    class="form-control py-4"
                    name="name"
                    v-model="lastName"
                  />
                  <div
                    class="input-errors"
                    v-for="(error, index) of v$.form.lastName.$errors"
                    :key="index"
                  >
                    <div class="error-msg" style="color: red">
                      {{ error.$message }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="">
                <button
                  class="btn btn-primary auth-btn"
                  :disabled="!stepOneButton"
                  @click.prevent="showNextStep"
                >
                  Continue
                </button>
              </div>
            </div>

            <div v-show="step_two">
              <div class="col-xxl-12 col-xl-12 col-lg-12 col-12 mb-4">
                <label class="form-label"
                  >{{ business_type == "company" ? "Company's" : "" }} Phone
                  Number</label
                >
                <vue-tel-input
                  style="background-color: #dfe3e7 !important"
                  ref="focusMeTwo"
                  class="form-control px-0"
                  name="phone"
                  v-model="phone"
                  mode="international"
                  v-bind="Props"
                ></vue-tel-input>
              </div>
              <div
                class="col-xxl-12 col-xl-12 col-lg-12 col-12 mb-3"
                v-show="business_type == 'individual'"
              >
                <label class="form-label">Date of Birth</label>
                <input
                  type="date"
                  class="form-control"
                  placeholder=""
                  name="dob"
                  v-model="dob"
                />
              </div>
              <div class="col-xxl-12 col-xl-12 col-lg-12 col-12 mb-3">
                <label class="form-label"
                  >{{
                    business_type == "company" ? "Company's" : ""
                  }}
                  Email</label
                >
                <input
                  @keyup.enter="showFinalStep"
                  type="email"
                  class="form-control py-4"
                  :class="{ 'has-error': formValue.email.errorMessage }"
                  name="email"
                  v-model="formValue.email.value"
                  @input="handleTextChange($event, 'email')"
                />
                <div class="input-errors">
                  {{ formValue.email.errorMessage }}
                </div>
              </div>

              <!-- <div class=" col-xxl-12 col-xl-12 col-lg-12 col-12 mb-4">
                <label class="form-label">Who is registering?</label>
                <div class="d-flex">
                  <b-form-group>
                    <b-form-radio-group v-model="business_type">
                      <b-form-radio value="individual" name="option" > Individual</b-form-radio>
                      <b-form-radio value="company" name="option" class="mx-2"> Company</b-form-radio>
                    </b-form-radio-group>
                  </b-form-group>
                </div>

                
              </div> -->

              <div class="">
                <button
                  class="btn btn-primary auth-btn"
                  v-on:keyup.enter="onEnter"
                  :disabled="!stepTwoButton"
                  @click.prevent="showFinalStep"
                  ref="sendReply"
                >
                  Final Step
                </button>
              </div>
            </div>

            <!-- STEP THREE -->

            <div v-show="step_three">
              <div class="col-12 mb-2">
                <label class="form-label">Password</label>
                <input
                  ref="focusMeThree"
                  type="password"
                  class="form-control"
                  :class="{ 'has-error': formValue.password.errors.length > 0 }"
                  name="password"
                  v-model="formValue.password.value"
                  @input="handleTextChange($event, 'password')"
                  @keyup.enter="trigger()"
                />
                <div
                  class="input-errors"
                  v-if="formValue.password.errors.length"
                >
                  {{ formValue.password.errors[0] }}
                </div>
              </div>
              <div class="col-xxl-12 col-xl-12 col-lg-12 mb-2">
                <label class="form-label">Country</label>
                <select v-model="country" class="form-select" name="country">
                  <option value="">Select a Country</option>
                  <option
                    v-for="item in countriesWithCode"
                    v-bind:value="item.countryCode"
                    :key="item.countryCode"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </div>
              <div class="col-xxl-12 col-xl-12 col-lg-12 mb-2">
                <label class="form-label">Business Category</label>
                <select
                  @keyup.enter="trigger()"
                  v-model="business_mcc"
                  class="form-select"
                  name="business_mcc"
                >
                  <option value="">Select a Business Type</option>
                  <option
                    v-for="item in BusinessMcc"
                    v-bind:value="item.code"
                    :key="item.code"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </div>
              <div class="col-12">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                    v-model="termsAgreed"
                  />
                  <label
                    class="form-check-label text-center"
                    for="flexSwitchCheckDefault"
                  >
                    I certify that I have read and agree to the
                    <a
                      href="#"
                      class="text-primary"
                      >Use Agreement</a
                    >
                    and
                    <a
                      href="#"
                      class="text-primary"
                      >Terms of Service</a
                    >.
                  </label>
                </div>
              </div>
              <div class="mb-4 mt-3">
                <button
                  :disabled="loading || !finalButton"
                  type="submit"
                  class="btn btn-primary auth-btn justify-content-center align-items-center mr-2"
                  ref="sendClick"
                >
                  Create your account
                  <b-spinner
                    variant="light"
                    style="width: 1rem; height: 1rem; margin-left: 10px"
                    v-show="loading"
                  ></b-spinner>
                </button>
              </div>
            </div>
          </form>
          <div class="">
            <p class="mt-3 mb-0">
              <router-link class="text-primary" to="signin"
                >Sign in</router-link
              >
              to your account
            </p>
          </div>
        </div>
      </div>
    </auth-layout>
  </div>
</template>

<style module>
.errorMessage {
  color: red;
}
.mt-10 {
  padding-top: 2rem;
}
.dot_border {
  height: 25px;
  width: 25px;
  border-radius: 100px;
  border: 2px solid darkblue;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dot_bg {
  height: 5px;
  width: 5px;
  border-radius: 100px;
  background: darkblue;
}
</style>

<script>
import AuthLayout from "../../components/layouts/AuthLayouts.vue";
import axios from "../../plugins/axios";
import validator from "validator";
import I18nCountries from "i18n-iso-countries";
import { VueTelInput } from "vue-tel-input";
import stripeBusinessMcc from "../../assets/business-mcc.json";
import "vue-tel-input/dist/css/sprite.css"; // Flags styles
import "vue-tel-input/dist/css/component.css"; // Component styles
// I18nCountries.registerLocale(require("../../assets/countries-en.json"));
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import userService from "../../webServices/user.service";
import { countryList } from "../../assets/api/countries";

let countries = countryList;

let accountTypes = [
  {
    id: "individual",
    value: "individual",
    name: "Individual",
  },
  {
    id: "company",
    value: "company",
    name: "Company",
  },
];

let countriesWithCode = countries.map((country) => {
  return {
    name: country,
    countryCode: I18nCountries.getAlpha2Code(country, "en"),
  };
});
let BusinessMcc = stripeBusinessMcc.map((business_mcc) => {
  return {
    name: business_mcc.name,
    code: business_mcc.code,
    value: business_mcc.value,
  };
});
// buildwatchers
let keysToWatch = [
  "lastName",
  "firstName",
  "phone",
  "country",
  "companyName",
  "formValue.email.valid",
  "business_mcc",
  "dob",
  "formValue.password.valid",
  "termsAgreed",
];
let watchers = {};
keysToWatch.forEach((key) => {
  watchers[key] = function (newVal, previousVal) {
    this.checkFormCompleteness();
  };
});
export function validName(name) {
  let validNamePattern = new RegExp("^[a-zA-Z]+(?:[-'\\s][a-zA-Z]+)*$");
  if (validNamePattern.test(name)) {
    return true;
  }
  return false;
}
import { BIconArrowLeft } from "bootstrap-vue";
export default {
  components: { AuthLayout, VueTelInput, BIconArrowLeft },
  setup() {
    return { v$: useVuelidate() };
  },
  mounted() {
    setTimeout(() => {
      this.$refs.focusMe.focus();
    }, 100);
    this.referralCode = this.$route.query.referralCode;
    console.log(this.$route.query.referralCode);
    $("#type").val("individual");
  },
  data: function () {
    return {
      Props: {
        disabledFormatting: false,
        enabledCountryCode: true,
        mode: "international",
        disabledFetchingCountry: false,
      },
      accountTypes: [...accountTypes],
      step_one: true,
      step_two: false,
      step_three: false,
      selected: "",
      form: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        companyName: "",
      },
      formValue: {
        password: {
          value: "",
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        email: {
          value: "",
          errorMessage: undefined,
          valid: false,
        },
      },
      businessType: "",
      lastName: "",
      firstName: "",
      companyName: "",
      phone: "",
      dob: "",
      country: "",
      business_mcc: "",
      business_type: "individual",
      BusinessMcc: [...BusinessMcc],
      countriesWithCode: [...countriesWithCode],
      termsAgreed: true,
      //
      formComplete: false,
      submitError: undefined,
      submitErrorHtml: undefined,
      //
      loading: false,
      // promo referral
      referralCode: "",
    };
  },
  methods: {
    onEnter: function () {
      showFinalStep();
    },
  },
  validations() {
    return {
      form: {
        firstName: {
          required,
          name_validation: {
            $validator: validName,
            $message:
              "Invalid Name. Valid name only contain letters, dashes (-) and spaces",
          },
        },
        lastName: {
          required,
          name_validation: {
            $validator: validName,
            $message:
              "Invalid Name. Valid name only contain letters, dashes (-) and spaces",
          },
        },
        companyName: {
          required,
          name_validation: {
            $validator: validName,
            $message:
              "Invalid Company Name. Valid name only contain letters, dashes (-) and spaces",
          },
        },
        email: { required, email },
        password: { required },
      },
    };
  },
  computed: {
    stepOneButton() {
      if (this.business_type == "individual")
        return this.firstName && this.lastName;
      if (this.business_type == "company") return this.companyName;
    },
    stepTwoButton() {
      if (this.business_type == "individual")
        return this.formValue.email && this.phone && this.dob;
      if (this.business_type == "company")
        return this.formValue.email && this.phone;
    },
    finalButton() {
      return (
        // this.country &&
        this.business_mcc
        // this.formValue.password.value
        // this.formValue.password.value && this.termsAgreed
      );
    },
  },
  methods: {
    goBack() {
      if (!this.step_one && this.step_two) {
        this.step_one = true;
        this.step_two = false;
        this.step_three = false;

        return;
      }

      if (!this.step_two && this.step_three) {
        this.step_one = false;
        this.step_two = true;

        this.step_three = false;
      }
    },
    handleTextChange(event, key) {
      let value = event?.target?.value?.trim();
      if (value == "" || !value) {
        this.formValue[key].errorMessage = `${key} cannot be empty`;
      }
      // email validation
      if (key == "email") {
        if (!validator.isEmail(value)) {
          this.formValue.email.errorMessage = "Please input a valid email";
          this.formValue.email.valid = false;
        } else {
          this.formValue.email.errorMessage = undefined;
          this.formValue.email.valid = true;
        }
      }
      if (key == "phone") {
        if (validator.isEmpty(value)) {
          this.formValue.phone.errors.push("Phone number cannot be empty");
        }
      }
      // password validation
      if (key == "password") {
        // first reset password errors
        this.formValue.password.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.password.errors.push("Password cannot be empty");
        }
        if (value?.length < 8) {
          this.formValue.password.errors.push(
            "Password must be at least 8 characters"
          );
        }
      }
    },
    formSubmit() {
      this.signUp();
    },
    showNextStep() {
      this.step_one = false;
      this.step_two = true;
      setTimeout(() => {
        this.$refs.focusMeTwo.focus();
      }, 100);

      this.step_three = false;
    },
    showFinalStep() {
      this.step_one = false;
      this.step_two = false;
      this.step_three = true;
      setTimeout(() => {
        this.$refs.focusMeThree.focus();
      }, 100);
    },
    trigger: function () {
      console.log("clicked");
      this.$refs.sendClick.click();
    },
    signUp() {
      let parsePhone = this.phone.replace(/\s+/g, "");
      const data = {
        business_type: this.business_type,
        companyName: this.companyName,
        lastName: this.lastName,
        firstName: this.firstName,
        email: this.formValue.email.value,
        password: this.formValue.password.value,
        business_mcc: this.business_mcc,
        country: this.country,
        phone_number: parsePhone,
        date_of_birth: this.dob,
        referralCode: this.$route.query.referralCode,
      };
      console.log("country", this.country);
      axios
        .post("v1/merchant/signup", data)
        .then((res) => {
          this.submitError = undefined;
          this.loading = false;
          // this.showModal();
          const routeParams = {
            verification_key: res?.data?.verification_key,
            email: res?.data?.merchant?.email,
            password: this.formValue.password.value,
          };
          this.$router.push({
            name: "EmailVerification",
            // path: "/verify-email",
            params: routeParams,
          });
          this.$toast.success("Successful. An OTP has been sent.");
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
          //
          let errors = [];
          //
          if (error?.response?.data?.errors) {
            errors = error?.response?.data?.errors;
          }
          if (error?.response?.data?.message) {
            errors.push(error?.response?.data?.message);
          }
          console.log("error?.response?.data ", error?.response?.data);
          let errorText = "";
          errors.forEach((errText) => {
            errorText = `${errorText}<div>${errText?.msg || errText}</div>`;
          });
          this.submitErrorHtml = errorText;
        });
    },
    checkFormCompleteness() {
      let formValid = true;
      // check formValue obj
      // check vue data
      let dataKeys = [
        "lastName",
        "firstName",
        "companyName",
        "phone",
        "country",
        "business_mcc",
        "dob",
        "email",
        "formValue.email.value",
      ];
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
      if (!this.termsAgreed) {
        formValid = formValid && false;
      }
      this.formComplete = formValid;
    },
  },
  watch: {
    ...watchers,
  },
};
</script>
