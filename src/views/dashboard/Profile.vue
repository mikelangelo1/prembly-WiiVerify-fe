<template>
  <dashboard-layout :pageName="'Profile'">
    <div class="row">
      <div class="col-xxl-6 col-xl-6 col-lg-6">
        <div
          style="text-align: center"
          v-html="getProfileError"
          :class="$style.errorMessage"
        ></div>
        <div class="card welcome-profile">
          <div class="card-body">
            <h4 v-if="userData.user">Welcome!</h4>

            <p>
              Follow your To Do List to receive full access to your merchant
              account.
            </p>

            <ul>
              <li v-if="userData.user">
                <a
                  @click="!isVerified ? goToVerifyAccount() : ''"
                  style="color: #1652f0; cursor: pointer"
                >
                  <span v-if="isVerified" class="verified"
                    ><i class="ri-check-line"></i
                  ></span>
                  <span v-if="!isVerified" class="not-verified"
                    ><i class="ri-shield-check-line"></i
                  ></span>
                  Verify account</a
                >
              </li>

              <li v-if="userData.user">
                <a @click="goTo2FA()" style="color: #1652f0; cursor: pointer">
                  <span v-if="userData.user.twoFactorEnabled" class="verified"
                    ><i class="ri-check-line"></i
                  ></span>
                  <span
                    v-if="!userData.user.twoFactorEnabled"
                    class="not-verified"
                    ><i class="ri-shield-check-line"></i></span
                  >Two-factor authentication (2FA)</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="profileData" class="col-xxl-6 col-xl-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">VERIFY &amp; UPGRADE</h4>
          </div>
          <div v-if="!isVerified" class="card-body">
            <h5>
              Account Status:
              <!-- <span class="verified">
                <span class="text-success">Verified</span>
                Your account is verified.
              </span> -->
              <span class="not-verified"></span>
              <span class="text-warning"
                >Not verified <i class="icofont-warning"></i
              ></span>
            </h5>
            <p>
              Your account is unverified. Get verified now to enable merchant
              payments & payouts.
            </p>
            <router-link to="/verify-account" class="btn btn-primary"
              >Get Verified</router-link
            >
            <br /><br />
            <!-- <a href="#">Learn more<i class="ri-arrow-right-s-line"></i></a> -->
          </div>
          <div v-else class="card-body" style="height: 183px">
            <h5>
              Account Status:
              <span class="verified">
                <span class="text-success">Verified</span>
              </span>
            </h5>
            <p class="">
              Your account is verified. You are now able to accept payments and
              retrieve payouts.
            </p>

            <br /><br />
            <!-- <a href="#">Learn more<i class="ri-arrow-right-s-line"></i></a> -->
          </div>
        </div>
      </div>

      <div class="col-xxl-12">
        <div class="card">
          <div class="card-header flex-row">
            <h4 class="card-title">Information</h4>
            <router-link class="btn btn-primary" to="/settings-profile"
              >View</router-link
            >
          </div>
          <div class="card-body">
            <form class="row">
              <div class="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
                <div class="user-info">
                  <span>USER ID</span>
                  <h4 v-if="profileData">#{{ profileData._id }}</h4>
                </div>
              </div>
              <div class="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
                <div class="user-info">
                  <span>EMAIL ADDRESS</span>
                  <h4 v-if="profileData">{{ profileData.email }}</h4>
                </div>
              </div>
              <div class="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
                <div class="user-info">
                  <span>COUNTRY OF RESIDENCE</span>
                  <h4>{{ countryName }}</h4>
                </div>
              </div>
              <div class="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
                <div class="user-info">
                  <span>JOINED SINCE</span>
                  <h4>{{ dateJoined }}</h4>
                </div>
              </div>
              <div class="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
                <div v-if="profileData" class="user-info">
                  <span>TYPE</span>
                  <h4>{{ profileData.business_type }}</h4>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </dashboard-layout>
</template>

<style module>
.errorMessage {
  color: red;
}
</style>

<script>
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
// import axios from "../../plugins/axios";
import moment from "moment";
import I18nCountries from "i18n-iso-countries";
// I18nCountries.registerLocale(require("../../assets/countries-en.json"));

import Userservice from "../../webServices/user.service";

export default {
  components: { DashboardLayout },
  data: function () {
    return {
      getProfileError: undefined,
      profileData: undefined,
      countryName: undefined,
      dateJoined: moment().format("DD/MM/YYYY"),
      userData: {
        user: undefined,
      },
      isVerified: undefined,
    };
  },
  mounted() {
    this.userData = this.$store.state.auth.userData;

    Userservice.getProfileData()
      .then((res) => {
        this.userData = {
          ...this.userData,
          user: res?.data?.profile,
        };

        if (res?.data?.profile?.firstName) {
          // update Vuex store for user data
          // this.$store.commit("user/getProfileSuccess", res?.data?.profile);
        }
        this.getProfileError = undefined;

        this.profileData = res?.data?.profile;
        this.countryName = I18nCountries.getName(
          this.profileData?.country,
          "en"
        );
        this.dateJoined = moment(this.profileData?.date).format("DD/MM/YYYY");
      })
      .catch((error) => {
        console.log("error getting profile ", error);
        this.getProfileError = "Error while retrieving profile data";
      });

    Userservice.getVerificationStatus().then((res) => {
      // console.log(res.data);
      this.isVerified = res?.data?.isVerified;
    });
  },
  methods: {
    goTo2FA() {
      if (!this.userData.user.twoFactorEnabled) {
        const route = this.$router.resolve({
          path: "/twofactor-request",
        });

        window.open(route.href, "_blank");
      }
    },
    goToVerifyAccount() {
      if (!this.userData.user.isVerified) {
        const route = this.$router.resolve({
          path: "/verify-account",
        });

        window.open(route.href, "_blank");
      }
    },
  },
};
</script>
