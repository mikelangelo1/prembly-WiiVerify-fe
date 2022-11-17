<template>
  <dashboard-layout :pageName="'Settings'" :settings="true" :activeSetting="1">
    <div class="row">
      <div class="col-xxl-6 col-xl-6 col-lg-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Account Security</h4>
          </div>
          <div class="card-body">
            <form action="#" @submit.prevent="submitPasswordChange">
              <div class="row g-3">
                <div class="col-6 mb-3">
                  <label class="form-label">New Password</label>
                  <input
                    type="password"
                    class="form-control"
                    placeholder="**********"
                    v-model="newPassword"
                  />
                </div>
                <div class="col-6 mb-3">
                  <label class="form-label">Current Password</label>
                  <input
                    type="password"
                    class="form-control"
                    placeholder="**********"
                    v-model="oldPassword"
                  />
                </div>
                <div class="col-12 col-12 mb-3">
                  <button
                    :disabled="
                      !oldPassword || !newPassword || changePassLoading
                    "
                    class="btn btn-primary"
                  >
                    Save
                  </button>
                </div>
                <small class="mt-2 mb-0 d-block"
                  >You'll receive a notification on your email regarding this
                  change.
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div v-if="business_type == 'individual'" class="col-xxl-12">
        <!-- individual -->
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">
              {{ business_type == "company" ? "Company" : "Personal" }}
              Information
            </h4>
          </div>
          <div class="card-body">
            <form
              @submit.prevent=""
              name="myform"
              class="personal_validate"
              novalidate="novalidate"
            >
              <div class="row g-4">
                <div class="col-xxl-6 col-xl-6 col-lg-6">
                  <label class="form-label"
                    >{{
                      business_type == "individual" ? "Full" : ""
                    }}
                    Name</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="fullName"
                    readonly="readonly"
                    name="fullname"
                  />
                </div>
                <div class="col-xxl-6 col-xl-6 col-lg-6">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    :placeholder="email"
                    readonly="readonly"
                    name="email"
                  />
                </div>
                <div class="col-xxl-6 col-xl-6 col-lg-6">
                  <label class="form-label">Website</label>
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="website"
                    readonly="readonly"
                    name="website"
                  />
                </div>
                <div class="col-xxl-6 col-xl-6 col-lg-6">
                  <label class="form-label">Category</label>
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="category"
                    readonly="readonly"
                    name="city"
                  />
                </div>

                <div class="col-xxl-6 col-xl-6 col-lg-6">
                  <label class="form-label">Phone Number</label>
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="phoneNumber"
                    readonly="readonly"
                    name="phonenumber"
                  />
                </div>

                <div class="col-xxl-6 col-xl-6 col-lg-6">
                  <label class="form-label">Country</label>
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="country"
                    readonly="readonly"
                    name="country"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div v-if="business_type == 'company'" class="col-xxl-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">
              {{ business_type == "company" ? "Company" : "Personal" }}
              Information
            </h4>
          </div>
          <div class="card-body">
            <form
              @submit.prevent=""
              name="myform"
              class="personal_validate"
              novalidate="novalidate"
            >
              <div class="row g-4">
                <div class="col-xxl-6 col-xl-6 col-lg-6">
                  <label class="form-label"
                    >{{
                      business_type == "individual" ? "Full" : ""
                    }}
                    Name</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="fullName"
                    readonly="readonly"
                    name="fullname"
                  />
                </div>
                <div class="col-xxl-6 col-xl-6 col-lg-6">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    :placeholder="email"
                    readonly="readonly"
                    name="email"
                  />
                </div>
                <div class="col-xxl-6 col-xl-6 col-lg-6">
                  <label class="form-label">Address</label>
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="address || companyLine1"
                    readonly="readonly"
                    name="permanentaddress"
                  />
                </div>
                <div class="col-xxl-6 col-xl-6 col-lg-6">
                  <label class="form-label">City</label>
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="city || companyCity"
                    readonly="readonly"
                    name="city"
                  />
                </div>
                <div class="col-xxl-6 col-xl-6 col-lg-6">
                  <label class="form-label">Post Code</label>
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="postalCode || companyPostal_code"
                    readonly="readonly"
                    name="postal"
                  />
                </div>
                <div class="col-xxl-6 col-xl-6 col-lg-6">
                  <label class="form-label">Phone Number</label>
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="phoneNumber"
                    readonly="readonly"
                    name="phonenumber"
                  />
                </div>

                <div class="col-xxl-6 col-xl-6 col-lg-6">
                  <label class="form-label">Country</label>
                  <input
                    type="text"
                    class="form-control"
                    :placeholder="country"
                    readonly="readonly"
                    name="country"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </dashboard-layout>
</template>

<script>
import DashboardLayout from "../../../components/layouts/DashboardLayout.vue";
import axios from "../../../plugins/axios";
import I18nCountries from "i18n-iso-countries";
// I18nCountries.registerLocale(require("../../../assets/countries-en.json"));

let countries = [
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Bulgaria",
  "Canada",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hong Kong",
  "Hungary",
  "India",
  "Indonesia",
  "Ireland",
  "Italy",
  "Japan",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malaysia",
  "Malta",
  "Moldova",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
];

let countriesWithCode = countries.map((country) => {
  return {
    name: country,
    countryCode: I18nCountries.getAlpha2Code(country, "en"),
  };
});

export default {
  components: { DashboardLayout },
  data: function () {
    return {
      countriesWithCode: [...countriesWithCode],
      //
      oldPassword: undefined,
      newPassword: undefined,
      //
      statementDesc: undefined,

      //
      changePassLoading: false,
      statementLoading: false,
      //
      fullName: "",
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      website: "",
      category: "",
      postalCode: "",
      phoneNumber: "",
      companyName: "",
      companyCity: "",
      companyPostal_code: "",
      companyLine1: "",
      business_type: "",
      country: "",
    };
  },
  mounted() {
    const config = {
      headers: {
        "x-access-token": this.$store.state.auth?.userData?.token,
      },
    };

    axios.get("v1/merchant/profile/me", config).then((res) => {
      (this.firstName = res?.data?.profile.firstName),
        (this.lastName = res?.data?.profile.lastName),
        (this.email = res?.data?.profile?.email),
        (this.address = res?.data?.profile?.line1),
        (this.city = res?.data?.profile?.city),
        (this.website = res?.data?.profile?.individual.address.website),
        (this.category = res?.data?.profile?.business_mcc),
        (this.postalCode = res?.data?.profile?.postal_code),
        (this.phoneNumber = res?.data?.profile?.phone_number),
        (this.country = res?.data?.profile?.country),
        (this.companyName = res?.data?.profile?.company?.companyName),
        (this.companyPostal_code =
          res?.data?.profile?.company?.address?.postal_code),
        (this.companyCity = res?.data?.profile?.company?.address?.city),
        (this.companyLine1 = res?.data?.profile?.company?.address?.line1),
        (this.business_type = res?.data?.profile?.business_type),
        (this.fullName =
          this.business_type == "individual"
            ? `${this.firstName} ${this.lastName}`
            : this.companyName);
    });
  },
  methods: {
    submitPasswordChange() {
      this.userData = this.$store.state.auth.userData;

      const config = {
        headers: {
          "x-access-token": this.$store.state?.auth?.userData?.token,
        },
      };

      const data = {
        oldPassword: this.oldPassword,
        password: this.newPassword,
      };

      this.changePassLoading = true;
      axios
        .post("v1/merchant/password/change", data, config)
        .then((res) => {
          this.changePassLoading = false;

          this.$swal.fire({
            icon: "success",
            title: "Successful",
            text:
              res.data.message || "Your password has been changed successfully",
          });
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
    submitStatementDescChange() {
      this.userData = this.$store.state.auth.userData;

      const config = {
        headers: {
          "x-access-token": this.$store.state?.auth?.userData?.token,
        },
      };

      const data = {
        statement_desc: this.statementDesc,
      };

      this.statementLoading = true;
      axios
        .post("v1/merchant/profile/statement-desc", data, config)
        .then((res) => {
          this.statementLoading = false;

          this.$swal.fire({
            icon: "success",
            title: "Successful",
            text:
              res.data.message || "Your statement description has been updated",
          });
        })
        .catch((error) => {
          this.statementLoading = false;
          this.$swal?.fire({
            text:
              error?.response?.data?.message ||
              "Error encountered during request",
            icon: "error",
          });
        });
    },
  },
};
</script>
