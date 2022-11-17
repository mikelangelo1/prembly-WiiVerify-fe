<template>
  <dashboard-layout
    :pageName="'Payment Method(s)'"
    :settings="true"
    :activeSetting="5"
  >
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Linked Payment Method(s)</h4>
          </div>
          <div class="card-body">
            <div class="verify-content">
              <div class="d-flex align-items-center">
                <span class="me-3 icon-circle bg-primary text-white"
                  ><i
                    v-if="externalAccounts.paypal_email"
                    class="ri-paypal-fill"
                  ></i
                  ><i v-if="externalAccounts.iban" class="ri-bank-line"></i>
                </span>
                <div
                  v-if="
                    externalAccounts.iban == '' &&
                    externalAccounts.paypal_email == ''
                  "
                  style=""
                >
                  <div style="color: black">No payout method added yet.</div>

                  <button class="btn btn-primary" v-b-modal.addBankModal>
                    Add Method
                  </button>
                </div>
                <div class="primary-number" v-if="externalAccounts.iban">
                  <h5 class="mb-0">Bank Account</h5>
                  <small>Ending in {{ externalAccounts.last_4 }}</small>
                  <br />
                  <span class="text-success">Linked</span>
                </div>
                <div
                  v-if="externalAccounts.paypal_email"
                  class="primary-number"
                >
                  <h5 class="mb-0">PayPal Account</h5>
                  <small>Payout at: {{ externalAccounts.last_4 }}</small>
                  <br />
                  <span class="text-success">Linked</span>
                </div>
              </div>
              <!-- <button class=" btn btn-outline-primary">Manage</button>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <add-card />
    <add-bank />
    <success />
    <b-modal
      id="addBankModal"
      centered
      title="ADD PAYOUT METHOD"
      hide-header-close
      hide-footer
    >
      <add-bank-modal />
    </b-modal>
  </dashboard-layout>
</template>
<style module>
.buttonStyle {
  background-color: #0d40c6;
  border-color: #0d40c6;
}
button:hover {
  background-color: #4834d4;
  border-color: #0d40c6;
}
canvas {
  width: 470px !important;
  height: 251px !important;
}

.bankNamesWrapper {
  color: #fff;
}
</style>
<script>
import DashboardLayout from "../../../components/layouts/DashboardLayout.vue";
import AddBank from "../../../components/popup/AddBank.vue";
import AddCard from "../../../components/popup/AddCard.vue";
import Success from "../../../components/popup/Success.vue";
import AddBankModal from "../AddBank.vue";

import axios from "../../../plugins/axios";
import moment from "moment";

export default {
  components: { DashboardLayout, AddCard, Success, AddBank, AddBankModal },
  data: function () {
    return {
      cardAdded: false,
      paymentMethods: [],
      userData: undefined,
      merchant: undefined,
      stripeAccount: undefined,
      //
      externalAccounts: [],
      totalFees: 0,
      totalAmount: 0,
      totalTxNo: 0,
      totalLastMonthAmount: 0,
      transactions: [],
      feePercentage: 7,
    };
  },
  mounted() {
    const chart = document.body.querySelector("#line-chart");
    if (chart) {
      chart.style.height = "245px";
      chart.style.width = "100%";
    }

    const chart_ = document.querySelector("#doughnut-chart");
    if (chart_) {
      chart_.style.height = "300px";
    }

    //
    this.userData = this.$store.state.auth.userData;

    const config = {
      headers: {
        "x-access-token": this.userData?.token,
      },
    };

    axios
      .get("v1/merchant/dashboard", config)
      .then((res) => {
        // this.paymentMethods = res?.data?.paymentMethods;
        this.merchant = res?.data?.merchant;
        this.stripeAccount = res?.data["stripe-account"];
        const external_account = res?.data?.merchant.external_account;
        this.externalAccounts = external_account;

        this.totalFees = res?.data?.totalFees?.toFixed(2);
        this.totalAmount = res?.data?.totalAmount?.toFixed(2);
        this.totalTxNo = res.data?.totalTxNo;
        this.totalLastMonthAmount = res?.data?.totalLastMonthAmount?.toFixed(2);
        this.transactions = res?.data?.transactions;
        this.feePercentage = res?.data?.feePercentage;
      })
      .catch((error) => {
        console.log("error loading profile ", error);
      });
  },
  methods: {
    moment: function (date) {
      return moment(date);
    },
    getClass(status) {
      return {
        "text-white bg-success": status == "completed",
        "text-white bg-danger": status == "failed" || status == "cancelled",
      };
    },
  },
};
</script>
