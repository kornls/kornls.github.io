<template>
  <v-dialog v-model="popoutImage" max-width="300">
    <v-card>
      <v-card-text class="text-center pt-6">
        <img class="ma-auto mb-2" :src="$challenge.popoutImage" width="256" />
        <v-btn color="success" small @click="$challenge.popoutImage = ''"
          >Close</v-btn
        >
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "PopoutImage",
  computed: {
    popoutImage: {
      get() {
        return this.$challenge.popoutImage != "";
      },
      set(value) {
        if (!value) this.$challenge.popoutImage = "";
      },
    },
  },
};
</script>