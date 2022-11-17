<template>
  <dashboard-layout :pageName="'API'" :settings="true" :activeSetting="6">
    <div class="row">
      <div class="col-xxl-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Integration</h4>
          </div>
          <div class="card-body">
            <p>WooCommerce Integration at github.com/cycopay</p>
            <p>
              Note that we are only able to support
              <a
                href="https://www.ig.com/en/trading-strategies/what-moves-g10-currencies--200717"
                >G10 currencies.</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-xxl-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Create API Key</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="submitPassword" action="post">
              <div class="row g-3">
                <div class="col-xl-6 col-md-6">
                  <label class="form-label">Confirm password</label>
                  <input
                    type="password"
                    name="usd_amount"
                    class="form-control"
                    placeholder="Enter Your Password"
                    v-model="password"
                  />
                </div>
                <div class="row"></div>
                <div class="col-auto">
                  <button class="btn btn-primary">Create API Key</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Your API Keys</h4>
          </div>
          <div class="card-body">
            <div class="table-responsive api-table">
              <table class="table">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="apiDetails in apiKeys" v-bind:key="apiDetails._id">
                    <td>{{ apiDetails.key }}</td>
                    <td>
                      <div class="form-check form-switch">
                        {{ apiDetails.status }}
                        <input
                          type="checkbox"
                          class="form-check-input"
                          v-model="apiDetails.status"
                          :key="apiDetails.key"
                          @click="toggleApiKeys(apiDetails)"
                        />
                      </div>
                    </td>
                    <td>
                      <span>
                        <i
                          class="ri-delete-bin-line"
                          :key="apiDetails.key"
                          @click="DeleteApiKey(apiDetails)"
                        ></i
                      ></span>
                    </td>
                  </tr>
                  <tr></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dashboard-layout>
</template>

<script>
import DashboardLayout from "../../../components/layouts/DashboardLayout.vue";
import useVuelidate from "@vuelidate/core";
import axios from "../../../plugins/axios";
import Userservice from "../../../webServices/user.service.js";

export default {
  components: { DashboardLayout },

  data() {
    return {
      loading: false,
      password: "",
      apiKeys: [],
      key: undefined,
    };
  },

  mounted() {
    this.getApiKeys();
  },

  methods: {
    submitPassword() {
      this.userData = this.$store.state.auth.userData;

      const config = {
        headers: {
          "x-access-token": this.$store.state?.auth?.userData?.token,
        },
      };

      const data = {
        password: this.password,
      };

      this.changePassLoading = true;
      axios
        .post("public/key/create", data, config)
        .then((res) => {
          this.$swal.fire({
            icon: "success",
            title: "Successful",
            text: res.data.message || "Your Api Key generated successfully",
          });

          this.getApiKeys();
        })
        .catch((error) => {
          this.changePassLoading = false;
          this.$swal?.fire({
            text:
              error?.response?.data?.message ||
              "Error encountered during request. Please input correct old password",
            icon: "error",
          });
        });
    },

    async getApiKeys() {
      Userservice.getApiKeys()
        .then((res) => {
          this.apiKeys = res?.data?.apiKeys;
        })
        .catch((err) => {
          console.log("error loading api keys");
        });
    },

    async toggleApiKeys(apiDetails) {
      let data = {
        status: !apiDetails.status,
        key: apiDetails.key,
      };
      Userservice.toggleApiKeys(data).then((res) => {
        this.getApiKeys();
      });
    },

    DeleteApiKey(apiDetails) {
      this.userData = this.$store.state.auth.userData;

      let config = {
        "x-access-token": this.$store.state?.auth?.userData?.token,
      };

      let body = {
        key: apiDetails.key,
      };

      axios.delete("public/key/delete", { config, data: body }).then((res) => {
        this.$swal.fire({
          icon: "success",
          title: "Successful",
          text: res.data.message || "Your Api Key deleted successfully",
        });
        this.getApiKeys();
      });
    },
  },
};
</script>
