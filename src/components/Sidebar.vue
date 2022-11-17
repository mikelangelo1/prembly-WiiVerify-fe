<template>
  <div class="sidebar">
    <div class="brand-logo">
      <router-link class="full-logo" to="/"
        ><img src="../assets/images/logoi.png" alt="" width="30"
      /></router-link>
    </div>
    <div class="menu">
      <ul>
        <li>
          <router-link to="/">
            <span><i class="ri-home-5-line"></i></span>
            <span class="nav-text">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/balance">
            <span><i class="ri-wallet-line"></i></span>
            <span class="nav-text">Balance</span>
          </router-link>
        </li>
        <li>
          <router-link to="/bill">
            <span><i class="ri-secure-payment-line"></i></span>
            <span class="nav-text">Payments</span>
          </router-link>
        </li>
        <li>
          <router-link to="/invoice">
            <span><i class="ri-file-copy-2-line"></i></span>
            <span class="nav-text">Payment Links</span>
          </router-link>
        </li>
        <li>
          <router-link to="/settings-profile">
            <span><i class="ri-settings-3-line"></i></span>
            <span class="nav-text">Settings</span>
          </router-link>
        </li>
        <li class="logout">
          <a @click.prevent="onLogout" style="cursor: pointer">
            <span><i class="ri-logout-circle-line"></i></span>
            <span class="nav-text">Log Out</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  methods: {
    onLogout() {
      this.$store.dispatch("auth/logout");
      //  this.$store.commit("auth/logoutSuccess");

      setTimeout(() => {
        this.$router.replace("/signin").catch((err) => {
          console.log("error navigating ", err);
        });
      }, 500);
    },
  },
};
</script>
