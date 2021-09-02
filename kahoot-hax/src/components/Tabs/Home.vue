<template>
  <v-app>
    <v-content>
      <v-card style="height: 100%" class="d-flex" v-if="init">
        <div class="ma-auto" style="width: 750px">
          <div class="ad mx-auto my-12 d-flex">
            <div id="kahoot-rocks_728x90">
              <script type="application/javascript">
                aiptag.cmd.display.push(function () {
                  aipDisplayTag.display("kahoot-rocks_728x90");
                });
              </script>
            </div>

            <div id="kahoot-rocks_300x250">
              <script type="application/javascript">
                aiptag.cmd.display.push(function () {
                  aipDisplayTag.display("kahoot-rocks_300x250");
                });
              </script>
            </div>
          </div>

          <div class="ma-auto pb-12" id="inputs">
            <v-form class="d-flex align-center pb-5">
              <v-text-field
                @keyup.enter="firstJoin"
                v-model="$kahoot.pin"
                :rules="numberRules"
                class="mr-sm-5 mr-1 ml-2"
                label="Game Pin"
                hide-details="auto"
              ></v-text-field>
              <v-text-field
                :disabled="this.$globals.options.randomBotNames"
                @keyup.enter="firstJoin"
                v-model="username"
                :rules="usernameRules"
                class="ml-sm-5 lm-1 mr-2"
                label="Username"
                hide-details="auto"
              ></v-text-field>
            </v-form>
            <div class="text-center mb-12 pb-12">
              <v-btn
                class="ma-2 white--text"
                :loading="loading"
                :disabled="loading"
                @click="firstJoin()"
                style="
                  -webkit-animation: bgcolor 20s infinite;
                  animation: bgcolor 10s infinite;
                  -webkit-animation-direction: alternate;
                  animation-direction: alternate;
                "
                >Join Game</v-btn
              >
            </div>
          </div>
        </div>
      </v-card>

      <div class="content" v-if="!init">
        <v-card class="my-6 pb-10 px-6">
          <div class="d-flex justify-space-between pt-5">
            <h2 class="white--text">
              {{ `Current Question: ${currentQuestion}` }}
            </h2>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  large
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="$kahoot.reset()"
                >
                  <v-icon color="red">mdi-exit-to-app</v-icon>
                </v-btn>
              </template>
              <span>Reset</span>
            </v-tooltip>
          </div>
          <div class="d-flex justify-space-between mb-4">
            <div v-if="editingName" class="d-flex justify-space-between">
              <h2>
                {{
                  `Quiz ${
                    /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/gi.test(
                      this.$searcher.quizName
                    )
                      ? "uuid"
                      : this.$searcher.quizName == ""
                      ? "name/uuid"
                      : "name"
                  }:`
                }}
              </h2>
              <v-text-field
                label=""
                ref="editNameField"
                class="pt-0 ml-2"
                @keyup.enter="editingName = false"
                @keyup.esc="editingName = false"
                v-model="editedName"
                style="width: 25vw"
              ></v-text-field>
              <v-icon @click="editingName = false" class="mb-2 ml-2"
                >mdi-check</v-icon
              >
            </div>
            <div v-if="!editingName" class="d-flex justify-space-between">
              <h2 v-html="getNameHtml()"></h2>
              <v-icon
                v-if="!$kahoot.manuallySearched"
                @click="editName()"
                :class="`ml-2 ${
                  $kahoot.quizNameRequired &&
                  $searcher.quizName === '' &&
                  !$kahoot.kahootStarted
                    ? 'red--text'
                    : ''
                }`"
                >mdi-pencil</v-icon
              >
            </div>
          </div>
          <v-row no-gutters class="text-center">
            <v-row no-gutters class="text-center">
              <v-col class="d-flex flex-column">
                <v-row no-gutters class="text-center">
                  <v-text-field
                    autocomplete="off"
                    v-model="$globals.options.minAnswerDelay"
                    :rules="minAnswerDelayRules"
                    @blur="validateDelay(1)"
                    :class="`mr-${innerWidth > 459 ? '6' : '0'}`"
                    label="Answer delay min (ms)"
                    hide-details="auto"
                  ></v-text-field>
                </v-row>
              </v-col>
            </v-row>
            <v-row no-gutters class="text-center">
              <v-col class="d-flex flex-column">
                <v-row no-gutters class="text-center">
                  <v-text-field
                    autocomplete="off"
                    v-model="$globals.options.maxAnswerDelay"
                    :rules="maxAnswerDelayRules"
                    @blur="validateDelay(2)"
                    label="Answer delay max (ms)"
                    hide-details="auto"
                  ></v-text-field>
                </v-row>
              </v-col>
            </v-row>
          </v-row>
          <v-row no-gutters class="text-center">
            <v-col class="d-flex flex-column">
              <v-row no-gutters class="text-center">
                <v-text-field
                  v-model="$globals.options.answerCorrect"
                  :rules="numberRules"
                  label="Answer correct"
                  hide-details="auto"
                  append-icon="mdi-percent-outline"
                ></v-text-field>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
        <v-data-table
          :hide-default-footer="true"
          :disable-filtering="true"
          :items-per-page="tableItems.length"
          :headers="tableHeaders"
          :items="tableItems"
          class="elevation-1"
        ></v-data-table>
        <div class="ad mx-auto my-12 d-flex">
          <div id="kahoot-rocks_728x90">
            <script type="application/javascript">
              aiptag.cmd.display.push(function () {
                aipDisplayTag.display("kahoot-rocks_728x90");
              });
            </script>
          </div>

          <div id="kahoot-rocks_300x250">
            <script type="application/javascript">
              aiptag.cmd.display.push(function () {
                aipDisplayTag.display("kahoot-rocks_300x250");
              });
            </script>
          </div>
        </div>
        <addBotsBtn></addBotsBtn>
      </div>
    </v-content>
  </v-app>
</template>

<script>
module.exports = {
  name: "Home",
  components: {
    addBotsBtn: () => import("../AddBotsBtn"),
  },
  data: () => {
    return {
      username: "",
      usernameRules: [
        (value) => !!value || "Required.",
        (value) => {
          let regex = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
          return regex.test(value) || "Cannot contain special characters";
        },
      ],
      numberRules: [
        (value) => {
          let regex = /^[0-9]*$/gm;
          return (
            regex.test(value) ||
            (value == "" || value == null ? true : "Has to be a number")
          );
        },
      ],
      editingName: false,
      editedName: "",
      minAnswerDelayRules: [true],
      maxAnswerDelayRules: [true],
      tableHeaders: [
        { text: "Name", align: "start", sortable: false, value: "name" },
        { text: "Rank", value: "rank" },
        { text: "Points", value: "points" },
      ],
    };
  },
  computed: {
    init() {
      return this.$kahoot.players.length == 0;
    },
    loading: {
      get() {
        return this.$globals.loading;
      },
      set(value) {
        this.$globals.loading = value;
      },
    },
    innerWidth() {
      return window.innerWidth;
    },
    quizStarted: function () {
      return this.$kahoot.kahootStarted;
    },
    currentQuestion: function () {
      if (!this.$kahoot.kahootStarted) {
        return "Kahoot not started";
      } else {
        if (this.$searcher.kahoots.length == 0) return "No Kahoots found";
        if (
          this.$searcher.kahoots[0].questions[this.$kahoot.questionIndex]
            .type == "content"
        )
          return "Content";
        return this.$searcher.kahoots[0].questions[
          this.$kahoot.questionIndex
        ].text
          .replace(/(&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});)+/gi, " ")
          .replace(/<[^>]*>/g, " ")
          .replace("  ", " ");
      }
    },
    tableItems: function () {
      let items = [];
      this.$kahoot.players.forEach((player, index) => {
        items.push({
          name: player.username,
          rank: player.rank,
          points: player.points,
          index: index + 1,
        });
      });
      return items;
    },
  },
  watch: {
    editingName() {
      if (!this.editingName && this.editedName !== this.$searcher.quizName) {
        this.$searcher.quizName = this.editedName;
      }
    },
  },
  methods: {
    getNameHtml() {
      return `Quiz ${
        /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/gi.test(
          this.$searcher.quizName
        )
          ? "uuid"
          : this.$searcher.quizName == ""
          ? "name/uuid"
          : "name"
      }: ${this.formatQuizName(this.$searcher.quizName)}`;
    },
    formatQuizName(quizName) {
      if (
        this.$kahoot.quizNameRequired &&
        quizName === "" &&
        !this.$kahoot.kahootStarted
      )
        return `<span class="red--text">Not specified</span>`;
      if (quizName === "") return "Not specified";
      return quizName;
    },
    editName() {
      this.editedName = this.$searcher.quizName;
      this.editingName = true;
      setTimeout(() => {
        this.$refs.editNameField.focus();
      }, 1);
    },
    validateDelay(type) {
      let regex = /^[0-9]*$/gm;
      this.minAnswerDelayRules = [true];
      this.maxAnswerDelayRules = [true];

      switch (type) {
        case 1:
          if (!regex.test(this.$globals.options.minAnswerDelay))
            return (this.minAnswerDelayRules = ["Has to be a number"]);

          if (
            Number(this.$globals.options.minAnswerDelay) >
            Number(this.$globals.options.maxAnswerDelay)
          ) {
            return (this.minAnswerDelayRules = [
              "Cannot be larger than max delay",
            ]);
          }
          break;
        case 2:
          if (!regex.test(this.$globals.options.maxAnswerDelay))
            return (this.maxAnswerDelayRules = ["Has to be a number"]);

          if (
            Number(this.$globals.options.maxAnswerDelay) <
            Number(this.$globals.options.minAnswerDelay)
          ) {
            return (this.maxAnswerDelayRules = [
              "Cannot be smaller than min delay",
            ]);
          }
          break;
      }
    },
    Error(msg) {
      this.someError = true;
      this.errorMessage = msg;

      setTimeout(() => {
        this.someError = false;
      }, 3000);
    },
    async firstJoin() {
      this.$globals.loading = true;
      this.$globals.cancelNotify();
      if (this.$kahoot.pin == "") {
        return this.$globals.notify("Pin cannot be empty", "ERROR");
      }
      if (!this.$globals.options.randomBotNames && this.username == "") {
        return this.$globals.notify("Username cannot be empty", "ERROR");
      }
      if (
        !this.$globals.options.randomBotNames &&
        !/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g.test(
          this.username
        )
      ) {
        return this.$globals.notify("Username invalid", "ERROR");
      }
      if (!/^[0-9]*$/gm.test(this.$kahoot.pin)) {
        return this.$globals.notify("Pin must be a number", "ERROR");
      }

      this.$kahoot.createBotClient(1, this.username);
    },
  },
};
</script>

<style scoped>
@media only screen and (max-width: 850px) {
  .content {
    margin-top: 4px;
    margin: 10px;
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
