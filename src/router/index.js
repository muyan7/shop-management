import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" },
  { name: "login", path: "/login", component: Login },
  { name: "home", path: "/home", component: Home },
];

const router = new VueRouter({
  routes,
});
// 
router.beforeEach((to, from, next) => {
  if(to.path==='/login') return next() //必须写。不然会报错 Maximum call stack size exceeded
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router;
