<template>
  <dashboard-layout :pageName="'Payments'">
    <div class="row">
      <div class="col-xl-8 col-lg-7">
        <div
          id="user-activity"
          style="height: 95%"
          class="card"
          data-aos="fade-up"
        >
          <div class="card-header">
            <h4 class="card-title">Transactions Volume</h4>
          </div>
          <div class="card-body">
            <div class="tab-content" id="myTabContent">
              <div class="chartjs-size-monitor">
                <div class="chartjs-size-monitor-expand">
                  <div class=""></div>
                </div>
                <div class="chartjs-size-monitor-shrink">
                  <div class=""></div>
                </div>
              </div>
              <!-- <canvas id="activityBar"></canvas> -->
              <payments-chart
                v-if="loaded"
                :chartLabels="label"
                :chartData="datasets"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-lg-5">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Overview</h4>
          </div>
          <div class="card-body">
            <div class="unpaid-content">
              <ul>
                <li>
                  <p class="mb-0">Service</p>
                  <h5 class="mb-0">Cards</h5>
                </li>
                <li>
                  <p class="mb-0">Total card transactions</p>
                  <h5 class="mb-0">${{ this.totalCardtransactions }}</h5>
                </li>
                <li>
                  <p class="mb-0">Card transactions current month</p>
                  <h5 class="mb-0">${{ this.cardTransactionsCurrentmonth }}</h5>
                </li>
                <li>
                  <p class="mb-0">Total gain value</p>
                  <h5 class="mb-0">${{ this.totalGainValue }}</h5>
                </li>
                <li>
                  <p class="mb-0">Total gain value current month</p>
                  <h5 class="mb-0">${{ this.totalGainValueCurrentMonth }}</h5>
                </li>
                <li>
                  <p class="mb-0">Net volume</p>
                  <h5 class="mb-0">${{ this.netVolume }}</h5>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Payments</h4>
          </div>
          <div class="card-body">
            <div class="payments-content">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="paymentDetails in pageOfItems"
                      v-bind:key="paymentDetails.id"
                    >
                      <td>{{ paymentDetails.id }}</td>
                      <td>{{ paymentDetails.email }}</td>
                      <td>${{ paymentDetails.amount }}</td>
                      <td>
                        {{
                          moment(paymentDetails.created).format(
                            "MMMM DD[,] YYYY"
                          )
                        }}
                      </td>
                      <td>
                        <span
                          v-bind:class="getButtonClass(paymentDetails.status)"
                        >
                          {{
                            paymentDetails.status == "completed" ? "Paid" : null
                          }}
                          {{
                            paymentDetails.status == "pending" ? "Due" : null
                          }}
                          {{
                            paymentDetails.status == "failed" ? "Failed" : null
                          }}
                          {{
                            paymentDetails.status == "cancelled"
                              ? "Cancelled"
                              : null
                          }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  v-if="pageOfItems.length < 1"
                  style="text-align: center; margin-bottom: 30px"
                  class="mt-4"
                >
                  <p
                    style="
                      text-align: center;
                      font-weight: 800 !important;
                      color: d3d3d3 !important;
                      font-size: 36px !important;
                      letter-spacing: -0.034em;
                    "
                  >
                    No payments found... 🥺
                  </p>
                </div>
                <div class="card-footer pb-0 pt-3">
                  <ul
                    v-if="pager.pages && pager.pages.length"
                    class="pagination"
                  >
                    <li
                      :class="{ disabled: pager.currentPage === 1 }"
                      class="page-item first-item"
                    >
                      <router-link
                        :to="{ query: { page: 1 } }"
                        class="page-link"
                        >First</router-link
                      >
                    </li>
                    <li
                      :class="{ disabled: pager.currentPage === 1 }"
                      class="page-item previous-item"
                    >
                      <router-link
                        :to="{ query: { page: pager.currentPage - 1 } }"
                        class="page-link"
                        >Previous</router-link
                      >
                    </li>
                    <li
                      v-for="page in pager.pages"
                      :key="page"
                      :class="{ active: pager.currentPage === page }"
                      class="page-item number-item"
                    >
                      <router-link
                        :to="{ query: { page: page } }"
                        class="page-link"
                        >{{ page }}</router-link
                      >
                    </li>
                    <li
                      :class="{
                        disabled: pager.currentPage === pager.totalPages,
                      }"
                      class="page-item next-item"
                    >
                      <router-link
                        :to="{ query: { page: pager.currentPage + 1 } }"
                        class="page-link"
                        >Next</router-link
                      >
                    </li>
                    <li
                      :class="{
                        disabled: pager.currentPage === pager.totalPages,
                      }"
                      class="page-item last-item"
                    >
                      <router-link
                        :to="{ query: { page: pager.totalPages } }"
                        class="page-link"
                        >Last</router-link
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dashboard-layout>
</template>

<script>
import PaymentsChart from "../../components/charts/PaymentsChart.vue";
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
import axios from "../../plugins/axios";
import moment from "moment";
import Userservice from "../../webServices/user.service";
export default {
  components: { DashboardLayout, PaymentsChart },
  data() {
    return {
      //
      loaded: false,
      label: [],
      datasets: [],
      //
      totalCardtransactions: 0,
      cardTransactionsCurrentmonth: 0,
      totalGainValue: 0,
      totalGainValueCurrentMonth: 0,
      netVolume: 0,
      //
      payments: [],
      //
      allPaymentRecord: undefined,
      latestPaymentRecord: [""],
      currentPage: 1,
      perPage: 7,
      pages: [],
      page: 1,
      pager: {},
      pageOfItems: [],
    };
  },
  async mounted() {
    const chart = document.querySelector("#bar-chart");
    if (chart) {
      chart.style.height = "290px";
      chart.style.width = "100%";
    }
    // chart_.style.width = "90px";
    //
    this.userData = this.$store.state.auth.userData;
    const config = {
      headers: {
        "x-access-token": this.userData?.token,
      },
    };
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
    // Overview Widget
    axios.get("v1/merchant/balance/balance-widget", config).then((res) => {
      (this.totalCardtransactions = res?.data?.TotalAllTimeRecievedPayment),
        (this.cardTransactionsCurrentmonth =
          res?.data?.CurrentMonthTransactions),
        (this.totalGainValue = res?.data?.TotalAllTimeRecievedPayment),
        (this.totalGainValueCurrentMonth = res?.data?.CurrentMonthTransactions),
        (this.netVolume = res.data.currentMonthNetVolumeAfterFees);
    });
    this.getPaymentData();
  },
  created() {
    this.getlastestPaymentRecord();
  },
  methods: {
    async getPaymentData() {
      Userservice.getPayments()
        .then((res) => {
          this.payments = res?.data?.payments;
        })
        .catch((err) => {
          console.log("error loading tx summary");
        });
    },
    getButtonClass(status) {
      return {
        "badge px-3 py-2 bg-success": status == "completed",
        "badge px-3 py-2 bg-danger":
          status == "failed" || status == "cancelled",
        "badge px-3 py-2 bg-warning": status == "pending",
      };
    },
    moment: function (date) {
      return moment(date);
    },

    onPageChange(page) {
      this.currentPage = page;
    },
    getlastestPaymentRecord() {
      let data = [];
      for (let i = 0; i < data.length; i++) {
        this.latestPaymentRecord.push({
          id: this.allPaymentRecord[i].id,
          email: this.allPaymentRecord[i].email,
          ampunt: this.allPaymentRecord[i].amount,
          created: this.allPaymentRecord[i].created,
          status: this.allPaymentRecord[i].status,
          // completedpayment: data[i].payments.length
        });
      }
    },

    setPages() {
      let numberOfPages = Math.ceil(
        this.latestPaymentRecord.length / this.perPage
      );
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    paginate(latestPaymentRecord) {
      let page = this.page;
      let perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      return latestPaymentRecord.slice(from, to);
    },
  },
  computed: {
    displayedPaymentRecord() {
      return this.paginate(this.latestPaymentRecord);
    },
  },

  watch: {
    "$route.query.page": {
      immediate: true,
      handler(page) {
        page = parseInt(page) || 1;
        const config = {
          headers: {
            "x-access-token": this.$store.state.auth?.userData?.token,
          },
        };

        if (page !== this.pager.currentPage) {
          axios.get(`v1/merchant/payment?page=${page}`).then((response) => {
            let { pager, pageOfItems } = response.data;

            this.pager = pager;
            this.pageOfItems = pageOfItems;
          });
        }
      },
    },
  },
};
</script>
