<template>
  <div class="row position-relative gx-0">
    <div
      class="position-absolute ml-5 px-2 mt-2 d-lg-flex d-md-flex d-none"
    ></div>
    <div
      class="col-xl-4 col-lg-4 col-md-4 d-lg-flex d-md-flex d-none align-items-center sidebar-main"
      style="height: 100vh; background-color: black"
    >
      <slot name="sidebar"></slot>
    </div>
    <div
      class="col-md-8 d-flex align-items-center justify-content-center custom_padding"
    >
      <div class="w-100">
        <div
          class="mt-2 d-lg-none d-md-none d-flex justify-content-center mb-4"
        ></div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthLayout",
  props: {
    title: String,
    colXl4: Boolean,
    alert: Boolean,
  },
};
</script>

<style scoped></style>
