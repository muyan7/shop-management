import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import "../src/assets/fonts/iconfont.css";
import "../src/assets/css/base.css";
import axios from "axios";
import _ from "lodash";
import TreeTable from "vue-table-with-tree-grid";
Vue.config.productionTip = false;
// 配置请求的根路径。
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// axios的请求拦截器，添加token验证的Authorization（授权）字段
axios.interceptors.request.use((config) => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
// 全局过滤时间
Vue.filter("formatTime", (date) => {
  const timer = new Date(date);
  const y = timer.getFullYear();
  const m = (timer.getMonth() + 1 + "").padStart(2, "0");
  const d = (timer.getDate() + "").padStart(2, "0");
  const hh = (timer.getHours() + "").padStart(2, "0");
  const mm = (timer.getMinutes() + "").padStart(2, "0");
  const ss = (timer.getSeconds() + "").padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
});
Vue.prototype.$axios = axios;
Vue.prototype._ = _;

// 配置需要使用table的专门的组件
Vue.component("tree-table", TreeTable);
// 配置全局编辑器。富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 注册为全局可用的组件
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
