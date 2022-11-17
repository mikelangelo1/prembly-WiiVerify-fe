<template>
  <dashboard-layout :pageName="'Add Card'">
    <div class="row">
      <!-- <h3 style="margin-bottom: 8px">
        You will be charged a one-time fee of 50cents
      </h3> -->
      <form @submit.prevent="formSubmit" id="payment-form">
        <div id="payment-element">
          <!-- Elements will create form elements here -->
        </div>
        <div id="card-element">
          <!-- Elements will create form elements here -->
        </div>
        <button :class="$style.button" type="submit" id="submit">Submit</button>
        <div :class="$style.errorMessage" id="error-message">
          <!-- Display error message to your customers here -->
        </div>
      </form>
    </div>
    <b-modal ref="my-modal" hide-footer title="Charge successful">
      <div class="d-block text-center">
        <h3>Your card will be added soon</h3>
      </div>
    </b-modal>
  </dashboard-layout>
</template>

<style module>
.errorMessage {
  color: red;
}

.button {
  margin-top: 20px;
  background: #1652f0;
}
</style>

<script>
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
import axios from "../../plugins/axios";
// const stripe = Stripe(
//   "pk_test_51KeeteFEG91NzsmGUkubEiaOzUfijRzUFuEmDy2L1drLtsyFdVAvM1TYRDaOrH5s9phTP36JKmif5gkCDhaazC19001g6Yc1Nc"
// );

export default {
  components: { DashboardLayout },
  data: function () {
    return {
      elements: undefined,
      cardElement: undefined,
    };
  },
  mounted() {
    this.userData = this.$store.state.auth.userData;

    const config = {
      headers: {
        "x-access-token": this.$store.state.auth?.userData?.token,
      },
    };

    axios
      .post("v1/merchant/stripe/intent", {}, config)
      .then((res) => {
        let secret = res?.data?.clientSecret;

        const options = {
          clientSecret: res?.data?.clientSecret,
        };

        // // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
        const elements = stripe.elements(options);
        this.elements = elements;

        // // Create and mount the Payment Element
        // const paymentElement = elements.create("payment");
        const cardElement = elements.create("card", {
          hidePostalCode: true,
        });
        // paymentElement.mount("#payment-element");
        cardElement.mount("#card-element");

        this.cardElement = cardElement;
      })
      .catch((error) => {
        console.log("error ", error.response.data);
      });
  },
  methods: {
    async formSubmit() {
      this.sendCardToken();

      return;
      const response = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements: this.elements,
        confirmParams: {
          return_url: `${window.location.origin}/add-card/success`,
        },
        redirect: "if_required",
      });

      const { error } = response;
      if (error) {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        const messageContainer = document.querySelector("#error-message");
        messageContainer.textContent = error.message;
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.

        const paymentIntent = response?.paymentIntent;
        const messageContainer = document.querySelector("#error-message");

        switch (paymentIntent.status) {
          case "succeeded":
            this.sendCardToken(paymentIntent);
            break;

          case "processing":
            messageContainer.textContent =
              "Payment processing. We'll update you when payment is received.";
            break;

          case "requires_payment_method":
            messageContainer.textContent =
              "Payment failed. Please try another payment method.";
            // Redirect your user back to your payment page to attempt collecting
            // payment again
            break;

          default:
            messageContainer.textContent = "Something went wrong.";
            break;
        }
      }
    },
    showSuccessModal() {
      this.$refs["my-modal"].show();
    },
    async sendCardToken() {
      const messageContainer = document.querySelector("#error-message");
      var cardElement = this.elements.getElement("card");

      let stripeRes = await stripe
        .createToken(cardElement, {
          currency: "usd",
        })
        .then(function (result) {
          // Handle result.error or result.token
          if (result.token) {
          } else {
            if (result.error) {
              messageContainer.textContent = result?.error?.message;
            }
          }

          return result;
        });

      if (stripeRes.token) {
        let data = {
          token: stripeRes?.token,
        };

        const config = {
          headers: {
            "x-access-token": this.$store.state.auth?.userData?.token,
          },
        };

        axios
          .post(
            "v1/merchant/stripe/add-card",
            {
              token: stripeRes?.token,
            },
            config
          )
          .then((res) => {
            this.showSuccessModal();
          })
          .catch((error) => {
            console.log("add card endpoint failed ", error?.response?.data);
            if (error?.response?.data) {
              messageContainer.textContent =
                error?.response?.data?.detail?.raw?.message ||
                error?.response?.data?.error;
              return;
            }
            messageContainer.textContent =
              "Error encountered while adding card";
          });
      }
    },
  },
};
</script>
