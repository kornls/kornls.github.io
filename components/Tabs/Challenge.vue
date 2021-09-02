<template>
  <v-app>
    <v-content>
      <v-card style="height: 100%" class="d-flex flex-column">
        <div class="ma-auto" style="max-width: 1000px; width: 100%">
          <div class="ma-auto pb-6 text-center" v-if="$challenge.state == 5">
            <h1 class="mb-2">
              Completed -
              <a :href="LeaderboardLink" target="_blank">Leaderboard</a>
            </h1>
            <h3>Resetting in {{ $challenge.leaderboardCountdown }}</h3>
          </div>
          <div
            class="ma-auto pb-6"
            v-if="$challenge.state > 2 && $challenge.state < 5"
          >
            <h1
              class="ma-auto mb-4 mt-12 display-2 font-weight-medium text-center"
              v-if="$vuetify.breakpoint.smAndUp"
            >
              Answers -
              {{ $globals.removeFormatCharacters($challenge.kahoot.name) }}
            </h1>
            <h1
              class="ma-auto mb-2 mt-6 display-1 font-weight-medium text-center"
              v-if="!$vuetify.breakpoint.smAndUp"
            >
              Answers -
              {{ $globals.removeFormatCharacters($challenge.kahoot.name) }}
            </h1>
            <div class="text-center mb-6">
              <span class="mx-auto"
                >Edit the answers for the questions below. The bot will default
                to the first selected if multiple are selected on a non
                multi-select question. They are pre-populated with the correct
                answers.</span
              >
            </div>
            <div class="ad mx-auto my-6 d-flex tect-center">
              <div class="ma-auto" id="kahoot-rocks_728x90">
                <script type="application/javascript">
                  aiptag.cmd.display.push(function () {
                    aipDisplayTag.display("kahoot-rocks_728x90");
                  });
                </script>
              </div>

              <div class="ma-auto" id="kahoot-rocks_300x250">
                <script type="application/javascript">
                  aiptag.cmd.display.push(function () {
                    aipDisplayTag.display("kahoot-rocks_300x250");
                  });
                </script>
              </div>
            </div>
            <v-card
              class="my-4"
              v-for="(question, index) in $challenge.kahoot.questions"
              v-bind:key="index"
              :loading="question.progress != null && question.progress < 100"
            >
              <template slot="progress">
                <v-progress-linear
                  indeterminate
                  height="5"
                  v-model="question.progress"
                ></v-progress-linear>
              </template>
              <v-card-title class="px-6 d-flex justify-space-between">
                <span
                  :class="`body-2 ${
                    question.progress == 100 ? 'green--text' : ''
                  }`"
                >
                  {{ $globals.removeFormatCharacters(question.text) }}
                </span>
                <v-icon :color="`${question.progress == 100 ? 'green' : ''}`">{{
                  QuestionIcon(question.type)
                }}</v-icon>
              </v-card-title>
              <v-card-text>
                <v-col class="d-flex flex-column">
                  <v-row
                    no-gutters
                    class="text-center"
                    v-if="
                      question.type != `jumble` &&
                      question.type != `content` &&
                      question.type != `open_ended`
                    "
                  >
                    <v-checkbox
                      v-for="(c, i) in question.choices"
                      v-bind:key="i"
                      v-model="question.choices[i].correct"
                      :disabled="question.locked"
                      class="ma-auto px-1"
                    >
                      <template v-slot:label>
                        <span v-if="c.image == undefined">{{
                          $globals.removeFormatCharacters(c.answer)
                        }}</span>
                        <img
                          v-else
                          :src="`https://images-cdn.kahoot.it/${c.image.id}?auto=webp&height=64&crop=${c.image.crop.target.x},${c.image.crop.target.y},x${c.image.crop.origin.x},y${c.image.crop.origin.y}`"
                          alt="c.image"
                        />
                      </template>
                    </v-checkbox>
                  </v-row>
                  <v-row
                    no-gutters
                    class="text-center"
                    v-else-if="question.type == `open_ended`"
                  >
                    <v-text-field
                      :disabled="question.locked"
                      v-model="
                        $challenge.kahoot.questions[index].choices[0].answer
                      "
                    ></v-text-field>
                  </v-row>
                  <v-row
                    no-gutters
                    class="text-center"
                    v-else-if="question.type == `content`"
                  >
                    <span class="ma-auto"
                      >{{
                        $globals.removeFormatCharacters(question.description)
                      }}
                      <a
                        v-if="question.image"
                        @click="$challenge.popoutImage = question.image"
                        >Image</a
                      ></span
                    >
                  </v-row>
                  <v-row
                    no-gutters
                    class="text-center"
                    v-else-if="question.type == `jumble`"
                  >
                    <v-col class="mx-2">
                      <h4 class="text-center">Answer order</h4>
                      <draggable
                        :disabled="question.locked"
                        class="mx-4 list-group text-center"
                        ghost-class="ghost"
                        v-model="$challenge.kahoot.questions[index].choices"
                        @start="dragging = true"
                        @end="dragging = false"
                      >
                        <div
                          v-for="(item, i) in question.choices"
                          :key="i"
                          class="list-group-item my-2 py-2 px-2 text-center"
                          :id="
                            GetDraggableItemId(
                              question.locked ? null : item.option
                            )
                          "
                        >
                          {{ item.answer }}
                        </div>
                      </draggable>
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="text-center" v-else>
                    <span class="ma-auto red--text"
                      >Unrecognized question type. Join the Discord and open a
                      ticket</span
                    >
                  </v-row>
                </v-col>
              </v-card-text>
            </v-card>
          </div>
          <div class="ma-auto pb-12" id="inputs">
            <div
              class="ad mx-auto mb-12 d-flex tect-center"
              v-if="$challenge.state < 3"
            >
              <div class="ma-auto" id="kahoot-rocks_728x90">
                <script type="application/javascript">
                  aiptag.cmd.display.push(function () {
                    aipDisplayTag.display("kahoot-rocks_728x90");
                  });
                </script>
              </div>

              <div class="ma-auto" id="kahoot-rocks_300x250">
                <script type="application/javascript">
                  aiptag.cmd.display.push(function () {
                    aipDisplayTag.display("kahoot-rocks_300x250");
                  });
                </script>
              </div>
            </div>
            <div
              class="d-flex align-center pb-5 mx-2"
              v-if="$challenge.state < 3"
            >
              <v-text-field
                style="max-width: 728px"
                class="text-center mx-auto"
                v-if="$challenge.state == 1"
                v-model="url"
                @keyup.enter="Continue"
                :rules="urlRules"
                label="Challenge link"
                hide-details="auto"
              ></v-text-field>
              <v-text-field
                style="max-width: 728px"
                class="text-center mx-auto"
                v-if="$challenge.state == 2"
                v-model="$challenge.username"
                @keyup.enter="Continue"
                :rules="usernameRules"
                label="Username"
                hide-details="auto"
              ></v-text-field>
            </div>
            <div class="text-center mb-6" v-if="$challenge.state < 4">
              <v-btn
                v-if="$challenge.state != 1"
                class="my-2 mx-auto white--text theme--dark"
                @click="$challenge.Reset"
                >Reset Challenge</v-btn
              >
              <v-btn
                :class="`my-2 mx-${
                  $challenge.state != 1 ? '4' : 'auto'
                } white--text`"
                :loading="loading"
                :disabled="loading"
                @click="Continue"
                style="
                  -webkit-animation: bgcolor 20s infinite;
                  animation: bgcolor 10s infinite;
                  -webkit-animation-direction: alternate;
                  animation-direction: alternate;
                "
                :large="$challenge.state == 3"
                >Continue</v-btn
              >
              <v-btn
                v-if="$challenge.state == 3"
                class="my-2 mx-auto white--text theme--dark"
                @click="ResetAnswers"
                >Reset all answers</v-btn
              >
            </div>
          </div>
        </div>
      </v-card>
    </v-content>
  </v-app>
</template>

<script>
/* eslint-disable no-case-declarations */
export default {
  components: {
    draggable: () => import("vuedraggable"),
  },
  data() {
    return {
      loading: false,
      details: null,
      url: "",
      urlRules: [
        (value) =>
          /kahoot.it\/challenge\/[a-zA-Z0-9]+/.test(value) ||
          (value == "" ? true : "Invalid link"),
      ],
      usernameRules: [
        (value) => {
          let regex = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
          return (
            regex.test(value) ||
            (value == "" ? true : "Cannot contain special characters")
          );
        },
      ],
      dragging: false,
    };
  },
  methods: {
    async Continue() {
      this.loading = true;
      switch (this.$challenge.state) {
        case 1:
          if (this.url == "") return (this.loading = false);
          if (!/kahoot.it\/challenge\/[a-zA-Z0-9]+/.test(this.url))
            return (this.loading = false);
          let id = null;
          id = /(?<=(kahoot\.it\/challenge\/))[0-9a-z]{8}-([0-9a-z]{4}-){3}[0-9a-z]{12}_[0-9]{13}/i.exec(
            this.url
          );
          if (id == null) {
            id = /(?<=(challenge-id=))[0-9a-z]{8}-([0-9a-z]{4}-){3}[0-9a-z]{12}_[0-9]{13}/i.exec(
              this.url
            );
          }
          if (id == null) {
            const pin = /(?<=(kahoot\.it\/challenge\/))[0-9]+/i.exec(
              this.url
            )[0];
            id = [
              await fetch(
                `https://abstract.land/kahoot/rest/challenges/pin/${pin}`
              )
                .then((res) => res.json())
                .then((body) => body.challenge.challengeId)
                .catch((e) => e),
            ];
          }
          if (id instanceof Error) {
            this.$globals.notify("Invalid link", "ERROR");
            break;
          }
          this.details = await fetch(
            `https://abstract.land/kahoot/rest/challenges/${id[0]}?includeKahoot=true`
          )
            .then((res) => res.json())
            .catch((e) => e);
          if (this.details.error) {
            this.$globals.notify("Invalid link", "ERROR");
            break;
          }

          if (this.details.endTime < Date.now()) {
            this.$globals.notify("That challenge has ended", "ERROR");
            break;
          }

          if (
            !this.details.game_options.namerator &&
            !this.$globals.options.randomBotNames
          ) {
            this.$challenge.state = 2;
          } else {
            this.$challenge.ShowQuestions(this.details);
          }
          break;
        case 2:
          if (this.$challenge.username == "") break;
          if (
            !/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g.test(
              this.$challenge.username
            )
          )
            break;
          await fetch(
            `https://abstract.land/kahoot/apis/profanities/nickname/${encodeURIComponent(
              this.$challenge.username
            )}`
          )
            .then((res) => res.json())
            .then((body) => {
              if (body.length == 0) {
                this.$challenge.ShowQuestions(this.details);
              } else {
                this.$globals.notify(
                  "Username cannot contain profanity",
                  "ERROR"
                );
                body.forEach(
                  (p) =>
                    (this.$challenge.username = this.$challenge.username.replace(
                      p,
                      ""
                    ))
                );
              }
            });
          break;
        case 3:
          this.$challenge.Start();
          break;
      }
      this.loading = false;
      this.url = "";
    },
    QuestionIcon(t) {
      switch (t) {
        case "jumble":
          return "mdi-puzzle";
        case "multiple_select_quiz":
        case "multiple_select_poll":
          return "mdi-checkbox-multiple-marked-outline";
        case "open_ended":
          return "mdi-pencil-outline";
        case "survey":
          return "mdi-vote-outline";
        case "quiz":
          return "mdi-ab-testing";
        case "content":
          return "mdi-format-align-justify";
        default:
          console.warn(`No challenge icon for question type ${t}`);
          return "mdi-help";
      }
    },
    GetDraggableItemId(id) {
      switch (id) {
        case 0:
          return "red-draggable";
        case 1:
          return "blue-draggable";
        case 2:
          return "yellow-draggable";
        case 3:
          return "green-draggable";
        default:
          return this.$vuetify.theme.isDark
            ? "disabled-draggable-dark"
            : "disabled-draggable-light";
      }
    },
    async ResetAnswers() {
      this.details = await fetch(
        `https://abstract.land/kahoot/rest/challenges/${this.$challenge.details.challengeId}?includeKahoot=true`
      )
        .then((res) => res.json())
        .catch((e) => e);

      if (this.details.error) {
        this.$globals.notify("Invalid link", "ERROR");
        return;
      }
      this.$challenge.ShowQuestions(this.details);
    },
  },
  computed: {
    LeaderboardLink() {
      return `https://kahoot.it/challenge/${
        this.$challenge.details.challengeId
      }?&uid=${btoa(this.$challenge.username)}`;
    },
    loadingTwo() {
      return this.loading;
    },
  },
};
</script>

<style scoped>
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

.ghost {
  opacity: 0.5;
  background: #808080;
}

.list-group-item {
  border-width: 2px;
  border-style: solid;
  border-radius: 10px;
}

#red-draggable,
#blue-draggable,
#yellow-draggable,
#green-draggable {
  cursor: grab;
  min-width: 128px;
}

#red-draggable {
  border-color: #e21b3c;
  color: #e21b3c;
}

#blue-draggable {
  border-color: #1368ce;
  color: #1368ce;
}

#yellow-draggable {
  border-color: #d89e00;
  color: #d89e00;
}

#green-draggable {
  border-color: #26890c;
  color: #26890c;
}

#disabled-draggable-dark {
  border-color: #626262;
  color: #626262;
}

#disabled-draggable-light {
  border-color: #bdbdbd;
  color: #bdbdbd;
}
</style>
