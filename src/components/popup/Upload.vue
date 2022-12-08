<template>
  <b-modal id="idCardModal" size="lg">
    <template #modal-header="{ close }">
      <h5 class="modal-title" id="idCardModalLabel">Upload your ID card</h5>
      <b-button
        class="btn-close"
        data-dismiss="modal"
        aria-label="Close"
        @click="close()"
        variant="hidden"
      >
      </b-button>
    </template>
    <form action="verify-step-3.html" class="identity-upload">
      <div>
        <div :class="$style.border_warning">
          <h6 class="fw-3">Driving License or Government ID card</h6>
          <p class="mb-0">
            Uploading your ID helps as ensure the safety and security of your
            founds
          </p>
          <p class="float-right">Maximum file size is 2mb</p>
        </div>
      </div>

      <div class="form-group">
        <label class="me-sm-2"> </label>
        <div
          :class="$style.file_uploader"
          @dragover.prevent="dragover"
          @dragleave.prevent="dragleave"
          @drop.stop.prevent="dropOn($event)"
        >
          <div class="text-center">
            <h5>Drag and drop National ID</h5>
            <input
              type="file"
              multiple
              id="uploadFile"
              name="fields[assetsFieldHandle][]"
              class="opacity-0 d-none"
              @change="onChange"
              ref="file"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p v-for="file in filesName" :key="file.id">{{ file }}</p>
            <label for="uploadFile">
              <div type="button" class="btn" :class="$style.button">
                Select image
              </div>
            </label>
          </div>
        </div>
        
        <form
          @submit.prevent="formSubmit"
          id="payment-form"
          class="sr-payment-form"
        >
        <div class="sr-combo-inputs-row">
            <div class="col">
              <label for="name">National Identity Number (NIN) </label>
              <input
                id="name"
                v-model="nin_number"
                class="form-control"
                name="name"
                placeholder="NIN"
                required
                type="text"
              />
            </div>
          </div>
          <div class="sr-combo-inputs-row">
            <div class="col">
              <label for="name">Virtual National Identity Number (NIN) </label>
              <input
                id="name"
                v-model="vNinNumber"
                class="form-control"
                name="name"
                placeholder="Virtual NIN"
                required
                type="text"
              />
            </div>
          </div>
          <button
            id="confirm-mandate"
            class="btn btn-primary fw-5 router-link-exact-active router-link-active"
            type="searchButton"
          >
            <div disabled class="spinner hidden" id="spinner"></div>
            <span id="button-text">Submit <span id="order-amount"></span></span>
          </button>
        </form>
        <!-- <div class="file-upload-wrapper" data-text="front.jpg">
          <input
            name="file-upload-field"
            type="file"
            class="file-upload-field"
            @change="selectFrontFile"
            ref="file"
          />

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

        </div> -->
      </div>
      <!-- <div class="form-group">
        <label class="me-sm-2">Upload Back ID </label>
        <div class="file-upload-wrapper" data-text="back.jpg">
          <input
            name="file-upload-field"
            type="file"
            class="file-upload-field"
            ref="file"
            @change="selectBackFile"
          />

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
      </div> -->
    </form>
    <template hide-footer>
      <!-- <button class="btn btn-primary" @click="$bvModal.hide('idCardModal')">
        Cancel
      </button> -->
      <!-- <b-button v-b-modal.SuccessModal variant="success" @click="ok()">
        Submit
      </b-button> -->
    </template>
  </b-modal>
</template>

<style module>
.successMessage {
  color: #0d40c6;
  text-align: center;
}

.errorMessage {
  color: red;
}

.text {
  color: #1652f0;
}

.file_uploader {
  border: 3px dashed #ccc;
  height: 220px;
  background-color: #f1f1f1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button {
  border: 1px solid #1652f0;
  color: #1652f0;
  font-weight: 500 !important;
  margin: 1rem 0;
}
.button:active {
  color: #1652f0 !important;
}

.border_warning {
  font-size: 11px;
  border: 1px solid #ccc;
  border-left-width: 5px;
  border-left-style: solid;
  border-left-color: #dba618;
  background: #fff;
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
}

.lineHeight {
  line-height: 20px;
}
</style>

<style scoped>
.bg-info-ready {
  background-color: #98d3eb;
}
</style>

<script>
import axios from "../../plugins/axios";
import FileReader from "filereader";

export default {
  name: "Upload",
  delimiters: ["${", "}"],
  data() {
    return {
      // ID file handling starts
      selectedFiles: undefined,
      currentFrontFile: undefined,
      currentBackFile: undefined,
      filesName: undefined,
      progress: 0,
      nin_number: undefined,
      vNinNumber: undefined,
      getPresignedUrlError: undefined,
      frontPageUrl: [],
      frontPageKey: undefined,
      backPageUrl: [],
      BackPageKey: undefined,
      message: "",
      fileInfos: [],
      ok: "",
      // ID file handling ends

      //
      frontUploadMssg: undefined,
      frontUploadLoading: false,
      //
      backUploadMssg: undefined,
      backUploadLoading: false,
    };
  },
  mounted() {
    this.userData = this.$store.state.auth.userData;
    // get merchant currently due
    this.getStripeAccount();
    this.getFrontPagePresignedUrl();
    this.getBackPagePresignedUrl();
  },
  methods: {
    async formSubmit() {
      this.verifyNIN();
      return;
    },
    getStripeAccount() {
      const config = {
        headers: {
          "x-access-token": this.$store.state.auth?.userData?.token,
        },
      };

      axios
        .get("v1/merchant/profile/stripe-account", config)
        .then((res) => {
          this.getStripeAccountError = undefined;
        })
        .catch((error) => {
          this.getStripeAccountError = "Error getting account requirements";
        });
    },
    dragover(e) {
      if (!e.currentTarget.classList.contains("bg-info-ready")) {
        e.currentTarget.classList.remove("bg-info-ready");
        e.currentTarget.classList.add("bg-info-ready");
      }
    },
    dragleave(e) {
      e.currentTarget.classList.remove("bg-info-ready");
    },
    dropOn(e) {
      // console.log(e.dataTransfer.files,'drop')
      // this.getClientOriginalName(e);
      this.filesName = this.getClientOriginalName(e);
      e.currentTarget.classList.remove("bg-info-ready");
    },
    onChange(e) {
      this.filesName = this.getClientOriginalName(e);
      // console.log(e,'onchange')
    },
    getClientOriginalName(file) {
      let files = [];
      if (
        file.target?.files.length >= 3 ||
        file.dataTransfer?.files.length >= 3
      ) {
        this.$toast.error(
          "Maximum photos selected must not be greater than 2",
          {
            timeout: 2000,
          }
        );
        return;
      }
      if (
        (file.target?.files.length > 0 && file.target?.files.length <= 2) ||
        (file.dataTransfer?.files.length > 0 &&
          file.dataTransfer?.files.length <= 2)
      ) {
        files = file.target?.files || file.dataTransfer?.files;

        files.forEach((item) => {
          if (item?.size / 1024 > 2048) {
            this.$toast.error("File must not exceed size of 2mb", {
              timeout: 2000,
            });
            return;
          }
        });
        // console.log(Array.from(files,item => item))

        let files = Array.from(files, (item) => item.name);

        this.uploadFrontPage(files[0]);
        console.log("front running");
        this.uploadBackPage(files[1]);
        console.log("back running");

        this.$toast.success("File successfully added", {
          timeout: 2000,
        });
        return files;
      }
      this.$toast.warning("Please select an image", {
        timeout: 2000,
      });
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
    async uploadFrontPage(data) {
      const config = {
        headers: {
          "x-access-token": this.$store.state.auth?.userData?.token,
        },
      };
      this.progress = 0;
      let formData = new FormData();
      // formData.append("file", this.currentFrontFile);
      formData.append("file", data);

      let url = this.frontPageUrl?.frontUrl;
      let file = data;

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

          this.filesName = "";
        })
        .catch((error) => {
          this.frontUploadMssg = "Document not uploaded, please retry";
          this.frontUploadLoading = false;
        });
    },
    async uploadBackPage(data) {
      this.progress = 0;
      let formData = new FormData();
      // formData.append("file", this.currentBackFile);
      formData.append("file", data);

      let url = this.backPageUrl?.backUrl;
      let file = data;
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

          this.filesName = "";
        })
        .catch((error) => {
          this.backUploadMssg = "Document not uploaded, please retry";
          this.backUploadLoading = false;
        });
    },

    async verifyNIN() {
      const config = {
        headers: {
          "x-access-token": this.$store.state.auth?.userData?.token,
        },
      };
      let body = {
        number: this.vNinNumber,
        number_nin: this.nin_number,
      };
      axios
        .post("v1/merchant/profile/verified", body, config)
        .then((res) => {
          console.log(res);
          this.$toast.success("ID verified successfully!", {
            timeout: 3000,
          });
          this.$router.push({
            name: "Index",
          });
        })
        .catch((error) => {
          console.log(error);
          console.log("add card endpoint failed ", error?.response?.data);
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
      } catch (err) {}
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
  },
};
</script>