<template>
  <dashboard-layout :pageName="'Verify document'">
    <div v-if="currentlyDue.length > 0">
      <h4 class="alert-heading">Currently Due requirements</h4>
      <div :class="$style.border_danger">
        <ul>
          <li
            v-for="due in currentlyDue"
            :key="due.text"
            :class="$style.lineHeight"
          >
            {{ due.text }}
          </li>
        </ul>
      </div>
    </div>
    <div v-if="currentlyDue.length == 0" :class="$style.text">
      <div
        class="col-lg-6 col-md-5 col-12 mx-auto bg-white d-flex align-items-center justify-content-center"
        style="min-height: 40vh"
      >
        <div class="text-center">
          <div>
            <b-icon-check2-circle
              class="text-success fs-1"
            ></b-icon-check2-circle>
          </div>
          <h4 class="my-4">Thank you!</h4>
          <p>You currently do not have any pending submissions</p>
        </div>
      </div>
    </div>
    <div v-if="currentFrontFile" class="progress">
      <div
        class="progress-bar progress-bar-info progress-bar-striped bg-success"
        role="progressbar"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
        :style="{ width: progress + '%' }"
      >
        {{ progress }}%
      </div>
    </div>
    <div v-if="showBankUpload">
      <h3>Bank account ownership verification</h3>
      <label class="btn btn-default">
        <input
          class="btn btn-primary mb-3"
          type="file"
          ref="file"
          @change="selectFile($event, 'bank')"
        />
      </label>

      <button
        class="btn btn-success"
        :disabled="!allFiles.bank.file"
        @click="uploadBankFile"
      >
        Upload
      </button>
    </div>
    <div v-if="showAddressUpload">
      <h3>Address verification</h3>
      <label class="btn btn-default">
        <input
          class="btn btn-primary mb-3"
          type="file"
          ref="file"
          @change="selectFile($event, 'address')"
        />
      </label>

      <button
        class="btn btn-success"
        :disabled="!allFiles.address.file || addressFileLoading"
        @click="uploadAddressFile"
      >
        Upload
      </button>
    </div>

    <div v-if="showIdUpload">
      <div>
        <h3>ID verification</h3>
        <h4>Front page</h4>
        <label class="btn btn-default">
          <input
            class="btn btn-primary mb-3"
            type="file"
            ref="file"
            @change="selectFrontFile"
          />
        </label>

        <button
          class="btn btn-success"
          :disabled="!currentFrontFile || frontUploadLoading"
          @click="uploadFrontPage"
        >
          Upload
        </button>

        <div :class="$style.successMessage">
          {{ frontUploadMssg }}
        </div>
      </div>

      <div>
        <h4>Back page</h4>
        <label class="btn btn-default">
          <input
            class="btn btn-primary mb-3"
            type="file"
            ref="file"
            @change="selectBackFile"
          />
        </label>

        <button
          class="btn btn-success"
          :disabled="!currentBackFile || backUploadLoading"
          @click="uploadBackPage"
        >
          Upload
        </button>
        <div :class="$style.successMessage">
          {{ backUploadMssg }}
        </div>
      </div>
    </div>
  </dashboard-layout>
</template>

<style module>
.successMessage {
  color: #0d40c6;
  text-align: center;
}
.border_danger {
  font-size: 12px;
  border: 1px solid #ccc;
  border-left-width: 5px;
  border-left-style: solid;
  border-left-color: #842029;
  background: #fff;
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
}
.lineHeight {
  line-height: 24px;
}
.errorMessage {
  color: red;
}
.text {
  color: #1652f0;
}
</style>

<script>
import FileReader from "filereader";
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
import axios from "../../plugins/axios";
import { BIconCheck2Circle } from "bootstrap-vue";
export default {
  components: { DashboardLayout, BIconCheck2Circle },
  data() {
    return {
      // ID file handling starts
      selectedFiles: undefined,
      currentFrontFile: undefined,
      currentBackFile: undefined,
      progress: 0,
      getPresignedUrlError: undefined,
      frontPageUrl: [],
      frontPageKey: undefined,
      backPageUrl: [],
      BackPageKey: undefined,
      message: "",
      fileInfos: [],
      // ID file handling ends
      //
      allFiles: {
        bank: {
          file: undefined,
          urlObj: undefined,
        },
        address: {
          file: undefined,
          urlObj: undefined,
        },
      },
      //
      frontUploadMssg: undefined,
      frontUploadLoading: false,
      //
      backUploadMssg: undefined,
      backUploadLoading: false,
      // due
      dueRequirements: [],
      currentlyDue: [],
      //
      showIdUpload: false,
      showAddressUpload: false,
      showBankUpload: false,
    };
  },
  mounted() {
    this.userData = this.$store.state.auth.userData;
    // get merchant currently due
    this.getRequirements();
  },
  methods: {
    getRequirements() {
      const config = {
        headers: {
          "x-access-token": this.$store.state.auth?.userData?.token,
        },
      };
      axios
        .get("v1/merchant/profile/stripe-account", config)
        .then((res) => {
          this.getStripeAccountError = undefined;
          this.interPretRequirements(res?.data?.accountdetails?.requirements);
        })
        .catch((error) => {
          this.getStripeAccountError = "Error getting account requirements";
        });
    },
    async interPretRequirements(data = []) {
      let requirements = data;
      let rawRequirements = requirements.currently_due || [];
      if (
        rawRequirements?.some((requirement) =>
          requirement?.includes("verification.document")
        )
      ) {
        this.showIdUpload = true;
        this.getFrontPagePresignedUrl();
        this.getBackPagePresignedUrl();
      }
      if (
        rawRequirements?.some((requirement) =>
          requirement?.includes("verification.additional_document")
        )
      ) {
        this.showAddressUpload = true;
        let urlObj = await this.getS3UploadPresignedUrl();
        if (!urlObj.url) {
          this.$swal?.fire({
            text: "Unable to create a file upload key for address file",
            icon: "failure",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            customClass: {
              confirmButton: "btn fw-bold btn-light-primary",
            },
          });
        } else {
          this.allFiles.address.urlObj = urlObj;
        }
      }
      let requirementMatcher = {
        "verification.additional_document": {
          text: "We need you to upload an address verification photo, such as an utility bill",
        },
        "verification.document": {
          text: "We need you to upload an ID verification document photo, acceptable documents involve passports and National ID",
        },
      };
      let currentlyDue = requirements?.currently_due.map((requirement) => {
        let matchedKey = Object.keys(requirementMatcher).find((key) =>
          requirement.includes(key)
        );
        return {
          requirement,
          ...requirementMatcher[matchedKey],
          ...(!requirementMatcher[matchedKey] && {
            text: `${requirement} not submitted yet`,
          }),
        };
      });
      this.currentlyDue = currentlyDue;
    },
    selectFrontFile(e) {
      let files = e.target.files || e.dataTransfer.files;
      let fileSize = files[0]?.size;
      if (fileSize / 1024 > 2048) {
        this.$swal?.fire({
          text: "File must not exceed size of 2mb",
          icon: "failure",
        });
        return;
      }
      this.currentFrontFile = files;
      if (!files.length) return;
    },
    selectBackFile(e) {
      let files = e.target.files || e.dataTransfer.files;
      let fileSize = files[0]?.size;
      if (fileSize / 1024 > 2048) {
        this.$swal?.fire({
          text: "File must not exceed size of 2mb",
          icon: "failure",
        });
        return;
      }
      this.currentBackFile = files;
    },
    // for other files
    selectFile(e, type) {
      let files = e.target.files || e.dataTransfer.files;
      let fileSize = files[0]?.size;
      if (fileSize / 1024 > 2048) {
        this.$swal?.fire({
          text: "File must not exceed size of 2mb",
          icon: "failure",
        });
        return;
      }
      if (type == "address") {
        this.allFiles.address.file = files;
      }
    },
    createImage(file) {
      let image = new Image();
      var reader = new FileReader();
      var vm = this;
      reader.onload = (e) => {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async uploadFrontPage() {
      const config = {
        headers: {
          "x-access-token": this.$store.state.auth?.userData?.token,
        },
      };
      this.progress = 0;
      let formData = new FormData();
      formData.append("file", this.currentFrontFile);
      let url = this.frontPageUrl?.frontUrl;
      let file = this.currentFrontFile[0];
      this.frontUploadLoading = true;
      let awsResponse = await axios
        .put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
        })
        .then((res) => res)
        .catch((error) => error);
      if (awsResponse.status !== 200) {
        this.frontUploadLoading = false;
        this.frontUploadMssg = "Error encountered while uploading image";
        return;
      }
      let type = "frontPage";
      let key = this.frontPageUrl.frontKey;
      let body = {
        key: key,
        type: type,
      };
      axios
        .post("v1/merchant/document/upload", body, config)
        .then((res) => {
          this.frontUploadMssg = res.data?.message;
          this.frontUploadLoading = false;
          this.$swal?.fire({
            text: "File submitted successfully, we will notify you if your profile is verified",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn fw-bold btn-light-primary",
            },
          });
          // get updated requirements
          this.getRequirements();
        })
        .catch((error) => {
          this.frontUploadMssg = "Document not uploaded, please retry";
          this.frontUploadLoading = false;
        });
    },
    async uploadBackPage() {
      this.progress = 0;
      let formData = new FormData();
      formData.append("file", this.currentBackFile);
      let url = this.backPageUrl?.backUrl;
      let file = this.currentBackFile[0];
      const config = {
        headers: {
          "x-access-token": this.$store.state.auth?.userData?.token,
        },
      };
      this.backUploadLoading = true;
      let awsResponse = await axios
        .put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
        })
        .then((res) => res)
        .catch((error) => error);
      if (awsResponse.status != 200) {
        this.backUploadLoading = false;
        this.backUploadMssg = "Error encountered while uploading image";
        return;
      }
      let type = "backPage";
      let key = this.backPageUrl?.backKey;
      let body = {
        key: key,
        type: type,
      };
      axios
        .post("v1/merchant/document/upload", body, config)
        .then((res) => {
          this.backUploadMssg = res.data?.message;
          this.backUploadLoading = false;
          this.$swal?.fire({
            text: "File submitted successfully, we will notify you if your profile is verified",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn fw-bold btn-light-primary",
            },
          });
          // get updated requirements
          this.getRequirements();
        })
        .catch((error) => {
          this.backUploadMssg = "Document not uploaded, please retry";
          this.backUploadLoading = false;
        });
    },
    async uploadBankFile() {
      const currentFile = this.allFiles.bank.file;
      const urlObj = this.allFiles.bank.urlObj;
      this.progress = 0;
      let formData = new FormData();
      formData.append("file", currentFile);
      let url = urlObj?.url;
      let file = currentFile[0];
      const config = {
        headers: {
          "x-access-token": this.$store.state.auth?.userData?.token,
        },
      };
      this.bankFileLoading = true;
      let awsResponse = await axios
        .put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
        })
        .then((res) => res)
        .catch((error) => error);
      if (awsResponse.status != 200) {
        this.bankFileLoading = false;
        this.$swal?.fire({
          text: "Error encountered while uploading file",
          icon: "failure",
          buttonsStyling: false,
          confirmButtonText: "Ok",
          customClass: {
            confirmButton: "btn fw-bold btn-light-primary",
          },
        });
        return;
      }
      let type = "bankFile";
      let key = urlObj?.key;
      let body = {
        key: key,
        type: type,
      };
      axios
        .post("v1/merchant/document/upload", body, config)
        .then((res) => {
          this.bankFileLoading = false;
          this.$swal?.fire({
            text: "File submitted successfully, we will notify you if your profile is verified",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn fw-bold btn-light-primary",
            },
          });
          // get updated requirements
          this.getRequirements();
        })
        .catch((error) => {
          this.$swal?.fire({
            text:
              error?.response?.data?.message ||
              "Error encountered while loading file",
            icon: "failure",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            customClass: {
              confirmButton: "btn fw-bold btn-light-primary",
            },
          });
          this.bankFileLoading = false;
        });
    },
    async uploadAddressFile() {
      const currentFile = this.allFiles.address.file;
      const urlObj = this.allFiles.address.urlObj;
      this.progress = 0;
      let formData = new FormData();
      formData.append("file", currentFile);
      let url = urlObj?.url;
      let file = currentFile[0];
      const config = {
        headers: {
          "x-access-token": this.$store.state.auth?.userData?.token,
        },
      };
      this.addressFileLoading = true;
      let awsResponse = await axios
        .put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
        })
        .then((res) => res)
        .catch((error) => error);
      if (awsResponse.status != 200) {
        this.addressFileLoading = false;
        this.$swal?.fire({
          text: "Error encountered while uploading file",
          icon: "failure",
          buttonsStyling: false,
        });
        return;
      }
      let type = "addressFile";
      let key = urlObj?.key;
      let body = {
        key: key,
        type: type,
      };
      axios
        .post("v1/merchant/document/upload", body, config)
        .then((res) => {
          this.addressFileLoading = false;
          this.$swal?.fire({
            text: "File submitted successfully, we will notify you if your profile is verified",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn fw-bold btn-light-primary",
            },
          });
          // get updated requirements
          this.getRequirements();
        })
        .catch((error) => {
          this.$swal?.fire({
            text:
              error?.response?.data?.message ||
              "Error encountered while loading file",
            icon: "failure",
            buttonsStyling: false,
            confirmButtonText: "Ok",
          });
          this.addressFileLoading = false;
        });
    },
    async getFrontPagePresignedUrl() {
      let config = {
        headers: {
          "x-access-token": this.$store.state.auth?.userData?.token,
        },
      };
      try {
        const uploadConfig = await axios
          .get("v1/merchant/document/", config)
          .then((res) => {
            return {
              frontUrl: res?.data?.url,
              frontKey: res?.data.key,
            };
          });
        this.frontPageUrl = uploadConfig;
      } catch (err) {
        console.log(err);
      }
    },
    async getBackPagePresignedUrl() {
      let config = {
        headers: {
          "x-access-token": this.$store.state.auth?.userData?.token,
        },
      };
      try {
        const uploadConfig = await axios
          .get("v1/merchant/document/", config)
          .then((res) => {
            return {
              backUrl: res?.data?.url,
              backKey: res?.data.key,
            };
          });
        this.backPageUrl = uploadConfig;
      } catch (err) {
        console.log(err);
      }
    },
    async getS3UploadPresignedUrl() {
      let config = {
        headers: {
          "x-access-token": this.$store.state.auth?.userData?.token,
        },
      };
      try {
        const uploadConfig = await axios
          .get("v1/merchant/document/", config)
          .then((res) => {
            return {
              url: res?.data?.url,
              key: res?.data.key,
            };
          });
        return uploadConfig;
      } catch (err) {
        console.log(err);
        return err || err.message;
      }
    },
  },
};
</script>
