<template>
  <dashboard-layout :pageName="'Payment Links'">
    <div class="row">
      <div class="col-xl-3 col-sm-6">
        <div class="stat-widget d-flex align-items-center bg-white">
          <div class="widget-icon me-3 bg-primary">
            <span><i class="ri-file-copy-2-line"></i></span>
          </div>
          <div class="widget-content">
            <h3>{{ totalPaymentLinks }}</h3>
            <p>Total Payment Links</p>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6">
        <div class="stat-widget d-flex align-items-center bg-white">
          <div class="widget-icon me-3 bg-success">
            <span><i class="ri-file-list-3-line"></i></span>
          </div>
          <div class="widget-content">
            <h3>{{ totalPaidPaymentLinks }}</h3>
            <p>Paid Payment Links</p>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6">
        <div class="stat-widget d-flex align-items-center bg-white">
          <div class="widget-icon me-3 bg-warning">
            <span><i class="ri-file-paper-line"></i></span>
          </div>
          <div class="widget-content">
            <h3>{{ totalUnpaidPaymentLinks }}</h3>
            <p>Unpaid Payment Links</p>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6">
        <div class="stat-widget d-flex align-items-center bg-white">
          <div class="widget-icon me-3 bg-danger">
            <span><i class="ri-file-paper-2-line"></i></span>
          </div>
          <div class="widget-content">
            <h3>{{ totalCancelledPaymentLinks }}</h3>
            <p>Canceled Payment Links</p>
          </div>
        </div>
      </div>
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header flex-row">
            <h4 class="card-title">Payment Links</h4>
            <button class="btn btn-primary" v-b-modal.createInvoice>
              <span><i class="bi bi-plus"></i></span>Create a Payment Link
            </button>
          </div>
          <div class="card-body">
            <div class="invoice-table">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(paymentLink, index) in pageOfItems"
                      v-bind:key="paymentLink._id"
                    >
                      <td @click="copyToClipBoard(paymentLink, index)">
                        <input
                          type="hidden"
                          :value="paymentLink.link"
                          ref="copySingleLink"
                        />
                        <a style="color: #0d40c6; cursor: pointer"
                          ><i class="ri-file-copy-fill"></i> Copy</a
                        >
                      </td>
                      <td>{{ paymentLink.id }}</td>
                      <td>${{ paymentLink.amount }}</td>
                      <td>
                        <span v-bind:class="getButtonClass(paymentLink.status)">
                          {{
                            paymentLink.status == "completed" ? "Paid" : null
                          }}
                          {{ paymentLink.status == "pending" ? "Due" : null }}
                          {{ paymentLink.status == "failed" ? "Failed" : null }}
                          {{
                            paymentLink.status == "cancelled"
                              ? "Cancelled"
                              : null
                          }}
                        </span>
                      </td>
                      <td>
                        {{
                          moment(paymentLink.created).format("MMMM DD[,] YYYY")
                        }}
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
                    No links found... 🥺
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
    <b-modal
      id="createInvoice"
      centered
      title="CREATE A PAYMENT LINK"
      hide-header-close
      hide-footer
    >
      <create-invoice @paymentLinks="fetchPaymentLinksRecord" />
    </b-modal>
  </dashboard-layout>
</template>

<style scoped>
#custom-target {
  position: relative;
  width: 600px;
  height: 300px;
  border-style: solid;
}
.position-absolute {
  position: absolute;
}
</style>

<script>
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
import axios from "../../plugins/axios";
import moment from "moment";
import CreateInvoice from "./CreateInvoice.vue";
import Userservice from "../../webServices/user.service";
export default {
  components: { DashboardLayout, CreateInvoice },
  data: function () {
    return {
      totalPaidPaymentLinks: 0,
      totalPaymentLinks: 0,
      totalUnpaidPaymentLinks: 0,
      totalCancelledPaymentLinks: 0,
      //
      paymentLinks: [],
      //
      allPayments: undefined,
      latestPayment: [""],
      currentPage: 1,
      perPage: 7,
      pages: [],
      page: 1,
      pager: {},
      pageOfItems: [],
      //
      click: false,
    };
  },
  mounted() {
    this.getTxSummary();
    this.getPaymentLinks();
  },
  created() {
    this.getlastestPaymentLinks();
  },
  methods: {
    async getTxSummary() {
      Userservice.getPaymentSummary()
        .then((res) => {
          const {
            totalPaidPaymentLinks,
            totalPaymentLinks,
            totalUnpaidPaymentLinks,
            totalCancelledPaymentLinks,
          } = res.data;
          this.totalPaidPaymentLinks = totalPaidPaymentLinks;
          this.totalPaymentLinks = totalPaymentLinks;
          this.totalUnpaidPaymentLinks = totalUnpaidPaymentLinks;
          this.totalCancelledPaymentLinks = totalCancelledPaymentLinks;
        })
        .catch((err) => {
          console.log("error loading tx summary");
        });
    },
    fetchPaymentLinksRecord(e) {
      this.getTxSummary();
      this.getLinks();
    },
    async getPaymentLinks() {
      Userservice.getPaymentLinks()
        .then((res) => {
          this.paymentLinks = res?.data?.payments;
        })
        .catch((err) => {
          console.log("error loading tx links");
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
    copyToClipBoard(paymentLink, position) {
      if (paymentLink.status == "cancelled") {
        return;
      }
      let Url = this.$refs.copySingleLink[position];
      Url.setAttribute("type", "text");
      Url.select();
      try {
        document.execCommand("copy");
        Url.setAttribute("type", "hidden");
        this.$toast.success("Successfully copied link.");
      } catch (err) {
        this.$toast.error("Could not copy link");
      }
    },
    onPageChange(page) {
      this.currentPage = page;
    },
    getlastestPaymentLinks() {
      let data = [];
      for (let i = 0; i < data.length; i++) {
        this.latestPayment.push({
          id: this.allPayments[i]._id,
          amount: this.allPayments[i].amount,
          status: this.allPayments[i].status,
          created: this.allPayments[i].created,
          // completedpayment: data[i].payments.length
        });
      }
    },
    getLinks() {
      let page = 1;
      const config = {
        headers: {
          "x-access-token": this.$store.state.auth?.userData?.token,
        },
      };

      axios.get(`v1/merchant/payment/links?page=${page}`).then((response) => {
        let { pager, pageOfItems } = response.data;
        this.pager = pager;
        this.pageOfItems = pageOfItems;
      });
    },
    setPages() {
      let numberOfPages = Math.ceil(this.latestPayment.length / this.perPage);
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    paginate(latestPayment) {
      let page = this.page;
      let perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      return latestPayment.slice(from, to);
    },
  },
  computed: {
    displayedPayments() {
      return this.paginate(this.latestPayment);
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
          axios
            .get(`v1/merchant/payment/links?page=${page}`)
            .then((response) => {
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
