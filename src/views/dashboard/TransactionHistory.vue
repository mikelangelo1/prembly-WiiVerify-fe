<template>
  <dashboard-layout>
    <div class="col-xl-12 col-lg-12">
      <div class="card" style="height: 109%">
        <div class="card-header">
          <h4 class="card-title">Transactions History</h4>
          <a href="/bill">See more</a>
        </div>
        <div class="card-body">
          <perfect-scrollbar class="invoice-content" style="height: 90px">
            <ul>
              <li
                v-for="transaction in transactions"
                v-bind:key="transaction._id"
                class="d-flex justify-content-between active"
              >
                <div class="d-flex align-items-center">
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
                  <h5 class="mb-2">+{{ transaction.amount.toFixed(2) }}</h5>
                  <span v-bind:class="getClass(transaction.status)">
                    {{ transaction.status }}
                  </span>
                </div>
              </li>
            </ul>
          </perfect-scrollbar>
        </div>
      </div>
    </div>
  </dashboard-layout>
</template>

<script>
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";

export default {
  components: {
    DashboardLayout,
  },
  data() {
    return {
      transactions: [],
    };
  },
};
</script>
