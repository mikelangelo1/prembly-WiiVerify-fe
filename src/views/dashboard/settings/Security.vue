<template>
  <dashboard-layout :pageName="'Security'" :settings="true" :activeSetting="3">
    <div class="row">
      <div class="col-xxl-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Identity verification</h4>
          </div>
          <div class="card-body">
            <div class="verify-content">
              <div class="d-flex align-items-center">
                <span class="me-3 icon-circle bg-primary text-white"
                  ><i class="ri-profile-fill"></i
                ></span>
                <div class="primary-number">
                  <p class="mb-0"></p>
                  <small>ID Document</small>
                  <br />
                  <span
                    v-if="this.userData.user.verificationDocFrontpage"
                    class="text-success"
                    >Verified</span
                  >
                  <span
                    v-if="!this.userData.user.verificationDocFrontpage"
                    class="text-warning"
                    >Not verified</span
                  >
                </div>
              </div>
              <b-button
                v-b-modal.idCardModal
                class="btn btn-primary"
                variant="primary"
                v-if="!isVerified"
              >
                Upload Document
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <upload />
    <success />
  </dashboard-layout>
</template>

<script>
import DashboardLayout from "../../../components/layouts/DashboardLayout.vue";
import Upload from "../../../components/popup/Upload.vue";
import Success from "../../../components/popup/Success.vue";
import moment from "moment";
import I18nCountries from "i18n-iso-countries";
// I18nCountries.registerLocale(require("../../../assets/countries-en.json"));
import Userservice from "../../../webServices/user.service";
export default {
  components: {
    DashboardLayout,
    Upload,
    Success,
  },
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
        console.log(this.userData.user);
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
      // console.log(res.data)
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
      if (!this.userData.user.stripeVerified) {
        const route = this.$router.resolve({
          path: "/verify-account",
        });
        window.open(route.href, "_blank");
      }
    },
  },
};
</script>