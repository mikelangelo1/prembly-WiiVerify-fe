<template>
  <dashboard-layout :pageName="'Notification'">
    <div class="row">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Recent Notification(s)</h4>
          </div>
          <div class="card-body">
            <div class="all-notification">
              <div class="notification-list">
                <div class="lists">
                  <a href="#" class="">
                    <div class="d-flex align-items-center">
                      <span class="me-3 icon success"
                        ><i class="bi bi-check"></i
                      ></span>
                      <div>
                        <p>Account created successfully</p>
                        <span>2020-11-04 12:00:23</span>
                      </div>
                    </div>
                  </a>
                  <a href="#" class="">
                    <div class="d-flex align-items-center">
                      <span class="me-3 icon fail"
                        ><i class="bi bi-x"></i
                      ></span>
                      <div>
                        <p>2FA verification failed</p>
                        <span>2020-11-04 12:00:23</span>
                      </div>
                    </div>
                  </a>
                  <a href="#" class="">
                    <div class="d-flex align-items-center">
                      <span class="me-3 icon success"
                        ><i class="bi bi-check"></i
                      ></span>
                      <div>
                        <p>Device confirmation completed</p>
                        <span>2020-11-04 12:00:23</span>
                      </div>
                    </div>
                  </a>
                  <a href="#" class="">
                    <div class="d-flex align-items-center">
                      <span class="me-3 icon pending"
                        ><i class="bi bi-exclamation-triangle"></i
                      ></span>
                      <div>
                        <p>Phone verification pending</p>
                        <span>2020-11-04 12:00:23</span>
                      </div>
                    </div>
                  </a>
                  <a>Missing Action? Contact support</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dashboard-layout>
</template>

<script>
import DashboardLayout from "../../components/layouts/DashboardLayout.vue";
export default {
  components: { DashboardLayout },
};
</script>
