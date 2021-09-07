<template>
  <v-app>
    <v-content class="d-flex flex-row align-center">
      <div class="d-flex flex-column">
        <div class="d-flex ma-auto">
          <a @click="Open('/terms')" class="ma-auto mx-2">Terms & Conditions</a
          >|
          <a @click="Open('/privacy')" class="ma-auto mx-2">Privacy Policy</a>
        </div>
      </div>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "Legal",
  methods: {
    Open(url) {
      window.open(url, "_blank");
    },
  },
};
</script>
