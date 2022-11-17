<template>
  <div class="header">
    <div class="container">
      <div class="row">
        <div class="col-xxl-12">
          <div class="header-content">
            <div class="header-left">
              <div class="brand-logo">
                <router-link class="mini-logo" to="/"
                  ><img src="../assets/images/logoi.png" alt="" width="40"
                /></router-link>
              </div>
              <div class="search">
                <!-- <form action="#" @submit.prevent="">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Search..."
                    /><button type="submit" class="input-group-text">
                      <i class="ri-search-line"></i>
                    </button>
                  </div>
                </form> -->
              </div>
            </div>

            <div class="header-right">
              <div class="dark-light-toggle">
                <span class="dark"><i class="ri-moon-line"></i></span
                ><span class="light"><i class="ri-sun-line"></i></span>
              </div>
              <!-- <b-nav-item-dropdown
                tag="div"
                right
                menu-class="notification-list"
                toggle-class="d-flex align-items-center i-false p-0"
                class="notification"
              >
                <template #button-content>
                  <div class="notify-bell icon-menu">
                    <span><i class="ri-notification-2-line"></i></span>
                  </div>
                </template>

                <h4>Recent Notification(s)</h4>
                <div class="lists">
                  <router-link class="" to="#">
                    <div class="d-flex align-items-center">
                      <span class="me-3 icon success"
                        ><i class="ri-check-line"></i
                      ></span>
                      <div>
                        <p>Account created successfully</p>
                        <span>2020-11-04 12:00:23</span>
                      </div>
                    </div>
                  </router-link>
                  <router-link class="" to="#">
                    <div class="d-flex align-items-center">
                      <span class="me-3 icon fail"
                        ><i class="ri-close-line"></i
                      ></span>
                      <div>
                        <p>2FA verification failed</p>
                        <span>2020-11-04 12:00:23</span>
                      </div>
                    </div>
                  </router-link>
                  <router-link class="" to="#">
                    <div class="d-flex align-items-center">
                      <span class="me-3 icon success"
                        ><i class="ri-check-line"></i
                      ></span>
                      <div>
                        <p>Device confirmation completed</p>
                        <span>2020-11-04 12:00:23</span>
                      </div>
                    </div>
                  </router-link>
                  <router-link class="" to="#">
                    <div class="d-flex align-items-center">
                      <span class="me-3 icon pending"
                        ><i class="ri-question-mark"></i
                      ></span>
                      <div>
                        <p>Phone verification pending</p>
                        <span>2020-11-04 12:00:23</span>
                      </div>
                    </div>
                  </router-link>
                  <router-link to="/notification"
                    >More<i class="ri-arrow-right-s-line"></i
                  ></router-link>
                </div>
              </b-nav-item-dropdown> -->
              <b-nav-item-dropdown
                tag="div"
                right
                toggle-class="d-flex align-items-center i-false p-0"
                class="profile_log"
              >
                <template #button-content>
                  <div class="user icon-menu active">
                    <span><i class="ri-user-line"></i></span>
                  </div>
                </template>
                <div class="user-email">
                  <div class="user">
                    <div class="user-info" v-if="userData">
                      <h5>
                        {{
                          userData.business_type == "company"
                            ? userData.company.companyName
                            : `${userData.firstName} ${userData.lastName}`
                        }}
                      </h5>
                    </div>
                  </div>
                </div>
                <router-link class="dropdown-item" to="/profile"
                  ><span><i class="ri-user-line"></i></span>Profile</router-link
                >
                <router-link class="dropdown-item" to="/balance"
                  ><span><i class="ri-wallet-line"></i></span
                  >Balance</router-link
                >
                <router-link class="dropdown-item" to="/settings-profile"
                  ><span><i class="ri-settings-3-line"></i></span
                  >Settings</router-link
                >
                <!-- <router-link class="dropdown-item" to="/settings-activity"
                  ><span><i class="ri-time-line"></i></span
                  >Activity</router-link
                > -->
                <a
                  class="dropdown-item logout"
                  @click.prevent="onLogout"
                  style="cursor: pointer"
                  ><i class="ri-logout-circle-line"></i>Logout</a
                >
              </b-nav-item-dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Header",
  data() {
    return {
      userData: { firstName: "undefined" },
    };
  },
  mounted() {
    let that = this;
    let user = JSON.parse(localStorage.getItem("user"));
    that.userData = user.user;
    // setTimeout(() =>{

    //   that.userData = that.$store.getters['auth/getAuthUser'];
    //   console.log(that.$store.getters['auth/getAuthUser'],'getter')
    // },2000)
    // console.log(this.$store.state.auth?.userData,'auth user')
  },
  computed: {},
  methods: {
    onLogout() {
      this.$store.dispatch("auth/logout");

      setTimeout(() => {
        // this.$router.replace("/signin").catch((err) => {
        //   console.log("error navigating ", err);
        // });
        window.location.href = "/signin";
      }, 500);
    },
  },
};
</script>
