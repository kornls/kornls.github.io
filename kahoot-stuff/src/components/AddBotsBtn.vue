<template>
  <div>
    <v-btn
      @click="open = !open"
      fab
      dark
      large
      color="primary"
      fixed
      right
      bottom
    >
      <v-icon dark>mdi-robot</v-icon>
    </v-btn>
    <v-bottom-sheet v-model="open">
      <v-card style="height: 100%" class="d-flex">
        <div class="ma-auto" style="width: 750px">
          <div class="ad mx-auto my-12 d-flex">
            <div id="kahoot-rocks_728x90">
              <script type="application/javascript">
                aiptag.cmd.display.push(function() {
                  aipDisplayTag.display("kahoot-rocks_728x90");
                });
              </script>
            </div>

            <div id="kahoot-rocks_300x250">
              <script type="application/javascript">
                aiptag.cmd.display.push(function() {
                  aipDisplayTag.display("kahoot-rocks_300x250");
                });
              </script>
            </div>
          </div>
          <div class="ma-auto pb-12" id="inputs">
            <v-row no-gutters v-if="progress != null">
              <v-col class="d-flex">
                <v-progress-linear
                  class="my-4 mx-2 mb-2"
                  :value="progress"
                ></v-progress-linear>
              </v-col>
              <v-btn @click="Cancel()" small class="ml-2" color="error"
                >Cancel</v-btn
              >
            </v-row>
            <v-row no-gutters class="mb-6">
              <v-col>
                <v-text-field
                  :disabled="$globals.options.randomBotNames"
                  v-model="username"
                  :rules="usernameRules"
                  class="ml-sm-5 lm-1 mr-2"
                  label="Username"
                  hide-details="auto"
                  @keyup.enter="$kahoot.raid(username, amount)"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="amount"
                  :rules="numberRules"
                  class="mr-sm-5 mr-1 ml-2"
                  label="Amount"
                  hide-details="auto"
                  @keyup.enter="$kahoot.raid(username, amount)"
                ></v-text-field>
              </v-col>
            </v-row>
            <div class="text-center">
              <v-btn
                class="ma-2 white--text"
                :loading="loading"
                :disabled="loading"
                @click="$kahoot.raid(username, amount)"
                style="
                  -webkit-animation: bgcolor 20s infinite;
                  animation: bgcolor 10s infinite;
                  -webkit-animation-direction: alternate;
                  animation-direction: alternate;
                "
                >Add clients</v-btn
              >
            </div>
          </div>
        </div>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
export default {
  name: "addBotsBtn",
  data() {
    return {
      loader: null,
      loading: false,
      username: "",
      amount: "",
      usernameRules: [
        value => {
          let regex = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
          return (
            regex.test(value) ||
            (value == "" || value == null
              ? true
              : "Cannot contain special characters")
          );
        }
      ],
      numberRules: [
        value => {
          let regex = /^[0-9]*$/gm;
          return (
            regex.test(value) ||
            (value == "" || value == null ? true : "Has to be a number")
          );
        }
      ]
    };
  },
  computed: {
    open: {
      get() {
        return this.$globals.showBotsPanel;
      },
      set(value) {
        this.$globals.showBotsPanel = value;
      }
    },
    progress: function() {
      if (this.$globals.joining == 0) return null;
      const percentage = (this.$globals.joined / this.$globals.joining) * 100;
      return percentage == 100 ? null : percentage;
    }
  },
  methods: {
    Cancel() {
      this.$globals.joining = 0;
      this.$globals.joined = 0;
      this.$globals.errored = 0;
      this.loader = null;
      this.loading = false;
    }
  }
};
</script>

<style scoped>
#inputs {
  width: 750px;
}

@media only screen and (max-width: 850px) {
  .content {
    margin-top: 4px;
    margin: 10px;
  }

  #inputs {
    width: unset;
  }
}

@media only screen and (max-width: 420px) {
  .buttons {
    flex-direction: column;
  }
}

#kahoot-rocks_728x90,
#kahoot-rocks_300x250 {
  margin: auto;
}
@media only screen and (max-width: 850px) {
  #kahoot-rocks_300x250 {
    display: unset;
  }
  #kahoot-rocks_728x90 {
    display: none;
  }
}
@media only screen and (min-width: 850px) {
  #kahoot-rocks_300x250 {
    display: none;
  }
  #kahoot-rocks_728x90 {
    display: unset;
  }
}
</style>
