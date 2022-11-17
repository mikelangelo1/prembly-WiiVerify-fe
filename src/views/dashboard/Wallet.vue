<template>
  <dashboard-layout :pageName="'Wallet'">
    <div class="row">
      <div class="col-xxl-6 col-xl-6 col-lg-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Balance Details</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-12">
                <div class="total-balance">
                  <p>Available Balance</p>
                  <h2>${{ this.available_balance }}</h2>
                </div>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <div class="balance-stats active">
                  <p>Last Month</p>
                  <h3>${{ this.totalLastMonthAmount }}</h3>
                </div>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <div class="balance-stats">
                  <p>Transactions</p>
                  <h3>${{ this.transactions }}</h3>
                </div>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <div class="balance-stats">
                  <p>Paid in fees</p>
                  <h3>${{ this.paidInFees }}</h3>
                </div>
              </div>
              <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <div class="balance-stats">
                  <p>Pending Balance</p>
                  <h3>${{ pendingBalance }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xxl-6 col-xl-6 col-lg-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">My Invoices</h4>
            <!-- <router-link to="#">See More</router-link> -->
          </div>
          <div class="card-body">
            <div class="bills-widget">
              <div v-if="payouts.length == 0" style="">No payout yet</div>
              <div
                v-else
                class="bills-widget-content d-flex justify-content-between align-items-center active"
                v-for="(payout, index) in payouts"
                v-bind:key="payout.id"
              >
                <div>
                  <p class="text-success">Success Payout #{{ index + 1 }}</p>
                  <p class="text-success">
                    {{ moment(payout.payoutDate).format("DD/MM/YYYY HH:mm") }}
                  </p>
                  <h4>${{ payout.amount }}</h4>
                </div>
                <button :disabled="isGenerating" class="btn btn-primary">
                  <a
                    :href="payout.invoiceUrl"
                    @click.prevent="downloadItem(payout)"
                    class="text-light"
                  >
                    {{ isGenerating ? "Loading..." : "Download" }}
                  </a>
                </button>
                <!--
                <div id="generate-invoice">
                  <vue-html2pdf
                    :show-layout="controlValue.showLayout"
                    :float-layout="controlValue.floatLayout"
                    :enable-download="controlValue.enableDownload"
                    :preview-modal="controlValue.previewModal"
                    :filename="controlValue.filename"
                    :paginate-elements-by-height="
                      controlValue.paginateElementsByHeight
                    "
                    :pdf-quality="controlValue.pdfQuality"
                    :pdf-format="controlValue.pdfFormat"
                    :pdf-orientation="controlValue.pdfOrientation"
                    :pdf-content-width="controlValue.pdfContentWidth"
                    :manual-pagination="controlValue.manualPagination"
                    :html-to-pdf-options="htmlToPdfOptions"
                    @progress="onProgress($event)"
                    @startPagination="startPagination()"
                    @hasPaginated="hasPaginated()"
                    @beforeDownload="beforeDownload($event)"
                    @hasDownloaded="hasDownloaded($event)"
                    ref="html2Pdf"
                  >
                    <pdf-content
                      v-bind:merchantFullName="merchantFullName"
                      v-bind:merchantAddress="merchantAddress"
                      v-bind:payoutDetail="payout"
                      v-bind:merchant="merchant"
                      @domRendered="domRendered()"
                      slot="pdf-content"
                    />
                  </vue-html2pdf>

                  <section class="control-container">
                    <button
                      :disabled="isGenerating"
                      class="btn btn-primary"
                      @click="downloadPdf(index)"
                    >
                      {{ isGenerating ? "Loading..." : "Download" }}
                    </button>

                    <section class="invoice-progress-container">
                      <div class="invoice-progress-bar">
                        <div
                          class="invoice-progress"
                          :style="`width: ${progress}%;`"
                        />
                      </div>

                      <section class="generating-label" v-if="progress !== 0">
                        <span class="label-title">
                          {{
                            progress === 100
                              ? "Invoice Generated"
                              : "Generating Invoice"
                          }}
                        </span>

                        <span class="label-progress">
                          {{ `${progress} %` }}
                        </span>
                      </section>
                    </section>
                  </section>
                </div>
                -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xxl-12 col-xl-12 col-lg-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Payouts</h4>
          </div>
          <div class="card-body">
            <div class="unpaid-content">
              <ul>
                <li>
                  <p class="mb-0">Payout Method</p>
                  <h5 class="mb-0">External Account</h5>
                </li>
                <li>
                  <p class="mb-0">Future Payouts</p>
                  <h5 class="mb-0">${{ this.futurePayout }}</h5>
                </li>
                <li>
                  <p class="mb-0">Available Payouts</p>
                  <h5 class="mb-0">${{ this.availablePayout }}</h5>
                </li>
                <li>
                  <p class="mb-0">Total Paid</p>
                  <h5 class="mb-0">${{ this.totalPaid }}</h5>
                </li>
                <li>
                  <p class="mb-0">Next settlement</p>
                  <h5 class="mb-0" v-if="!this.nextPayoutDate == 'Nil'">
                    {{ this.nextPayoutDate }}
                  </h5>
                  <h5 class="mb-0" v-else>No payments yet</h5>
                </li>
                <li>
                  <p class="mb-0">Request</p>
                  <button
                    v-b-modal.requestPayout
                    class="btn btn-primary router-link-exact-active router-link-active"
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
    </div>
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
<style lang="scss" scoped module>
canvas {
  width: 470px !important;
  height: 251px !important;
}

.bankNamesWrapper {
  color: #fff;
}

.control-container {
  position: fixed;
  z-index: 999999;
  padding: 15px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 5px;
  right: 25px;
  top: 25px;
  width: 405px;
  box-shadow: 5px 5px 10px #000000;
  opacity: 50;
  max-height: calc(100vh - 50px);
  animation-name: animate-fade-in-top;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;

  .control-header {
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid #ccc;
  }

  .item-container {
    flex: 1 1 auto;
    overflow: auto;
    margin-bottom: 10px;

    .control-item {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;

      &:not(:last-child) {
        margin-bottom: 10px;
      }

      .control {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding-bottom: 5px;
        border-bottom: 1px solid #ccc;
        width: 100%;

        .item-label {
          margin-right: 15px;
          display: block;
          padding-bottom: 3px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .input-checkbox {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .input-box {
          flex: 1 1 auto;
          padding: 5px;
          border-radius: 3px;
          border: 1px solid white;
          width: 0;
        }
      }

      .options-container {
        width: 100%;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;

        .options-item {
          &:not(:last-child) {
            margin-bottom: 5px;
          }

          .options-title {
            margin-right: 10px;
            font-weight: 600;
          }

          .options-value {
            color: #3574b3;
          }
        }
      }
    }
  }

  .generate-btn {
    border: 0;
    padding: 15px 25px;
    border-radius: 5px;
    color: #fff;
    background: #0d40c6;
    transition: 0.3s;
    text-align: center;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
    }
  }

  .invoice-progress-container {
    width: 100%;
    margin-top: 10px;
  }
  .invoice-progress-bar {
    width: 100%;
    height: 10px;
    border: 1px solid #585858;
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: #2c3e50 !important;
  }
  .invoice-progress {
    width: 0%;
    height: 100%;
    transition: 0.3s;
    background: #2c3e50;
  }

  .generating-label {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}

#generate-invoice {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #141e30; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to bottom,
    #243b55,
    #141e30
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    #243b55,
    #141e30
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  flex-direction: column;
  overflow: hidden;
}
</style>
<script>
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";

import axios from "../../plugins/axios";
import moment from "moment";

import PdfContent from "../../components/Invoice/PdfContent.vue";
// import VueHtml2pdf from "@/components/VueHtml2pdf";
import ControlsContainer from "../../components/Invoice/ControlsContainer.vue";
import VueHtml2pdf from "vue-html2pdf";
import Userservices from "../../webServices/user.service.js";
// import VueHtml2pdf from "vue-html2pdf-test";

import { createHelpers } from "vuex-map-fields";

// `invoiceModule` is the name of the Vuex module.
import { mapFields } from "vuex-map-fields";
import Payout from "./Payout.vue";

export default {
  components: {
    DashboardLayout,
    VueHtml2pdf,
    PdfContent,
    ControlsContainer,
    Payout,
  },
  data: function () {
    return {
      cardAdded: false,
      paymentMethods: [],
      userData: undefined,
      merchant: undefined,
      stripeAccount: undefined,
      //
      externalAccounts: [],
      available_balance: 0,
      paidInFees: 0,
      pendingBalance: 0,
      totalAmount: 0,
      totalTxNo: 0,
      totalLastMonthAmount: 0,
      transactions: 0,
      feePercentage: 7,

      //
      futurePayout: 0,
      totalPaid: 0,
      availablePayout: 0,
      nextPayoutDate: "",
      //
      contentRendered: false,
      progress: 0,
      generatingPdf: false,
      pdfDownloaded: false,
      isGenerating: false,
      //Invoice
      payouts: [],
      merchantFullName: "",
      merchantAddress: "",
      merchantCountry: "",
      merchantCity: "",
      merchantBankName: "",
      merchantIBAN: "",
      paymentDescription: "",
      payoutAmount: "",
      finalPayoutAmount: "",
      pendingBalance: "",
      NumberofTransactions: "",
      isGenerating: false,
      // whole merchant
      merchant: {},
    };
  },
  mounted() {
    const chart = document.body.querySelector("#line-chart");
    if (chart) {
      const chart = document.querySelector("#line-chart");
      chart.style.height = "297px";
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
        this.stripeAccount = res?.data["stripe-account"];
        this.merchant = res?.data?.merchant;

        this.externalAccounts =
          res?.data["stripe-account"]?.external_accounts.data;
      })
      .catch((error) => {
        console.log("error loading profile ", error);
      });

    axios
      .get("v1/merchant/balance/balance-widget", config)
      .then((res) => {
        this.pendingBalance = res?.data?.pendingBalance;
        this.paidInFees = res?.data?.PaidInFees;
        this.available_balance = res?.data?.availableBalance;
        this.totalLastMonthAmount = res?.data?.lastMonthTransactions;
        this.transactions = res?.data?.CurrentMonthTransactions;
        // this.feePercentage = res?.data?.feePercentage;
      })
      .catch((error) => {
        console.log("error loading profile ", error);
      });

    axios
      .get("/v1/merchant/balance/payout-widget", config)
      .then((res) => {
        (this.futurePayout = res?.data?.currentFutureBalance),
          (this.totalPaid = res?.data?.currentTotalPayout),
          (this.availablePayout = res?.data?.currentAvailablePayout),
          (this.nextPayoutDate = res?.data?.nextPayoutDate);
      })
      .catch((error) => {
        console.log("error loading profile ", error);
      });

    this.getInvoiceDetails();
  },

  computed: {
    ...mapFields("invoiceModule", ["controlValue"]),

    htmlToPdfOptions() {
      return {
        margin: 0,

        filename: "cycopay invoice.pdf",

        image: {
          type: "jpeg",
          quality: 0.98,
        },

        enableLinks: true,

        html2canvas: {
          scale: this.controlValue.pdfQuality,
          useCORS: true,
        },

        jsPDF: {
          unit: "in",
          format: this.controlValue.pdfFormat,
          orientation: this.controlValue.pdfOrientation,
        },
      };
    },
  },

  methods: {
    moment: function () {
      return moment();
    },
    getClass(status) {
      return {
        "text-white bg-success": status == "completed",
        "text-white bg-danger": status == "failed" || status == "cancelled",
      };
    },
    downloadItem({ invoiceUrl, amount }) {
      axios
        .get(
          `https://cycosolution-merchant-payout-invoices.s3.us-east-2.amazonaws.com/${invoiceUrl}`,
          { responseType: "blob" }
        )
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/pdf" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = amount;
          link.click();
          URL.revokeObjectURL(link.href);
        })
        .catch(console.error);
    },
    async downloadPdf(index) {
      console.log("download pdf ", index);
      this.$refs?.html2Pdf[index].generatePdf();
      // this.$refs.html2Pdf.generatePdf();
    },

    onProgress(progress) {
      this.progress = progress;
    },

    startPagination() {
      console.log(`PDF has started pagination`);
    },

    hasPaginated() {
      console.log(`PDF has been paginated`);
    },

    async beforeDownload({ html2pdf, options, pdfContent }) {
      console.log(`On Before PDF Generation`);
      // await html2pdf().set(options).from(pdfContent).toPdf().get('pdf').then((pdf) => {
      // 	const totalPages = pdf.internal.getNumberOfPages()
      // 	for (let i = 1; i <= totalPages; i++) {
      // 		pdf.setPage(i)
      // 		pdf.setFontSize(10)
      // 		pdf.setTextColor(150)
      // 		pdf.text('Page ' + i + ' of ' + totalPages, (pdf.internal.pageSize.getWidth() * 0.88), (pdf.internal.pageSize.getHeight() - 0.3))
      // 	}
      // }).save()
    },

    hasDownloaded(blobPdf) {
      console.log(`PDF has downloaded yehey`);
      this.pdfDownloaded = true;
    },

    domRendered() {
      console.log("Dom Has Rendered");
      this.contentRendered = true;
    },

    onBlobGenerate(blob) {
      console.log(blob);
    },

    async getInvoiceDetails() {
      Userservices.getInvoiceDetails().then((res) => {
        this.merchantFullName = res?.data?.data?.name;
        this.paymentDescription = res?.data?.data?.description;
        this.payouts = res?.data?.data?.payout;
        // this.finalPayoutAmount = '',
        // this.pendingBalance = '',
        // this.NumberofTransactions = '',
      });
    },
  },
};
</script>
