import Vue from "vue";
import { Player, GetRandomName } from "./Kahoot/index";

const manager = new Vue({
  data() {
    return {
      pin: "",
      players: [],
      searcher: null,
      kahootStarted: false,
      questionIndex: 0,
      quizNameRequired: false,
      sortable: {
        open: false,
        order: [
          {
            color: "Red",
            id: "red-draggable",
            option: 0,
          },
          {
            color: "Blue",
            id: "blue-draggable",
            option: 1,
          },
          {
            color: "Yellow",
            id: "yellow-draggable",
            option: 2,
          },
          {
            color: "Green",
            id: "green-draggable",
            option: 3,
          },
        ],
        correct: [
          "One time there was a stealer",
          "They really liked Vue.js",
          "Particularly kahoot.rocks",
          "I say go ahead",
        ],
      },
    };
  },
  methods: {
    async reset() {
      let leavePromises = [];
      try {
        this.players.forEach((player) => leavePromises.push(player.Leave()));
      } catch (e) {
        console.error(`kahoot.js 53: ${e}`);
      }
      Promise.all(leavePromises);

      this.pin = "";
      this.socket = null;
      this.players = [];
      this.kahootStarted = false;
      this.questionIndex = 0;
      this.quizNameRequired = false;
      this.$globals.joined = 0;
      this.$globals.joining = 0;
      this.$searcher.quizName = "";
      this.$searcher.quizQuestionAnswers = [];
      this.$searcher.rawKahoots = [];
      this.$searcher.kahoots = [];
      this.$searcher.filterData = [];
      this.$searcher.gotDbKahoots = false;
    },
    async raid(username, amount) {
      if (!this.$globals.options.randomBotNames && username == "")
        return this.$globals.notify("Username cannot be empty", "ERROR");
      if (amount == "")
        return this.$globals.notify("Amount cannot be empty", "ERROR");
      if (
        !this.$globals.options.randomBotNames &&
        !/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g.test(
          username
        )
      ) {
        return this.$globals.notify("Username invalid", "ERROR");
      }
      if (!/^[0-9]+$/g.test(amount)) {
        return this.$globals.notify("Amount must be a number", "ERROR");
      }

      amount = Number(amount);
      this.$globals.joining += amount;
      let joinPromises = [];
      for (let i = 0; i < amount; i++) {
        let finalUName;
        finalUName = username;
        if (amount > 1) finalUName += `-${i}`;

        joinPromises.push(this.createBotClient(amount, finalUName));
      }
      Promise.all(joinPromises).then(() => {
        this.$globals.joining -= amount;
        this.$globals.joined -= amount;
      });
    },
    createBotClient(totalAmount, username) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        if (this.$globals.options.randomBotNames)
          username = await fetch("https://apis.kahoot.it/namerator")
            .then((res) => res.json())
            .then((d) => d.name);
        const delay = Math.ceil(Math.random() * (totalAmount * 25 + 100));
        setTimeout(() => {
          const player = new Player();
          this.players.push(player);
          if (player.uuid == this.players[0].uuid) player.mainPlayer = true;

          player.on("SESSION_INVALID", () => {
            this.$globals.loading = false;
            this.$globals.notify("Game pin invalid", "ERROR");
            this.reset();
          });

          player.on("JOINED_SESSION", () => {
            this.$globals.joined++;
            player.joined = true;
            if (player.uuid == this.players[0].uuid) {
              this.$globals.loading = false;
            }
            resolve();
          });

          player.on("NEW_QUESTION", (questionIndex) => {
            if (player.uuid == this.players[0].uuid) {
              this.questionIndex = questionIndex;
            }
          });

          player.on("GET_QUESTION_DATA", (questionIndex) =>
            player.emit(
              "GET_QUESTION_DATA_RESPONSE",
              this.getQuestionData(questionIndex)
            )
          );

          player.on("QUESTION_RESULTS", (results) => {
            if (player.uuid == this.players[0].uuid) {
              this.$searcher.filterData.push(results);
            }
          });

          player.on("PLAYER_LEAVE", () => {
            this.players.forEach((pl, index) => {
              if (pl.uuid == player.uuid) this.players.splice(index, 1);
            });
          });

          player.on("QUIZ_QUESTION_ANSWERS", (m) => {
            if (player.uuid == this.players[0].uuid) {
              this.kahootStarted = true;
              this.$searcher.quizQuestionAnswers = m;
            }
          });

          player.on("KICKED", () => {
            this.players.forEach((pl, index) => {
              if (pl.uuid == player.uuid) this.players.splice(index, 1);
            });
            this.$globals.loading = false;
            if (this.players.length == 0) {
              this.$globals.notify("Kicked from game by host", "ERROR");
              this.reset();
            }
          });

          player.once("SHOW_TEAM_UI", () => {
            if (
              player.uuid == this.players[0].uuid &&
              !this.$globals.options.randomBotNames
            ) {
              this.$globals.loading = false;
              this.$globals.showTeamMembersUi = true;
            } else player.emit("TEAM_UI_RESPONSE", [player.username]);
          });

          player.on("PUZZLE_QUESTION", () => {
            if (player.uuid == this.players[0].uuid) {
              this.$globals.sortable.open = true;
              this.$globals.sortable.order = [
                { color: "Red", id: "red-draggable", option: 0 },
                { color: "Blue", id: "blue-draggable", option: 1 },
                { color: "Yellow", id: "yellow-draggable", option: 2 },
                { color: "Green", id: "green-draggable", option: 3 },
              ];
              this.$globals.sortable.correct = this.$searcher.kahoots[0].questions[
                this.questionIndex
              ].answer;
            }
          });

          player.on("GAME_END_UNEXPECTED", () => {
            if (player.uuid == this.players[0].uuid) {
              this.$globals.loading = false;
              this.$globals.notify("Game ended unexpectedly", "ERROR");
              this.save();
              this.reset();
            }
          });

          player.on("GAME_END", () => {
            if (player.uuid == this.players[0].uuid) {
              this.save();
            }
          });

          player.Join(this.pin, username);
        }, delay);
      });
    },
    getQuestionData(questionIndex) {
      let answer = null;
      if (this.$searcher.kahoots.length > 0) {
        answer = this.$searcher.kahoots[0].questions[questionIndex].answer;
      }

      return {
        answerDelay: {
          min: Number(this.$globals.options.minAnswerDelay),
          max: Number(this.$globals.options.maxAnswerDelay),
        },
        answer,
        chance: Number(this.$globals.options.answerCorrect),
      };
    },
    sortableAnswer() {
      this.sortable.open = false;
      const answer = this.sortable.order.map((el) => el.option);
      this.players[0].AnswerPuzzle(answer, this.questionIndex);
      this.players.forEach((player) =>
        player.AnswerPuzzle(answer, this.questionIndex)
      );
    },
    mainPlayerTeamMembers(teamMembers) {
      let members = teamMembers.map((el) => el.name);
      members = members.filter((member) =>
        /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g.test(
          member
        )
      );
      if (members.length > 0) {
        this.$globals.loading = true;
        this.players[0].emit("TEAM_UI_RESPONSE", members);
        this.$globals.showTeamMembersUi = false;
      }
    },
    async getRandomName() {
      return await GetRandomName();
    },
  },
});

export default {
  install(MainVue) {
    MainVue.prototype.$kahoot = manager;
  },
};
