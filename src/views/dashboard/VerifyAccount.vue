<template>
  <dashboard-layout :pageName="'Verify Account'">
    <div class="auth-form card">
      <div class="card-body">
        <form
          method="post"
          name="myform"
          class="signin_validate row g-3"
          @submit.prevent="formSubmit"
        >
          <div
            style="text-align: center"
            class="alert alert-danger"
            v-html="submitErrorHtml"
            v-show="submitErrorHtml"
            :class="$style.errorMessage"
          ></div>
          <!-- Individual Session -->
          <section v-if="businessType == 'individual'" class="form-group">
            <h4 class="mb-4" style="font-weight: 700 !important">
              One more thing.. 😉
            </h4>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Business Website</label>
                <input
                  ref="focusMe"
                  type="text"
                  autofocus
                  class="form-control"
                  placeholder=""
                  name="name"
                  v-model="formValue.website.value"
                  :class="{ 'has-error': formValue.website.errors.length > 0 }"
                  @input="handleTextChange($event, 'website')"
                />
                <div
                  class="input-errors"
                  v-if="formValue.website.errors.length"
                >
                  {{ formValue.website.errors[0] }}
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Business Description</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder=""
                  name="name"
                  v-model="formValue.description.value"
                  :class="{
                    'has-error': formValue.description.errors.length > 0,
                  }"
                  @input="handleTextChange($event, 'description')"
                />
                <div
                  class="input-errors"
                  v-if="formValue.description.errors.length"
                >
                  {{ formValue.description.errors[0] }}
                </div>
              </div>
            </div>
          </section>

          <!-- Company Session -->
          <section v-if="businessType == 'company'" class="form-group">
            <div class="d-flex">
              <p
                :class="{ 'text-grey': !company }"
                class="mb-4"
                @click="
                  company = true;
                  focusOne();
                "
                style="cursor: pointer"
              >
                Company Information
              </p>
              <p
                class="mb-4 px-3"
                :class="{ 'text-grey': company }"
                @click="
                  company = false;
                  focusTwo();
                "
                style="cursor: pointer"
              >
                Owner Information
              </p>
            </div>
            <div v-show="company">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Company registration number</label>
                  <input
                    autofocus
                    ref="focusMe"
                    type="text"
                    class="form-control"
                    placeholder=""
                    name="name"
                    v-model="formValue.companyRegistrationNumber.value"
                    :class="{
                      'has-error':
                        formValue.companyRegistrationNumber.errors.length > 0,
                    }"
                    @input="
                      handleTextChange($event, 'companyRegistrationNumber')
                    "
                  />
                  <div
                    class="input-errors"
                    v-if="formValue.companyRegistrationNumber.errors.length"
                  >
                    {{ formValue.companyRegistrationNumber.errors[0] }}
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Company Address</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder=""
                    name="name"
                    :class="{
                      'has-error': formValue.companyLine1.errors.length > 0,
                    }"
                    v-model="formValue.companyLine1.value"
                    @input="handleTextChange($event, 'companyLine1')"
                  />
                  <div
                    class="input-errors"
                    v-if="formValue.companyLine1.errors.length"
                  >
                    {{ formValue.companyLine1.errors[0] }}
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Company City</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder=""
                    name="name"
                    v-model="formValue.companyCity.value"
                    :class="{
                      'has-error': formValue.companyCity.errors.length > 0,
                    }"
                    @input="handleTextChange($event, 'companyCity')"
                  />
                  <div
                    class="input-errors"
                    v-if="formValue.companyCity.errors.length"
                  >
                    {{ formValue.companyCity.errors[0] }}
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Company's State</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder=""
                    name="name"
                    v-model="formValue.companyState.value"
                    :class="{
                      'has-error': formValue.companyCity.errors.length > 0,
                    }"
                    @input="handleTextChange($event, 'companyState')"
                  />
                  <div
                    class="input-errors"
                    v-if="formValue.companyState.errors.length"
                  >
                    {{ formValue.companyState.errors[0] }}
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <label class="form-label">Company Postal code</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder=""
                    name="name"
                    v-model="formValue.companyPostal_code.value"
                    :class="{
                      'has-error': formValue.companyCity.errors.length > 0,
                    }"
                    @input="handleTextChange($event, 'companyPostal_code')"
                  />
                  <div
                    class="input-errors"
                    v-if="formValue.companyPostal_code.errors.length"
                  >
                    {{ formValue.companyPostal_code.errors[0] }}
                  </div>
                </div>

                <!-- <div class="col-md-6">
                  <label class="form-label">Company Tax id</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder=""
                    name="name"
                    v-model = "formValue.companyTaxId.value"
                    :class="{ 'has-error': formValue.companyTaxId.errors.length > 0 }"
                    @input="handleTextChange($event, 'companyTaxId')"
                  />
                   <div class="input-errors" v-if="formValue.companyTaxId.errors.length">
                  {{ formValue.companyTaxId.errors[0] }}
                </div> -->
                <div class="col-md-6 col-xl-6 col-lg-6">
                  <label class="form-label">Country of Incorporation</label>
                  <select v-model="country" class="form-select" name="country">
                    <option value="">Select a Country</option>
                    <option
                      v-for="item in countriesWithCode"
                      v-bind:value="item.name"
                      :key="item.countryCode"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="row justify-content-center">
                <button
                  type="button"
                  class="btn btn-primary auth-btn my-3"
                  @click.prevent="company = !company"
                  @click="focusTwo()"
                >
                  Next
                </button>
              </div>
            </div>

            <div v-show="!company">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Owner's first Name</label>
                  <input
                    ref="focusMeTwo"
                    type="text"
                    class="form-control"
                    placeholder=""
                    name="name"
                    v-model="formValue.ownerFirstName.value"
                    :class="{
                      'has-error': formValue.ownerFirstName.errors.length > 0,
                    }"
                    @input="handleTextChange($event, 'ownerFirstName')"
                  />
                  <div
                    class="input-errors"
                    v-if="formValue.ownerFirstName.errors.length"
                  >
                    {{ formValue.ownerFirstName.errors[0] }}
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Owner's last name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder=""
                    name="name"
                    v-model="formValue.ownerLastName.value"
                    :class="{
                      'has-error': formValue.ownerLastName.errors.length > 0,
                    }"
                    @input="handleTextChange($event, 'ownerLastName')"
                  />
                  <div
                    class="input-errors"
                    v-if="formValue.ownerLastName.errors.length"
                  >
                    {{ formValue.ownerLastName.errors[0] }}
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Owner's Phone Number</label>
                  <vue-tel-input
                    class="form-control px-0"
                    name="phone"
                    v-model="formValue.ownerPhone.value"
                    mode="international"
                    v-bind="Props"
                    :class="{
                      'has-error': formValue.ownerPhone.errors.length > 0,
                    }"
                    @input="handleTextChange($event, 'ownerPhone')"
                  ></vue-tel-input>
                  <div
                    class="input-errors"
                    v-if="formValue.ownerPhone.errors.length"
                  >
                    {{ formValue.ownerPhone.errors[0] }}
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Owner's email</label>
                  <input
                    type="email"
                    class="form-control"
                    placeholder=""
                    name="email"
                    v-model="formValue.ownerEmail.value"
                    :class="{
                      'has-error': formValue.ownerEmail.errors.length > 0,
                    }"
                    @input="handleTextChange($event, 'ownerEmail')"
                  />
                  <div
                    class="input-errors"
                    v-if="formValue.ownerEmail.errors.length"
                  >
                    {{ formValue.ownerEmail.errors[0] }}
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Owner's date of Birth</label>
                  <input
                    type="date"
                    class="form-control"
                    placeholder=""
                    name="name"
                    v-model="formValue.ownerDOB.value"
                    :class="{
                      'has-error': formValue.ownerDOB.errors.length > 0,
                    }"
                    @input="handleTextChange($event, 'ownerDOB')"
                  />
                  <div
                    class="input-errors"
                    v-if="formValue.ownerDOB.errors.length"
                  >
                    {{ formValue.ownerDOB.errors[0] }}
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Owner's address</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder=""
                    name="name"
                    v-model="formValue.ownerAddressLine1.value"
                    :class="{
                      'has-error':
                        formValue.ownerAddressLine1.errors.length > 0,
                    }"
                    @input="handleTextChange($event, 'ownerAddressLine1')"
                  />
                  <div
                    class="input-errors"
                    v-if="formValue.ownerAddressLine1.errors.length"
                  >
                    {{ formValue.ownerAddressLine1.errors[0] }}
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <label class="form-label">Owner's city</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder=""
                    name="name"
                    v-model="formValue.ownerAddressCity.value"
                    :class="{
                      'has-error': formValue.ownerAddressCity.errors.length > 0,
                    }"
                    @input="handleTextChange($event, 'ownerAddressCity')"
                  />
                  <div
                    class="input-errors"
                    v-if="formValue.ownerAddressCity.errors.length"
                  >
                    {{ formValue.ownerAddressCity.errors[0] }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Owner's State</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder=""
                    name="name"
                    v-model="formValue.ownerAddressState.value"
                    :class="{
                      'has-error':
                        formValue.ownerAddressState.errors.length > 0,
                    }"
                    @input="handleTextChange($event, 'ownerAddressState')"
                  />
                  <div
                    class="input-errors"
                    v-if="formValue.ownerAddressState.errors.length"
                  >
                    {{ formValue.ownerAddressState.errors[0] }}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div
            class="d-grid gap-2"
            v-if="!company || businessType == 'individual'"
          >
            <button
              :disabled="loading"
              type="submit"
              class="btn btn-primary auth-btn d-flex justify-content-center align-items-center"
            >
              Submit

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

    <div
      style="text-align: center"
      v-html="submitError"
      :class="$style.errorMessage"
    ></div>
    <!-- <div v-if="fraudCheck > 5">
      <4 :class="$style.errorMessage">
        Please, kindly upload verification document. Proceed by clicking
      </h4>
      <button
      style="margin-top: 20px"
      
      class="btn btn-primary"
    >
      <router-link to="/upload" style="color: #fff">
        Upload Documents
      </router-link>
    </button>
    </div>  -->

    <div class="privacy-link text-center mt-4">
      <span>&copy; </span>
      <a href="https://cycopay.com">CycoPay</a>
      <span style="font-weight: 700"> · </span>
      <a href="https://cycopay.com/company/terms-of-service">Terms</a>
      <span style="font-weight: 700"> · </span>
      <a href="https://cycopay.com/company/privacy-policy">Privacy Policy</a>
    </div>

    <b-modal ref="my-modal" hide-footer title="Details submitted">
      <div class="d-block text-center">
        <h3>Details submitted</h3>
        <p>We will verify the details and give you a feedback</p>
      </div>
    </b-modal>
  </dashboard-layout>
</template>

<style module>
.errorMessage {
  color: red;
}
.buttonStyle {
  background-color: #0d40c6;
  border-color: #0d40c6;
}
.button {
  margin-top: 20px;
  background: #1652f0;
}
button:hover {
  background-color: #4834d4;
  border-color: #0d40c6;
}
.text {
  color: #1652f0;
  font-size: 16px;
}
</style>

<script>
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
import stripeBusinessMcc from "../../assets/business-mcc.json";
import axios from "../../plugins/axios";
import validator from "validator";
import I18nCountries from "i18n-iso-countries";
import useVuelidate from "@vuelidate/core";
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/dist/css/sprite.css"; // Flags styles
import "vue-tel-input/dist/css/component.css"; // Component styles
import { required, email } from "@vuelidate/validators";
// I18nCountries.registerLocale(require("../../assets/countries-en.json"));
let BusinessMcc = stripeBusinessMcc.map((business_mcc) => {
  return {
    name: business_mcc.name,
    code: business_mcc.code,
    value: business_mcc.value,
  };
});
let countries = [
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Bulgaria",
  "Canada",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hong Kong",
  "Hungary",
  "India",
  "Indonesia",
  "Ireland",
  "Italy",
  "Japan",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malaysia",
  "Malta",
  "Mexico",
  "Moldova",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
];
let countriesWithCode = countries.map((country) => {
  return {
    name: country,
    countryCode: I18nCountries.getAlpha2Code(country, "en"),
  };
});
export function validName(name) {
  let validNamePattern = new RegExp("^[a-zA-Z]+(?:[-'\\s][a-zA-Z]+)*$");
  if (validNamePattern.test(name)) {
    return true;
  }
  return false;
}
// buildwatchers
let keysToWatch = [
  "formValue.website.value",
  "formValue.description.value",
  "formValue.postal_code.value",
  "formValue.line1.value",
  "formValue.url.value",
  "formValue.companyLine1.value",
  "formValue.companyCity.value",
  "formValue.companyState.value",
  "formValue.companyPostal_code.value",
  "formValue.companyTaxId.value",
  "formValue.companyRegistrationNumber.value",
  "formValue.companyExecutives.value",
  "formValue.companyOwners.value",
  "formValue.companyPhoneNumber.value",
  "formValue.ownerFirstName.value",
  "formValue.ownerLastName.value",
  "formValue.ownerDOB.value",
  "formValue.ownerAddressLine1.value",
  "formValue.ownerPostalCode.value",
  "formValue.ownerAddressCity.value",
  "formValue.ownerAddressState.value",
  "formValue.ownerEmail.value",
  "formValue.ownerRelationshipTitle.value",
  "formValue.ownerPoliticalExposure.value",
  "formValue.ownerIdNumber.value",
  "formValue.ownerPercentage.value",
  "business_mcc",
  "country",
];
let watchers = {};
keysToWatch.forEach((key) => {
  watchers[key] = function (newVal, previousVal) {
    this.checkFormCompleteness();
  };
});
export default {
  components: { DashboardLayout },
  setup() {
    return { v$: useVuelidate() };
  },
  data: function () {
    return {
      company: true,
      Props: {
        onlyCountries: [
          "AU",
          "AT",
          "BD",
          "BE",
          "BG",
          "CZ",
          "DK",
          "EE",
          "FI",
          "FR",
          "DE",
          "HK",
          "HU",
          "IN",
          "ID",
          "IE",
          "IT",
          "JP",
          "LV",
          "LT",
          "LU",
          "MY",
          "MT",
          "MX",
          "MD",
          "NL",
          "NO",
          "PL",
          "PT",
          "RO",
          "SG",
          "SK",
          "SI",
          "ES",
          "SE",
          "CH",
          "AE",
          "GB",
          "US",
        ],
        disabledFormatting: false,
        enabledCountryCode: true,
        mode: "international",
        disabledFetchingCountry: false,
      },
      country: "",
      countriesWithCode: [...countriesWithCode],
      getStripeAccountError: undefined,
      submitError: undefined,
      businessType: undefined,
      fraudCheck: undefined,
      //
      dueRequirements: [],
      currentlyDue: [],
      eventuallyDue: [],
      //
      formComplete: false,
      submitError: undefined,
      submitErrorHtml: undefined,
      //
      form: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        companyName: "",
        companyLine1: "",
      },
      formValue: {
        line1: {
          label: "Address",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        website: {
          label: "Website",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        description: {
          label: "Description",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        postal_code: {
          label: "Postal Code",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        url: {
          label: "Business Url",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        /* COMPANY DATA */
        companyRegistrationNumber: {
          label: "Company Registration number",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        companyLine1: {
          label: "Company address",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        companyCity: {
          label: "Company city",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        companyState: {
          label: "Company state",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        companyPostal_code: {
          label: "Company postal code",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        companyPhoneNumber: {
          label: "Company phone number",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        companyTaxId: {
          label: "Company Tax id",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        /* OWNER DATA */
        ownerFirstName: {
          label: "Owner's first name",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        ownerLastName: {
          label: "Owner's last name",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        ownerDOB: {
          label: "Owner's  date of birth",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        ownerPhone: {
          label: "Owner's  phone number",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        ownerAddressLine1: {
          label: "Owner's address",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        ownerPostalCode: {
          label: "Owner's  postal code",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        ownerAddressCity: {
          label: "Owner's  city",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        ownerAddressState: {
          label: "Owner's  state",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        ownerEmail: {
          label: "Owner's  email",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        ownerRelationshipTitle: {
          label: "Owner's  position",
          value: undefined,
          errorMessage: undefined,
          errors: [],
          valid: false,
        },
        ownerPoliticalExposure: {
          label: "Owner's  political exposure",
          value: undefined,
        },
        ownerIdNumber: {
          label: "Owner's identity number",
          value: undefined,
        },
        ownerPercentage: {
          label: "Owner's  percentage in the company",
          value: undefined,
        },
      },
      business_mcc: undefined,
      BusinessMcc: [...BusinessMcc],
      //
      loading: false,
    };
  },
  mounted() {
    this.getRequirements();
    setTimeout(() => {
      this.$refs.focusMe.focus();
    }, 200);
  },
  validations() {
    return {
      form: {
        companyLine1: {
          required,
          name_validation: {
            $validator: validName,
            $message:
              "Invalid Name. Valid name only contain letters, dashes (-) and spaces",
          },
        },
        postal_code: {
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
  methods: {
    focusOne() {
      setTimeout(() => {
        this.$refs.focusMe.focus();
      }, 100);
    },
    focusTwo() {
      setTimeout(() => {
        this.$refs.focusMeTwo.focus();
      }, 100);
    },
    handleTextChange(event, key) {
      let value = event?.target?.value?.trim();
      if (value == "" || !value) {
        this.formValue[key].errorMessage = `${key} cannot be empty`;
      }
      // individual form validation
      if (key == "line1") {
        this.formValue.line1.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.line1.errors.push("Address cannot be empty");
        }
      }
      if (key == "website") {
        this.formValue.website.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.website.errors.push("Website cannot be empty");
        }
        if (
          !validator.isURL(value, {
            require_protocol: false,
            allow_protocol_relative_urls: false,
          })
        ) {
          this.formValue.website.errors.push("Website URL is invalid");
        }
      }
      if (key == "description") {
        this.formValue.description.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.description.errors.push("Description cannot be empty");
        }

        if (!validator.isLength(value, { min: 40, max: 150 })) {
          this.formValue.description.errors.push("Type a longer description");
        }
      }
      if (key == "postal_code") {
        this.formValue.postal_code.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.postal_code.errors.push("Postal code cannot be empty");
        }
      }
      // company form input validation
      if (key == "companyRegistrationNumber") {
        this.formValue.companyRegistrationNumber.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.companyRegistrationNumber.errors.push(
            "Company registration number cannot be empty"
          );
        }

        if (!validator.isNumeric(value)) {
          this.formValue.companyRegistrationNumber.errors.push(
            "Only Numbers allowed"
          );
        }
      }
      if (key == "companyLine1") {
        this.formValue.companyLine1.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.companyLine1.errors.push(
            "Company address cannot be empty"
          );
        }
      }
      if (key == "companyCity") {
        this.formValue.companyCity.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.companyCity.errors.push(
            "Company city cannot be empty"
          );
        }
      }
      if (key == "companyState") {
        this.formValue.companyState.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.companyState.errors.push(
            "Company state cannot be empty"
          );
        }
      }
      if (key == "companyPostal_code") {
        this.formValue.companyPostal_code.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.companyPostal_code.errors.push(
            "Company postal code cannot be empty"
          );
        }
      }
      if (key == "companyTaxId") {
        this.formValue.companyTaxId.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.companyTaxId.errors.push(
            "Company Tax id cannot be empty"
          );
        }
      }
      if (key == "ownerFirstName") {
        this.formValue.ownerFirstName.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.ownerFirstName.errors.push(
            "Owner first name cannot be empty"
          );
        }
      }
      if (key == "ownerLastName") {
        this.formValue.ownerLastName.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.ownerLastName.errors.push(
            "Owner last name cannot be empty"
          );
        }
      }
      if (key == "ownerPhone") {
        this.formValue.ownerPhone.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.ownerPhone.errors.push("Owner phone cannot be empty");
        }
      }
      if (key == "ownerEmail") {
        if (!validator.isEmail(value)) {
          this.formValue.email.errorMessage = "Please input a valid email";
          this.formValue.email.valid = false;
        } else {
          this.formValue.email.errorMessage = undefined;
          this.formValue.email.valid = true;
        }
      }
      if (key == "ownerDOB") {
        this.formValue.ownerDOB.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.ownerDOB.errors.push(
            "Owner's date of birth cannot be empty"
          );
        }
      }
      if (key == "ownerAddressLine1") {
        this.formValue.ownerAddressLine1.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.ownerAddressLine1.errors.push(
            "Owner's address cannot be empty"
          );
        }
      }
      if (key == "ownerAddressCity") {
        this.formValue.ownerAddressCity.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.ownerAddressCity.errors.push(
            "Owner's city cannot be empty"
          );
        }
      }
      if (key == "ownerAddressState") {
        this.formValue.ownerAddressState.errors = [];
        if (validator.isEmpty(value)) {
          this.formValue.ownerAddressState.errors.push(
            "Owner's state cannot be empty"
          );
        }
      }
    },
    getRequirements() {
      this.userData = this.$store.state.auth.userData;
      const config = {
        headers: {
          "x-access-token": this.$store.state.auth?.userData?.token,
        },
      };
      axios
        .get("v1/merchant/profile/stripe-account", config)
        .then((res) => {
          // console.log("get user", res.data);
          this.formValue.country = res.data.merchant.country;
          // console.log("this.formValue.country" + this.formValue.country);
          this.businessType = res?.data?.merchant?.business_type;
          this.getStripeAccountError = undefined;
          this.interPretRequirements(res?.data?.accountDetails);
        })
        .catch((error) => {
          this.getStripeAccountError = "Error getting account requirements";
        });
    },
    async formSubmit() {
      // console.log("this.formValue.country" + this.formValue.country);
      const config = {
        headers: {
          "x-access-token": this.$store.state.auth?.userData?.token,
        },
      };
      const body = {
        line1: this.formValue.line1.value,
        postal_code: this.formValue.postal_code.value,
        website: this.formValue.website.value,
        description: this.formValue.description.value,
        companyRegistrationNumber:
          this.formValue.companyRegistrationNumber.value,
        companyLine1: this.formValue.companyLine1.value,
        companyCity: this.formValue.companyCity.value,
        companyState: this.formValue.companyState.value,
        companyPostal_code: this.formValue.companyPostal_code.value,
        companyTaxId: this.formValue.companyTaxId.value,
        countryOfIncorporation: this.formValue.country,
        /* OWNER DATA */
        ownerFirstName: this.formValue.ownerFirstName.value,
        ownerLastName: this.formValue.ownerLastName.value,
        ownerDOB: this.formValue.ownerDOB.value,
        ownerPhone: this.formValue.ownerPhone.value,
        ownerAddressLine1: this.formValue.ownerAddressLine1.value,
        ownerPostalCode: this.formValue.ownerPostalCode.value,
        ownerAddressCity: this.formValue.ownerAddressCity.value,
        ownerAddressState: this.formValue.ownerAddressState.value,
        ownerEmail: this.formValue.ownerEmail.value,
        ownerRelationshipTitle: this.formValue.ownerRelationshipTitle.value,
        ownerPoliticalExposure: this.formValue.ownerPoliticalExposure.value,
        ownerIdNumber: this.formValue.ownerIdNumber.value,
        ownerPercentage: this.formValue.ownerPercentage.value,
        business_mcc: this.business_mcc,
        business_url: this.formValue.url.value,
      };
      // console.log(body);
      this.loading = true;
      axios
        .put("v1/merchant/profile", body, config)
        .then((res) => {
          this.loading = false;
          this.submitError = undefined;
          // console.log(res.data);
          this.getRequirements();
          // this.showSuccessModal();
          this.$toast.success("Woo! You can now accept payments!", {
            timeout: 3500,
          });
          this.fraudCheck = res?.data?.fraudScore;
          if (this.fraudCheck > 98) {
            this.$router.push({
              name: "VerifyDocument",
            });
          } else {
            this.$router.push({
              name: "Index",
            });
          }
        })
        .catch((error) => {
          this.loading = false;
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
    showSuccessModal() {
      this.$refs["my-modal"].show();
    },
    checkFormCompleteness() {
      let formValid = true;
      // check formValue obj
      // check vue data
      let dataKeys = ["country"];
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
  },
  watch: {
    ...watchers,
  },
};
</script>
