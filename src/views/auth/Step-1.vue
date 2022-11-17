<template>
  <auth-layout :title="'Phone Verification'">
    <div class="auth-form card">
      <div class="card-body">
        <p class="text-center mb-3">Enter your phone number to continue.</p>
        <form @submit.prevent="formSubmit" class="row g-3">
          <div class="col-12">
            <label class="form-label">Your Phone Number</label>
            <template>
              <vue-tel-input
                v-model="phone"
                class="form-control"
                v-bind="props"
                :autoFormat="true"
              ></vue-tel-input>
            </template>
          </div>
        </form>
      </div></div
  ></auth-layout>
</template>

<script>
import AuthLayout from "../../components/layouts/AuthLayouts.vue";

export default {
  data() {
    return {
      phone: "",
      props: {
        mode: "international",
        defaultCountry: "GB",
        //autoDefaultCountry: true,
        //disabledFetchingCountry: false,

        disabledFormatting: false,
        placeholder: "Enter a phone number",
        required: true,
        enabledCountryCode: true,
        enabledFlags: true,
        preferredCountries: ["US", "CA", "UK"],

        // ignoredCountries: ["US", "BR"],
        autocomplete: "off",
        name: "telephone",
        maxLen: 25,
        wrapperClasses: "",
        inputClasses: "",
        style: [
          "border: 0;",
          "background-color: transparent;",
          "border-color: transparent;",
        ],
        style:
          "border: 0; background-color: transparent; border-color: transparent;",
        dropdownOptions: {
          showFlags: true,
          width: "350px",
          showDialCodeInList: true,
        },
        inputOptions: {
          showDialCode: true,
        },
      },
    };
  },
  components: { AuthLayout },
  onUpdate: function (payload) {
    this.phoneDetails = payload;
  },
  methods: {
    formSubmit() {
      this.$router.push("/otp-2");
    },
  },
};
</script>
