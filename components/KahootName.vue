<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-text>
        <div class="d-flex flex-column text-center mx-2 pt-8">
          <v-text-field
            @keyup.enter="ContinueBtnClicked"
            v-model="kahootName"
            :rules="kahootNameRules"
            label="Name/uuid of the Kahoot"
            hide-details="auto"
          ></v-text-field>
          <p class="red--text ma-auto mt-4" style="max-width: 350px">
            Failing to enter a name/uuid before the Kahoot starts may result in
            the auto answer not working properly
          </p>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          style="style='-webkit-animation: color 20s infinite;
              animation: color 10s infinite;
              -webkit-animation-direction: alternate;
              animation-direction: alternate;'"
          text
          @click="ContinueBtnClicked()"
          >Set</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      kahootNameRules: [
        value => !!value || "Required.",
        value => {
          let regex = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
          return regex.test(value) || "Cannot contain special characters";
        }
      ],
      kahootName: ""
    };
  },
  computed: {
    dialog: {
      get() {
        return (
          this.$globals.showKahootNameDialog && this.$kahoot.players[0] != null
        );
      },
      set(value) {
        this.$globals.showKahootNameDialog = value;
      }
    }
  },
  methods: {
    ContinueBtnClicked() {
      if (this.kahootName === "") return;
      this.$searcher.quizName = this.kahootName;
      this.$globals.showKahootNameDialog = false;
    }
  }
};
</script>
