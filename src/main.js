
import Vue from "vue";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import App from "./App.vue";
import router from "./router";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");



import PrimeVue from 'primevue/config';

Vue.use(PrimeVue);

import Dialog from 'primevue/dialog';

Vue.component('Dialog', Dialog);

import ToastService from 'primevue/toastservice';
Vue.use(ToastService);
import '../public/assets/primep2c.css';

import axios from "axios";

Vue.use(axios);

axios.interceptors.request.use(
  config => {
      var auth = window.localStorage.getItem("token");
      if (auth === null) {
      }
      if (auth) {
          config.headers["Authorization"] = "Bearer " + auth;
      }
      config.headers["X-Requested-With"] = "XMLHttpRequest";
      config.headers["Expires"] = "-1";
      config.headers["Cache-Control"] = "no-cache,no-store,must-revalidate,max-age=-1,private";
      return config;
  },
  error => {
      return Promise.reject(error);
  }
);
