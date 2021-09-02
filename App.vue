<template>
  <v-app>
    <router-view v-if="!iframe" />
    <div v-else class="text-center d-flex" style="height: 100vh">
      <span class="ma-auto"
        >This is an unnoficial version of kahoot.rocks. Please use the official
        version at https://kahoot.rocks</span
      >
    </div>
  </v-app>
</template>

<script>
export default {
  name: "App",
  computed: {
    iframe() {
      return window.self !== window.top;
    },
  },
  methods: {
    getConfig() {
      const options = localStorage.getItem("options");
      if (options) {
        return JSON.parse(options);
      } else {
        localStorage.setItem("options", JSON.stringify(this.$globals.options));
        return this.$globals.options;
      }
    },
    loadConfig() {
      const config = this.getConfig();
      this.$globals.options = Object.assign(this.$globals.options, config);
      this.$vuetify.theme.dark = this.$globals.options.dark;
    },
  },
  mounted() {
    if (location.origin === "https://kahoot.rocks")
      location.href = location.href.replace(
        "https://kahoot.rocks",
        "https://kahoot.club"
      );

    this.loadConfig();
    fetch("https://abstract.land/kahoot/rest/kahoots")
      .then((res) => {
        if (res.status !== 200) throw new Error("oops");
      })
      .catch(() => {
        if (
          window.confirm(
            "CORS extension not installed, click OK to be redirected to the install page"
          )
        ) {
          window.location.href =
            "https://chrome.google.com/webstore/detail/cnfpafcflghhnmcdmomglkcofdgalljf";
        }
      });
  },
  created() {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  },
};
</script>
