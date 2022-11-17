<template>
  <div>
    <div class="">
      <!-- Used to display form errors. -->
      <div id="error-message" class="sr-field-error" role="alert"></div>
      <select v-model="payoutMethod" class="form-select" name="payoutMethod">
        <option value="">Select a Payout Method</option>
        <option
          v-for="item in accountTypes"
          v-bind:value="item.value"
          :key="item.id"
        >
          {{ item.name }}
        </option>
      </select>
      <div class="" v-show="payoutMethod == 'PayPal'">
        <form
          @submit.prevent="formSubmit"
          id="payment-form"
          class="sr-payment-form"
        >
          <div class="sr-combo-inputs-row">
            <div class="col">
              <label for="name"> Account Holder Name </label>
              <input
                ref="focusMe"
                id="name"
                v-model="accountName"
                name="name"
                placeholder="John Rosen"
                class="form-control"
                required
              />
            </div>
          </div>

          <div class="sr-combo-inputs-row">
            <div class="col">
              <label for="name">PayPal Email </label>
              <input
                id="name"
                v-model="paypal_email"
                class="form-control"
                name="name"
                placeholder="test@gmail.com"
                required
                type="email"
              />
            </div>
          </div>
          <div class="sr-combo-inputs-row"></div>

          <button
            id="confirm-mandate"
            class="btn btn-primary fw-5 router-link-exact-active router-link-active"
            type="searchButton"
          >
            <div disabled class="spinner hidden" id="spinner"></div>
            <span id="button-text">Submit <span id="order-amount"></span></span>
          </button>
        </form>
      </div>
      <div class="" v-show="payoutMethod == 'Bank'">
        <form
          @submit.prevent="formSubmit"
          id="payment-form"
          class="sr-payment-form"
        >
          <div class="sr-combo-inputs-row">
            <div class="col">
              <label for="name"> Account Holder Name </label>
              <input
                ref="focusMe"
                id="name"
                v-model="accountName"
                name="name"
                placeholder="John Rosen"
                class="form-control"
                required
              />
            </div>
          </div>

          <div class="sr-combo-inputs-row">
            <div class="col">
              <label for="name">IBAN / Account Number </label>
              <input
                id="name"
                v-model="iban"
                class="form-control"
                name="name"
                placeholder=""
                required
                type="text"
              />
            </div>
          </div>

          <div class="sr-combo-inputs-row">
            <div class="col">
              <label for="name">SWIFT </label>
              <input
                id="name"
                v-model="swift_code"
                class="form-control"
                name="name"
                placeholder=""
                required
                type="text"
              />
            </div>
          </div>
          <div class="sr-combo-inputs-row"></div>

          <button
            id="confirm-mandate"
            class="btn btn-primary fw-5 router-link-exact-active router-link-active"
            type="searchButton"
          >
            <div disabled class="spinner hidden" id="spinner"></div>
            <span id="button-text">Submit <span id="order-amount"></span></span>
          </button>
        </form>
      </div>
    </div>
    <b-modal ref="my-modal" hide-footer title="Charge successful">
      <div class="d-block text-center">
        <h3>Your Account will be added soon</h3>
      </div>
    </b-modal>
  </div>
</template>

<style scoped>
/* Variables */
:root {
  --body-color: rgb(247, 250, 252);
  --button-color: rgb(30, 166, 114);
  --accent-color: rgb(22, 82, 240);
  --link-color: #6b7c93;
  --font-color: rgb(105, 115, 134);
  --error-color: #fa755a;
  --body-font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  --radius: 6px;
  --form-width: 600px;
}
input:focus,
.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}
.StripeElement--invalid {
  border-color: #fa755a;
}
.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
/* Layout */
.sr-root {
  display: flex;
  flex-direction: row;
  width: 80%;
  max-width: 600px;
  padding: 48px;
  align-content: center;
  justify-content: center;
  height: auto;
  min-height: 100vh;
  margin: 0 auto;
}
.sr-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 600px;
  min-width: 450px;
  align-self: center;
  padding: 75px 50px;
  background: rgb(247, 250, 252);
  border-radius: var(--radius);
  box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
    0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
}
/* Inputs */
input {
  width: 100%;
  outline: none;
}
select {
  width: 100% !important;
}
.sr-combo-inputs-row {
  display: -ms-flexbox;
  display: flex;
}
.sr-combo-inputs-row {
  width: 100%;
  margin-top: 20px;
}
.sr-combo-inputs-row:first-child {
  margin-top: 0;
}
.sr-combo-inputs-row {
  margin-top: 20px;
}
.sr-combo-inputs-row .col:not(:last-child) {
  margin-right: 20px;
}
.sr-combo-inputs-row .col {
  width: 100%;
}
/* Input labels */

/* Buttons and links */
button {
  background: rgb(22, 82, 240);
  border-radius: var(--radius);
  color: white;
  border: 0;
  padding: 12px 16px;
  margin-top: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: block;
  box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
  width: 100%;
}
button:hover {
  filter: contrast(115%);
}
button:active {
  transform: translateY(0px) scale(0.98);
  filter: brightness(0.9);
}
button:disabled {
  opacity: 0.5;
  cursor: none;
}
a {
  color: var(--link-color);
  text-decoration: none;
  transition: all 0.2s ease;
}
/* Stripe Element placeholder */
.sr-element {
  padding-top: 12px;
}
/* Responsiveness */
@media (max-width: 720px) {
  .sr-root {
    flex-direction: column;
    justify-content: flex-start;
    padding: 48px 20px;
    min-width: 320px;
  }
  .sr-header__logo {
    background-position: center;
  }
  .sr-payment-summary {
    text-align: center;
  }
  .sr-content {
    display: none;
  }
  .sr-main {
    width: 100%;
    height: 450px;
    background: rgb(247, 250, 252);
    box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
      0px 2px 5px 0px rgba(50, 50, 93, 0.1),
      0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
    border-radius: 6px;
  }
}
.errorMessage {
  color: red;
}
</style>

<script>
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
import axios from "../../plugins/axios";
import validator from "validator";
import countryCurrencies from "../../assets/countryCurrencyCodes.json";

let accountTypes = [
  {
    id: "PayPal",
    value: "PayPal",
    name: "PayPal",
  },
  {
    id: "Bank",
    value: "Bank",
    name: "Bank",
  },
];

// const stripe = Stripe(
//   "pk_test_51KbrJSFLzLitOdjh35F45J9kRL4Qlj5Ob9G5PtVXdvlhLzf1VRfV9VDafJh6qZGFQH5V9qv6B7iD7ENnxRcKMiCr00aHOwRQ8M"
// );
let countriesWithCurrency = countryCurrencies.map((countryCurrency) => {
  return {
    country: countryCurrency.country,
    currencyCode: countryCurrency.currency_code,
  };
});
export default {
  components: { DashboardLayout },
  data: function () {
    return {
      isUSA: false,
      elements: undefined,
      swift_code: undefined,
      paypal_email: undefined,
      iban: undefined,
      loading: false,
      currency_code: "",
      countriesWithCurrency: [...countriesWithCurrency],
      payoutMethod: "",
      accountTypes: [...accountTypes],

      // Step 1 and step 2: Connect payout method and verify business

      step_one: true,
      step_two: false,

      // Individual
      website: "",
      description: "",

      //  Company
    };
  },
  mounted() {
    setTimeout(() => {
      this.$refs.focusMe.focus();
    }, 100);
    this.userData = this.$store.state.auth.userData;
    // // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
    const elements = stripe.elements();
    this.elements = elements;
    // // Create and mount the Payment Element
    // const paymentElement = elements.create("payment");
    const style = {
      base: {
        color: "#32325d",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
        ":-webkit-autofill": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
        ":-webkit-autofill": {
          color: "#fa755a",
        },
      },
      empty: {
        backgroudColor: "fff",
      },
    };
    const bankElement = elements.create("iban", {
      style: style,
      supportedCountries: ["SEPA"],
      placeholderCountry: "DE",
    });
    bankElement.mount("#iban-element");
    this.bankElement = bankElement;
  },
  methods: {
    async formSubmit() {
      this.sendBankToken();
      return;
    },
    showSuccessModal() {
      this.$refs["my-modal"].show();
    },
    async sendBankToken() {
      const config = {
        headers: {
          "x-access-token": this.$store.state.auth?.userData?.token,
        },
      };
      let body = {
        account_holder_name: this.accountName,
        bankName: this.bankName,
        iban: this.iban,
        swift_code: this.swift_code,
        paypal_email: this.paypal_email,
        payoutMethod: this.payoutMethod,
      };
      axios
        .post("v1/merchant/profile/add-bank", body, config)
        .then((res) => {
          this.$toast.success("Payout method has been set!", {
            timeout: 3000,
          });
          this.$router.push({
            name: "VerifyAccount",
          });
        })
        .catch((error) => {
          console.log(error);
          console.log("add card endpoint failed ", error?.response?.data);
          if (error?.response?.data) {
            messageContainer.textContent =
              error?.response?.data?.detail?.raw?.message ||
              error?.response?.data?.error;
            return;
          }
          messageContainer.textContent = "Error encountered while adding card";
        });
    },
  },
};
</script>
