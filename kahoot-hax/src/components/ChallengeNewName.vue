<template>
  <v-dialog v-model="$challenge.showNewNicknameDialog" max-width="400">
    <v-card>
      <v-card-text>
        <div class="d-flex flex-column text-center mx-2 pt-8">
          <v-text-field
            @keyup.enter="ContinueBtnClicked"
            v-model="name"
            :rules="nameRules"
            label="Username for challenge"
            hide-details="auto"
          ></v-text-field>
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
          >Continue</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      nameRules: [
        value => !!value || "Required.",
        value => {
          let regex = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
          return regex.test(value) || "Cannot contain special characters";
        }
      ],
      name: ""
    };
  },
  methods: {
    ContinueBtnClicked() {
      if (this.name === "") return;
      if (
        !/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g.test(
          this.name
        )
      )
        return;

      this.$challenge.username = this.name;
      this.$challenge.showNewNicknameDialog = false;
      this.$challenge.Start();
    }
  }
};
</script>
