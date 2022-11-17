import axios from "../plugins/axios";
import authHeader from "./auth-header";
class UserService {
  getDashboardData() {
    return axios.get("v1/merchant/dashboard");
  }
  getProfileData() {
    return axios.get("v1/merchant/profile/me");
  }
  getPaymentSummary() {
    return axios.get("v1/merchant/payment/summary");
  }
  getPaymentLinks() {
    return axios.get("v1/merchant/payment/links");
  }
  getPayments() {
    return axios.get("v1/merchant/payment");
  }
  getApiKeys() {
    return axios.get("public/key");
  }
  getPayoutDetails() {
    return axios.get("v1/merchant/balance/payout-widget");
  }
  getVerificationStatus() {
    return axios.get("v1/merchant/profile/verified");
  }
  toggleApiKeys(data) {
    return axios.patch("public/key", data);
  }
  deleteApiKey(data) {
    return axios.delete("public/key/delete", data);
  }
  getInvoiceDetails() {
    return axios.get("v1/merchant/balance/invoice");
  }
  request2FA() {
    return axios.get("v1/merchant/2FA");
  }
  verify2FA(data) {
    return axios.post("v1/merchant/2FA/verify", data);
  }
  verifyCaptcha(data) {
    return axios.post("verify-captcha", data);
  }
}
export default new UserService();
