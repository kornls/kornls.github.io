import Vue from "vue";
import App from "@/App.vue";
import router from "@/router/router.js";
import vuetify from "@/plugins/vuetify";
import globals from "@/plugins/globals";
import kahoot from "@/plugins/kahoot";
import searcher from "@/plugins/searcher";
import challenge from "@/plugins/challenge";

Vue.use(globals);
Vue.use(kahoot);
Vue.use(searcher);
Vue.use(challenge);
Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
