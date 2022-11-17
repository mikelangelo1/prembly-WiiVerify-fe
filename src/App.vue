<template>
  <div id="app">
    <div id="preloader" v-show="isLoading">
      <i>.</i>
      <i>.</i>
      <i>.</i>
    </div>
    <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->

    <router-view />
  </div>
</template>

<script>
import EventBus from "./common/EventBus";

export default {
  name: "App",
  data() {
    return {
      isLoading: true,
      time: 100,
      show: 1,
    };
  },
  mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    EventBus.on("logout", () => {
      this.logOut();
    });
  },
  methods: {
    logOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/signin");
    },
  },
  beforeDestroy() {
    EventBus.remove("logout");
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&display=swap");
body {
  font-family: "Inter", sans-serif !important;
}
.card {
  box-shadow: 0px 2px 4px #f1f1f1 !important;
}
.translate {
  transition: transform 0.4s;
}
.translate_10 {
  transform: translateY(8rem);
}
.translate_20 {
  transform: translateY(16rem);
}
.animateColor {
  transition: color 0.4s;
  text-size-adjust: 100%;
  --unit: (1/16) * 1em;
  --font-size-base: calc(16 * var(--unit));
  --font-size-large: calc(20 * var(--unit));
  --font-size-x-large: calc(30 * var(--unit));
  --font-size-small: calc(14 * var(--unit));
  --font-size-x-small: calc(11 * var(--unit));
  --osdk-font-family-title: var(--font-family);
  --osdk-font-size-title: var(--font-size-x-large);
  --osdk-font-weight-title: 600;
  --osdk-color-content-title: rgba(var(--ods-color-content-main));
  --osdk-font-family-subtitle: var(--font-family);
  --osdk-font-size-subtitle: var(--font-size-base);
  --osdk-font-weight-subtitle: 600;
  --osdk-color-content-subtitle: rgba(var(--ods-color-content-main));
  --osdk-font-family-body: var(--font-family);
  --osdk-font-size-body: var(--font-size-base);
  --osdk-font-weight-body: 500;
  --osdk-color-content-body: rgba(var(--ods-color-content-main));
  --osdk-color-background-surface-modal: rgba(
    var(--ods-color-background-surface)
  );
  --osdk-color-border-surface-modal: rgb(var(--ods-color-neutral-600));
  --osdk-border-width-surface-modal: 1px;
  --osdk-border-style-surface-modal: solid;
  --osdk-border-radius-surface-modal: var(--ods-border-radius-large);
  --osdk-color-background-alert-info: rgb(var(--ods-color-primary-500));
  --osdk-color-content-alert-info: rgba(var(--ods-color-content-inverse-main));
  --osdk-color-background-alert-info-link-hover: rgba(
    var(--ods-color-background-action-hover)
  );
  --osdk-color-background-alert-info-link-active: rgba(
    var(--ods-color-background-action-active)
  );
  --osdk-color-background-alert-error: rgba(
    var(--ods-color-background-negative)
  );
  --osdk-color-content-alert-error: rgba(var(--ods-color-content-inverse-main));
  --osdk-color-background-alert-error-link-hover: rgba(
    var(--ods-color-background-negative-hover)
  );
  --osdk-color-background-alert-error-link-active: rgba(
    var(--ods-color-background-negative-active)
  );
  --osdk-color-background-icon: rgba(var(--ods-color-background-surface-alt));
  --osdk-color-content-button-primary-text: rgba(
    var(--ods-color-content-on-action)
  );
  --osdk-color-background-button-primary: rgba(
    var(--ods-color-background-action)
  );
  --osdk-color-background-button-primary-hover: rgba(
    var(--ods-color-background-action-hover)
  );
  --osdk-color-background-button-primary-active: rgba(
    var(--ods-color-background-action-active)
  );
  --osdk-color-border-button-primary: rgba(var(--ods-color-border-action));
  --osdk-color-content-button-secondary-text: rgba(
    var(--ods-color-content-action)
  );
  --osdk-color-background-button-secondary: transparent;
  --osdk-color-background-button-secondary-hover: rgba(
    var(--ods-color-background-action-subtle-hover)
  );
  --osdk-color-background-button-secondary-active: rgba(
    var(--ods-color-background-action-subtle)
  );
  --osdk-color-border-button-secondary: rgba(var(--ods-color-border-action));
  --osdk-border-radius-button: var(--ods-border-radius-medium);
  --osdk-button-group-stacked: false;
  --osdk-color-content-doc-type-button: var(--osdk-color-content-body);
  --osdk-color-background-doc-type-button: rgb(var(--ods-color-neutral-white));
  --osdk-color-border-doc-type-button: rgba(var(--ods-color-border-input));
  --osdk-color-border-doc-type-button-hover: rgba(
    var(--ods-color-border-action-hover)
  );
  --osdk-color-border-doc-type-button-active: rgba(
    var(--ods-color-border-action-focus)
  );
  --osdk-color-background-button-icon-hover: rgb(var(--ods-color-neutral-400));
  --osdk-color-background-button-icon-active: rgb(var(--ods-color-neutral-600));
  --color-background-button-camera: rgb(var(--ods-color-neutral-white));
  --osdk-color-background-button-camera-hover: rgb(
    var(--ods-color-primary-400)
  );
  --osdk-color-background-button-camera-active: rgb(
    var(--ods-color-primary-600)
  );
  --osdk-color-border-link-underline: rgba(var(--ods-color-border-action));
  --osdk-color-content-link-text-hover: rgba(
    var(--ods-color-content-on-action)
  );
  --osdk-color-background-link-hover: rgba(
    var(--ods-color-background-action-hover)
  );
  --osdk-color-background-link-active: rgba(
    var(--ods-color-background-action-active)
  );
  --osdk-color-background-info-pill: rgba(var(--ods-color-background-info));
  --osdk-color-content-info-pill: rgba(var(--ods-color-content-inverse-main));
  --ods-transition-duration: 0s;
  font: inherit;
  -webkit-box-direction: normal;
  list-style: none;
  box-sizing: border-box;
  text-align: left;
  -webkit-box-flex: 1;
  flex-grow: 1;
  flex-basis: 100%;
  margin-left: 1rem;
  font-weight: 400;
  font-size: 0.9375rem;
  line-height: 1.33333;
  letter-spacing: -0.02em;
  color: white !important;
}
.text-grey {
  color: #ccc;
}
.bv-no-focus-ring {
  display: flex;
}
.custom-control {
  display: flex;
  align-items: center;
}
.custom-control > label {
  padding-left: 5px;
}

.custom_padding {
  padding: 0 220px !important;
  height: 100vh;
}
.stat-widget .widget-content p {
  font-size: 11px !important;
}
@media screen and (max-width: 900px) {
  .custom_padding {
    padding: 0 5rem !important;
  }
}

@media screen and (max-width: 600px) {
  .custom_padding {
    padding: 0 2.5rem !important;
  }
  .stat-widget .widget-content p {
    font-size: 14px;
  }
}
</style>
