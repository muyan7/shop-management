import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import "../src/assets/fonts/iconfont.css";
import "../src/assets/css/base.css";
import axios from "axios";
import _ from 'lodash';
import TreeTable from 'vue-table-with-tree-grid'
Vue.config.productionTip = false;
// 配置请求的根路径。
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// axios的请求拦截器，添加token验证的Authorization（授权）字段
axios.interceptors.request.use(config => {
  // console.log(config);
config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$axios = axios;
Vue.prototype._ = _
// 配置需要使用table的专门的组件
Vue.component('tree-table',TreeTable)
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
