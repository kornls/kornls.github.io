import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/terms",
    name: "Terms & Conditions",
    component: () => import("../views/Terms.vue"),
  },
  {
    path: "/privacy",
    name: "Privacy Policy",
    component: () => import("../views/Privacy.vue"),
  },
  {
    path: "*",
    redirect: { path: "/" },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

const DEFAULT_TITLE = "Kahoot Rocks - The only working Kahoot auto answer hack";
router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

export default router;
