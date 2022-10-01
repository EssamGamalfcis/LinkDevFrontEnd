import Vue from "vue";
import Router from "vue-router";
import BranchSetup from "./views/BranchesSetup.vue";
import BranchesBook from "./views/BranchesBook.vue";
import Login from "./components/Login.vue";
Vue.use(Router);

const router = new Router({
  mode: "history",
  linkExactActiveClass: "vue-school-active-class",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      const position = {};
      if (to.hash) {
        position.selector = to.hash;
        if (to.hash === "#experience") {
          position.offset = { y: 140 };
        }
        if (document.querySelector(to.hash)) {
          return position;
        }

        return false;
      }
    }
  },
  routes: [
    {
      path: "/BranchSetup",
      name: "BranchSetup",
      component: BranchSetup
    },
    {
      path: "/BranchesBook",
      name: "BranchesBook",
      component: BranchesBook
    },
    {
      path: "/Login",
      name: "Login",
      component: Login
    },
    {
      path: "/404",
      alias: "*",
      name: "notFound",
      component: () =>
        import(/* webpackChunkName: "NotFound" */
        "./views/NotFound")
    }
  ]
});

router.beforeEach((to, from, next) => {
  next();
  // if (to.matched.some(record => record.meta.requiresAuth)) {
  //   if (!store.user) {
  //     next({
  //       name: "login",
  //       query: { redirect: to.fullPath }
  //     });
  //   } else {
  //     next();
  //   }
  // } else {
  //   next();
  // }
});

export default router;
