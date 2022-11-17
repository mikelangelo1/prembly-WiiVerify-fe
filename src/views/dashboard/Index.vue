<template>
  <dashboard-layout :pageName="'Your Dashboard'">
    <div class="row">
      <div v-if="merchant">
        <div
          v-if="
            merchant.promotion &&
            merchant.available_balance < 6 &&
            merchant.pending_balance <= 0
          "
        >
          <div class="alert alert-success alert-white rounded">
            <div class="icon"><i class="fa fa-success-circle"></i></div>
            <p style="font-size: 1.6rem">
              <strong>You have 5$ in promotional balance.</strong> You can
              request a payout if you process 1$ in payments, the minimum payout
              is 6$.
            </p>
          </div>
        </div>

        <!-- initial alert -->
        <div v-if="!externalAccounts.iban && !externalAccounts.paypal_email">
          <div class="onboarding">
            <div class="onboarding-heading">
              <span>
                <p
                  class="onboarding-title"
                  style="font-weight: 800px !important"
                >
                  Welcome to SwiftPay! 👋
                </p>
                <h5 style="letter-spacing: -0.005625rem !important">
                  Let’s get started with your account setup!
                </h5>
              </span>
            </div>
            <div class="onboarding-button">
              <button class="btn btn-primary btn-fw" v-b-modal.Onboarding>
                Start set up!
              </button>
            </div>
          </div>
        </div>

        <!-- next alert -->
        <div v-if="!isVerified && externalAccounts.length < 0">
          <div class="alert alert-info alert-white rounded">
            <div class="icon"><i class="fa fa-info-circle"></i></div>
            <p style="font-size: 1.6rem">
              <strong>To utilize SwiftPay:</strong> Proceed to verify your
              account
              <router-link to="/verify-account" style="color: white">
                <button
                  class="btn btn-primary router-link-exact-active router-link-active"
                  href="/verify-account"
                >
                  Verify
                </button>
              </router-link>
            </p>
          </div>
        </div>
      </div>

      <div class="col-xl-6 col-lg-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Current Statistics</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <div class="stat-widget d-flex align-items-center">
                  <div class="widget-icon me-3 bg-primary">
                    <span><i class="ri-wallet-line"></i></span>
                  </div>
                  <div class="widget-content">
                    <h3 v-if="merchant">${{ merchant.available_balance }}</h3>
                    <p>Available Balance</p>
                  </div>
                </div>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <div class="stat-widget d-flex align-items-center">
                  <div class="widget-icon me-3 bg-secondary">
                    <span><i class="ri-wallet-2-line"></i></span>
                  </div>
                  <div class="widget-content">
                    <h3 v-if="merchant">
                      ${{ merchant.pending_balance.toFixed(2) }}
                    </h3>
                    <p>Pending Balance</p>
                  </div>
                </div>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <div class="stat-widget d-flex align-items-center">
                  <div class="widget-icon me-3 bg-success">
                    <span><i class="ri-wallet-3-line"></i></span>
                  </div>
                  <div class="widget-content">
                    <h3>1.5% + 0.35$</h3>
                    <p>Charge Fee</p>
                  </div>
                </div>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <div class="stat-widget d-flex align-items-center">
                  <div class="widget-icon me-3 bg-danger">
                    <span><i class="ri-wallet-3-line"></i></span>
                  </div>
                  <div class="widget-content">
                    <h3>{{ totalTxNo }}</h3>
                    <p>Number of Transactions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xxl-6 col-xl-6 col-lg-6">
        <div id="user-activity" class="card" data-aos="fade-up">
          <div class="card-header">
            <h4 class="card-title">Transactions Volume</h4>
          </div>
          <div class="card-body">
            <div class="chartjs-size-monitor">
              <div class="chartjs-size-monitor-expand">
                <div class=""></div>
              </div>
              <div class="chartjs-size-monitor-shrink">
                <div class=""></div>
              </div>
            </div>
            <!-- <canvas id="activity"></canvas> -->
            <div id="activity">
              <activity-chart
                v-if="loaded"
                :chartLabels="label"
                :chartData="datasets"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-xxl-6 col-xl-6 col-lg-6 col-md-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Payouts</h4>
          </div>
          <div class="card-body">
            <div class="unpaid-content">
              <ul>
                <li>
                  <p class="mb-0">Payout Method</p>
                  <h5 class="mb-0">
                    <i
                      v-if="externalAccounts.paypal_email"
                      class="ri-paypal-fill"
                    ></i
                    ><i v-if="externalAccounts.iban" class="ri-bank-line"></i>
                    External Account
                  </h5>
                </li>
                <li>
                  <p class="mb-0">Pending Balance</p>
                  <h5 v-if="merchant" class="mb-0">
                    ${{ this.merchant.pending_balance.toFixed(2) }}
                  </h5>
                </li>
                <li>
                  <p class="mb-0">Available Balance</p>
                  <h5 v-if="merchant" class="mb-0">
                    ${{ this.availablePayout }}
                  </h5>
                </li>
                <li>
                  <p class="mb-0">Total Paid</p>
                  <h5 class="mb-0">${{ this.totalPaid }}</h5>
                </li>
                <li>
                  <p class="mb-0">Next settlement</p>

                  <h5 class="mb-0" v-if="this.nextPayoutDate == 'Nil'">
                    No payments yet
                  </h5>

                  <h5 class="mb-0" v-else>
                    {{ this.nextPayoutDate }}
                  </h5>
                </li>
                <li>
                  <p class="mb-0">Request</p>
                  <button
                    v-b-modal.requestPayout
                    class="btn btn-success fw-5 router-link-exact-active router-link-active"
                    aria-current="page"
                  >
                    Request Payout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xxl-6 col-xl-6 col-lg-6 col-md-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Balance Details</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-12">
                <div class="total-balance">
                  <p>Available Balance</p>
                  <h2 v-if="merchant">
                    ${{ this.merchant.available_balance }}
                  </h2>
                </div>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <div class="balance-stats active">
                  <p>Last Month</p>
                  <h3>${{ totalLastMonthAmount }}</h3>
                </div>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <div class="balance-stats">
                  <p>Transactions</p>
                  <h3>${{ totalAmount }}</h3>
                </div>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <div class="balance-stats">
                  <p>Paid in fees</p>
                  <h3>${{ paidInFees }}</h3>
                </div>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <div class="balance-stats">
                  <p>Pending Balance</p>
                  <h3 v-if="merchant">
                    ${{ this.merchant.pending_balance.toFixed(2) }}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-6 col-lg-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Transactions History</h4>
            <a href="/bill">See more</a>
          </div>
          <div class="card-body">
            <perfect-scrollbar class="invoice-content" style="height: 90px">
              <ul v-if="transactions != 0.0">
                <!-- transactions loop starts  -->
                <li
                  v-for="transaction in transactions"
                  :key="transaction.id"
                  class="d-flex justify-content-between active"
                >
                  <div class="d-flex align-items-center">
                    <div class="invoice-user-img me-3">
                      <img
                        src="../../assets/images/avatar/1.jpg"
                        alt=""
                        width="50"
                      />
                    </div>

                    <div class="invoice-info">
                      <h5 v-if="transaction.billingDetails" class="mb-0">
                        {{ transaction.billingDetails.name }}
                      </h5>
                      <p>
                        {{
                          moment(transaction.created).format(
                            "DD MMMM YYYY [at] hh:mm a"
                          )
                        }}
                      </p>
                    </div>
                  </div>
                  <div class="text-end">
                    <h5 class="mb-2">
                      +{{ approximateAmount(transaction.amount) }}
                    </h5>
                    <span
                      v-bind:class="getClass(transaction.status)"
                      class="py-2 px-4 rounded-1"
                    >
                      {{ transaction.status }}
                    </span>
                    <!-- <span class="text-white bg-dark">Canceled</span> -->
                    <!-- <span class="text-white bg-danger">Failed</span> -->
                  </div>
                </li>
                <!-- transactions loop ends  -->
              </ul>
            </perfect-scrollbar>
          </div>
        </div>
      </div>
      <div class="col-xl-6 col-lg-12">
        <div class="credit-card visa" style="min-height: 85%">
          <div class="type-brand">
            <h4>
              <i
                v-if="externalAccounts.paypal_email"
                class="ri-paypal-fill"
              ></i>
              <i v-if="externalAccounts.iban" class="ri-bank-line"></i>
              External Account
            </h4>

            <!-- <img src="../../assets/images/cc/visa.png" alt="" /> -->
          </div>
          <div
            v-if="
              externalAccounts.iban == '' && externalAccounts.paypal_email == ''
            "
            style=""
          >
            <div style="color: white">No account added yet.</div>
            <!-- <router-link to="/add-bank"> -->
            <button class="btn btn-primary mt-2" v-b-modal.addBank>
              Add Payout Method
            </button>
            <!--</router-link> -->
          </div>

          <div :class="$style.bankNamesWrapper" v-if="externalAccounts.iban">
            <p v-if="externalAccounts.swift_code !== ''">
              {{ externalAccounts.swift_code }}
            </p>
            <p v-if="externalAccounts.iban !== ''">
              Ending in {{ externalAccounts.last_4 }}
            </p>
            <p>{{ externalAccounts.account_holder_name }}</p>
            <!-- <h6>{{ paymentMethods[0].card.last4 }}</h6> -->
          </div>

          <div
            :class="$style.bankNamesWrapper"
            v-if="externalAccounts.paypal_email"
          >
            <p v-if="externalAccounts.paypal_email !== ''">
              Payout at:
              {{ externalAccounts.paypal_email }}
            </p>
            <p>{{ externalAccounts.account_holder_name }}</p>
            <!-- <h6>{{ paymentMethods[0].card.last4 }}</h6> -->
          </div>
        </div>
      </div>
    </div>

    <b-modal
      id="addBank"
      centered
      title="ADD PAYOUT METHOD"
      hide-header-close
      hide-footer
    >
      <add-bank />
    </b-modal>
    <b-modal
      id="Onboarding"
      centered
      title="SET UP YOUR ACCOUNT"
      hide-header-close
      hide-footer
    >
      <Onboarding />
    </b-modal>
    <b-modal
      id="requestPayout"
      centered
      title="REQUEST PAYOUT"
      hide-header-close
      hide-footer
    >
      <payout />
    </b-modal>
  </dashboard-layout>
</template>

<style module>
.close {
  color: #000 !important;
  padding: 2px 10px !important;
}
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
@media only screen and (max-width: 575px) {
  canvas {
    width: 450px !important;
    height: 251px !important;
  }
}
@media only screen and (min-width: 768px) {
  canvas {
    width: 500px !important;
    height: 251px !important;
  }
}
@media only screen and (max-width: 900px) {
  canvas {
    width: 750px !important;
    height: 251px !important;
  }
}
@media only screen and (max-width: 1199px) {
  canvas {
    width: 500px !important;
    height: 251px !important;
  }
}
@media only screen and (min-width: 1200px) {
  canvas {
    width: 500px !important;
    height: 251px !important;
  }
}
</style>

<script>
import ActivityChart from "../../components/charts/ActivityChart.vue";
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
import AddBank from "./AddBank.vue";
import Onboarding from "./Onboarding.vue";
import Payout from "./Payout.vue";
import axios from "../../plugins/axios";
import moment from "moment";
import Userservice from "../../webServices/user.service.js";
export default {
  components: { DashboardLayout, ActivityChart, AddBank, Onboarding, Payout },
  data: function () {
    return {
      cardAdded: false,
      paymentMethods: [],
      userData: undefined,
      merchant: undefined,
      stripeAccount: undefined,
      isVerified: "",
      externalAccounts: [],
      totalFees: 0,
      totalAmount: 0,
      totalTxNo: 0,
      totalLastMonthAmount: 0,
      transactions: [],
      feePercentage: 0.8,
      nextPayoutDate: "",
      paidInFees: 0,
      loaded: false,
      label: [],
      datasets: [],
      //
      totalPaid: 0,
      availablePayout: 0,
    };
  },
  async mounted() {
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
        console.log(external_account);
        this.totalFees = res?.data?.totalFees?.toFixed(2);
        this.totalAmount = res?.data?.totalAmount?.toFixed(2);
        this.totalTxNo = res.data?.totalTxNo;
        this.transactions = res?.data?.transactions || [];
        this.feePercentage = res?.data?.feePercentage;
        this.isVerified = res?.data?.merchant.isVerified;
      })
      .catch((error) => {
        console.log("error loading profile ", error);
      });
    let startdate = moment().subtract(12, "days").utc().toISOString();
    let endDate = moment(new Date()).utc().toISOString();
    const data = {
      startDate: startdate,
      endDate: endDate,
    };
    this.loaded = false;
    try {
      await axios
        .post("v1/merchant/payment/payment-data", data, config)
        .then((res) => {
          this.label = res?.data?.label;
          this.datasets = res?.data?.data;
        });
      this.loaded = true;
    } catch (err) {
      console.log(err);
    }
    //
    axios
      .get("v1/merchant/balance/balance-widget", config)
      .then((res) => {
        this.pendingBalance = res?.data?.pendingBalance;
        this.paidInFees = res?.data?.PaidInFees;
        this.available_balance = res?.data?.availableBalance;
        this.totalLastMonthAmount = res?.data?.lastMonthTransactions;
        // this.transactions = res?.data?.CurrentMonthTransactions;
        // this.feePercentage = res?.data?.feePercentage;
      })
      .catch((error) => {
        console.log("error loading profile ", error);
      });

    axios
      .get("/v1/merchant/balance/payout-widget", config)
      .then((res) => {
        this.availablePayout = res?.data?.currentAvailablePayout;
      })
      .catch((error) => {
        console.log("error loading profile ", error);
      });
    //
    Userservice.getPayoutDetails().then((res) => {
      this.nextPayoutDate = res?.data?.nextPayoutDate;
      this.totalPaid = res?.data?.currentTotalPayout;
    });
  },
  methods: {
    moment: function (date) {
      return moment(date);
    },
    gotosite() {
      window.location.href = "https://discord.gg/kNA4AeGz92";
    },
    getClass(status) {
      return {
        "text-white bg-success": status == "completed",
        "text-white bg-danger": status == "failed" || status == "cancelled",
      };
    },
    approximateAmount(_amount) {
      return _amount?.toFixed(2);
    },
  },
};
</script>
