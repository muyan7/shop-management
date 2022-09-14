import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import Users from "../components/Users.vue";
import Roles from "../components/Roles.vue";
import Rights from "../components/Rights.vue";
Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" },
  { name: "login", path: "/login", component: Login },
  {
    name: "home",
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
      },{
        name: "roles",
        path: "/roles",
        component: Roles,
      },,{
        name: "rights",
        path: "/rights",
        component: Rights,
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
