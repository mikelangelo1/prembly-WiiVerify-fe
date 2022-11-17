<template>
  <section class="pdf-content">
    <section class="report-info">
      <section class="image-container">
        <img
          class="cycopay-logo"
          :src="logo"
          alt="Cycopay Logo"
          ref="CycopayLogo"
        />
      </section>
      <section class="invoice-content">
        <div class="container d-flex justify-content-center mt-50 mb-50">
          <div class="row">
            <div class="col-md-12">
              <div class="card" id="invoice">
                <div class="card-header bg-transparent header-elements-inline">
                  <h6 class="card-title text-primary">Payout invoice</h6>
                </div>
                <div class="card-body">
                  <div class="row">
                    <!-- Cycopay solutions details-->
                    <div class="col-sm-6">
                      <div class="mb-4 pull-left">
                        <ul class="list list-unstyled mb-0 text-left">
                          <li>CycoPay address</li>
                          <li>Cycopay city</li>
                          <li>+1 474 44737 47</li>
                        </ul>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="mb-4">
                        <div v-if="payoutDetail" class="text-sm-right">
                          <h4 class="invoice-color mb-2 mt-md-2">
                            Invoice #{{ payoutDetail._id }}
                          </h4>
                          <ul class="list list-unstyled mb-0">
                            <li>
                              Date:
                              <span class="font-weight-semibold">{{
                                moment(payoutDetail.payoutDate).format(
                                  "DD/MM/YYYY"
                                )
                              }}</span>
                            </li>
                            <li>
                              Due date:
                              <span class="font-weight-semibold">{{
                                moment(payoutDetail.payoutDate)
                                  .add(8, "days")
                                  .format("DD/MM/YYYY")
                              }}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Merchant details-->
                  <div v-if="merchant" class="d-md-flex flex-md-wrap">
                    <div class="mb-4 mb-md-2 text-left">
                      <span class="text-muted">Invoice To:</span>
                      <ul class="list list-unstyled mb-0">
                        <li>
                          <h5 class="my-2">
                            {{ merchant.firstName }} {{ merchant.lastName }}
                          </h5>
                        </li>
                        <li>
                          <span class="font-weight-semibold">{{
                            merchant.line1
                          }}</span>
                        </li>
                        <li>{{ merchant.city }}</li>
                        <li>{{ merchant.phone_number }}</li>
                        <li>
                          <a href="#" data-abc="true">{{ merchant.email }}</a>
                        </li>
                      </ul>
                    </div>
                    <div class="mb-2 ml-auto">
                      <span class="text-muted">Payment Details:</span>
                      <div class="d-flex flex-wrap wmin-md-400">
                        <ul class="list list-unstyled mb-0 text-left">
                          <li>
                            <h5 class="my-2">Total Due:</h5>
                          </li>
                          <li>Bank name:</li>
                          <li>Country:</li>
                          <li>City:</li>
                          <li>Address:</li>
                        </ul>
                        <ul class="list list-unstyled text-right mb-0 ml-auto">
                          <li>
                            <h5 class="font-weight-semibold my-2">
                              $1{{ payoutDetail.amountAfterFees / 100 }}
                            </h5>
                          </li>
                          <li>
                            <span class="font-weight-semibold"
                              >Hong Kong Bank</span
                            >
                          </li>
                          <li>{{ merchant.country }}</li>
                          <li>{{ merchant.city }}</li>
                          <li>New standard</li>

                          <li>
                            <span class="font-weight-semibold">{{
                              merchant.line1
                            }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="table-responsive">
                  <table class="table table-lg">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Amount (Received payment)</th>
                        <th>Deducted Fees</th>
                        <th>Final Payout Amount</th>
                        <th>Pending Balance</th>
                        <th>Charge Fee</th>
                        <th>Number of Transactions</th>
                      </tr>
                    </thead>
                    <tbody v-if="payoutDetail">
                      <tr>
                        <td>
                          <h6 class="mb-0">{{ payoutDetail.description }}</h6>
                        </td>
                        <td>${{ payoutDetail.amount / 100 }}</td>
                        <td>
                          ${{
                            (payoutDetail.amount -
                              payoutDetail.amountAfterFees) /
                            100
                          }}
                        </td>
                        <td>
                          <span class="font-weight-semibold"
                            >${{ payoutDetail.amountAfterFees / 100 }}</span
                          >
                        </td>
                        <td>${{ merchant.pending_balance }}</td>
                        <td>7%</td>
                        <td>1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="card-body">
                  <div class="d-md-flex flex-md-wrap">
                    <div class="pt-2 mb-3 wmin-md-400 ml-auto">
                      <h6 class="mb-3 text-left">Total due</h6>
                      <div class="table-responsive">
                        <table class="table">
                          <tbody>
                            <tr>
                              <th class="text-left">Subtotal:</th>
                              <td class="text-right">
                                ${{ payoutDetail.amountAfterFees / 100 }}
                              </td>
                            </tr>
                            <tr>
                              <th class="text-left">
                                Payout Fee:
                                <span class="font-weight-normal">(25%)</span>
                              </th>
                              <td class="text-right">
                                ${{
                                  (payoutDetail.amount -
                                    payoutDetail.amountAfterFees) /
                                  100
                                }}
                              </td>
                            </tr>
                            <tr>
                              <th class="text-left">Total:</th>
                              <td class="text-right text-primary">
                                <h5 class="font-weight-semibold">
                                  ${{ payoutDetail.amount / 100 }}
                                </h5>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer">
                    <span class="text-muted"
                      >Cycopay Adminstrative Department</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </section>
</template>

<script>
import moment from "moment";
import logo from "../../assets/images/logoi.png";

export default {
  props: {
    merchantFullName: {
      type: String,
      default: null,
    },
    merchantAddress: {
      type: String,
      default: null,
    },
    merchantCity: {
      type: String,
      default: null,
    },
    merchantCountry: {
      type: String,
      default: null,
    },
    merchantBankName: {
      type: String,
      default: null,
    },
    merchantIBAN: {
      type: String,
      default: null,
    },
    paymentDescription: {
      type: String,
      default: null,
    },
    payoutAmount: {
      type: Number,
      default: null,
    },
    finalPayoutAmount: {
      type: Number,
      default: null,
    },
    pendingBalance: {
      type: String,
      default: null,
    },
    NumberofTransactions: {
      type: String,
      default: null,
    },
    //
    payoutDetail: {
      type: Object,
      default: undefined,
    },
    merchant: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      path: document.location.origin,
      logo: logo,
    };
  },
  mounted() {
    console.log("this pdf ", this.props);
    this.$nextTick(() => {
      setTimeout(() => {
        this.$emit("domRendered");
      }, 1000);
    });
  },
  methods: {
    moment: function () {
      return moment();
    },
  },
};
</script>

<style lang="scss" scoped>
.pdf-content {
  width: 100%;
  height: 2000px;
  background: #fff;

  .report-info {
    display: flex;
    padding: 20px;
    padding-bottom: 0px;

    .image-container {
      width: 75px;
      height: 75px;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      margin-right: 25px;
      border: 1px solid #dadada;

      .cycopay-logo {
        height: 100%;
        min-width: 100%;
        margin-left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  .invoice-content {
    margin: 0;
    font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol", "Noto Color Emoji";
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.5385;
    color: #333;
    text-align: left;
    background-color: #eee;
  }

  .mt-50 {
    margin-top: 50px;
  }

  .mb-50 {
    margin-bottom: 50px;
  }

  .card {
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 0.1875rem;
  }

  .card-img-actions {
    position: relative;
  }

  .card-body {
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    padding: 1.25rem;
    text-align: center;
  }

  .card-title {
    margin-top: 10px;
    font-size: 17px;
  }

  .invoice-color {
    color: red !important;
  }

  .card-header {
    padding: 0.9375rem 1.25rem;
    margin-bottom: 0;
    background-color: rgba(0, 0, 0, 0.02);
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  }

  a {
    text-decoration: none !important;
  }

  .btn-light {
    color: #333;
    background-color: #fafafa;
    border-color: #ddd;
  }

  .header-elements-inline {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
  }

  @media (min-width: 768px) {
    .wmin-md-400 {
      min-width: 400px !important;
    }
  }

  .btn-primary {
    color: #fff;
    background-color: #2196f3;
  }

  .btn-labeled > b {
    position: absolute;
    top: -1px;
    background-color: blue;
    display: block;
    line-height: 1;
    padding: 0.62503rem;
  }
}
</style>
