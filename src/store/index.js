// import { createStore } from 'vuex'
import Vuex from "vuex";
import Vue from "vue";

import { getField, updateField } from "vuex-map-fields";

import { userModule } from "./user";
import { authModule } from "./auth";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user: userModule,
    auth: authModule,
    invoiceModule: {
      namespaced: true,
      state: {
        controlValue: {
          showLayout: false,
          floatLayout: true,
          enableDownload: true,
          previewModal: true,
          paginateElementsByHeight: 1100,
          manualPagination: false,
          filename: "Hee Hee",
          pdfQuality: 2,
          pdfFormat: "a4",
          pdfOrientation: "portrait",
          pdfContentWidth: "800px",
        },
      },

      mutations: {
        updateField,
      },

      getters: {
        getField,
      },
    },
  },
});

export default store;
