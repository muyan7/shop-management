import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import Users from "../components/Users.vue";
import Roles from "../components/power/Roles.vue";
import Rights from "../components/power/Rights.vue";
import Cate from "../components/goods/Cate.vue";
import Params from "../components/goods/Params.vue";
import List from "../components/goods/List.vue";
import Add from "../components/goods/Add.vue";
import Order from "../components/order/Order.vue";
import Report from "../components/report/Report.vue";
Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" },
  { name: "login", path: "/login", component: Login },
  {
    name: "Home",
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
      {
        name: "welcome",
        path: "/welcome",
        component: Welcome,
      },
      {
        name: "users",
        path: "/users",
        component: Users,
      },
      {
        name: "roles",
        path: "/roles",
        component: Roles,
      },
      {
        name: "rights",
        path: "/rights",
        component: Rights,
      },
      {
        name: "cate",
        path: "/categories",
        component: Cate,
      },
      {
        name: "params",
        path: "/params",
        component: Params,
      },
      {
        name: "goods",
        path: "/goods",
        component: List,
      },
      {
        name: "add",
        path: "/goods/add",
        component: Add,
      },{
        name: "order",
        path: "/orders",
        component: Order,
      },
      {
        name: "report",
        path: "/reports",
        component: Report,
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});
//
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next(); //必须写。不然会报错 Maximum call stack size exceeded
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});

export default router;
