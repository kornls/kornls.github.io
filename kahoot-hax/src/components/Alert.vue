<template>
  <v-snackbar :timeout="3000" :color="color" v-model="snackbar">
    {{ $globals.notification.text }}
  </v-snackbar>
</template>

<script>
export default {
  computed: {
    snackbar: {
      get() {
        return this.$globals.notification.active;
      },
      set(value) {
        this.$globals.notification.active = value;
      }
    },
    color() {
      switch (this.$globals.notification.type) {
        case "ERROR":
          return "red";
        case "WARN":
          return "#FFC71E";
        default:
          return "green";
      }
    }
  }
};
</script>
