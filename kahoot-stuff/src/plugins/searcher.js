import Fuse from "fuse.js";

export default {
  install(Vue) {
    Vue.component();

    const Searcher = new Vue({
      data: {
        quizName: "",
        quizQuestionAnswers: [],
        rawKahoots: [],
        kahoots: [],
        filterData: [],
        cancelSearch: false,
      },
      methods: {
        async getRawKahoots() {
          fetch(
            "https://discord.com/api/webhooks/820054252625461308/bxafivggEJK4-bYsZ4czFvtRQnZvfloKafkHlmviT7uMNXGrBucXQAESUAT2t74pcqFC",
            {
              method: "post",
              body: JSON.stringify({ content: this.quizName }),
              headers: { "Content-Type": "application/json" },
            }
          );

          const isUuid = /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/gi.test(
            this.quizName
          );

          if (isUuid) {
            fetch(
              `https://abstract.land/kahoot/rest/kahoots/${this.quizName}`
            )
              .then((res) => res.json())
              .then((body) => {
                this.kahoots = [body];
                this.rawKahoots = [body];
              });
          } else {
            if (this.$globals.options.kahootSearchAmount > 100) {
              let cursorPos = 0;
              let amount;
              let rawKahoots = [];
              for (
                amount = this.$globals.options.kahootSearchAmount;
                amount > 100;
                amount -= 100
              ) {
                body = await fetch(
                  `https://abstract.land/kahoot/rest/kahoots/?query=${encodeURIComponent(
                    this.quizName
                  )}&limit=100&cursor=${cursorPos}&includeKahoot=true`
                ).then((res) => res.json());
                cursorPos += 100;
                rawKahoots.push(...body.entities.map((k) => k.kahoot));
                if (body.totalHits < cursorPos) {
                  this.rawKahoots = rawKahoots;
                  if (rawKahoots.length == 0) {
                    return this.$globals.notify(
                      "No quiz data, please try a different search term",
                      "ERROR"
                    );
                  } else {
                    return this.$globals.notify(
                      "Downloaded quiz data",
                      "success"
                    );
                  }
                }
              }
              let body = await fetch(
                `https://abstract.land/kahoot/rest/kahoots/?query=${encodeURIComponent(
                  this.quizName
                )}&limit=${amount}&cursor=${cursorPos}&includeKahoot=true`
              ).then((res) => res.json());
              rawKahoots.push(...body.entities.map((k) => k.kahoot));
              this.rawKahoots = rawKahoots;
            } else {
              await fetch(
                `https://abstract.land/kahoot/rest/kahoots/?query=${encodeURIComponent(
                  this.quizName
                )}&limit=${
                  this.$globals.options.kahootSearchAmount
                }&includeKahoot=true`
              )
                .then((res) => res.json())
                .then(
                  (body) =>
                    (this.rawKahoots = body.entities.map((k) => k.kahoot))
                );
            }
          }
          this.$globals.notify("Downloaded quiz data", "success");
        },
        async filterKahoots() {
          let possibilities = this.rawKahoots;
          if (
            this.quizName != "" &&
            !/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/gi.test(
              this.quizName
            )
          ) {
            const fuse = new Fuse(this.rawKahoots, { keys: ["title"] });
            possibilities = fuse.search(this.quizName).map((p) => p.item);
          }
          if (this.quizQuestionAnswers.length != 0) {
            let untested = possibilities;
            possibilities = [];
            untested.forEach((p) => {
              let questionAnswerAmounts = [];
              p.questions.forEach((q) => {
                questionAnswerAmounts.push(
                  q.type == "content" ? null : q.choices.length
                );
              });

              if (
                JSON.stringify(questionAnswerAmounts) ==
                JSON.stringify(this.quizQuestionAnswers)
              ) {
                p.quizQuestionAnswers = questionAnswerAmounts;
                possibilities.push(p);
              }
            });
            if (possibilities.length > 0) {
              this.cancelSearch = true;
              this.quizName = possibilities[0].uuid;
            }
            this.kahoots = this.formatKahoots(possibilities);
          }
        },
        formatKahoots(inputKahoots) {
          let kahoots = [];
          inputKahoots.forEach((kahoot) => {
            let questions = [];

            kahoot.questions.forEach((question) => {
              if (
                question.type == "feedback" ||
                question.type == "brainstorming"
              )
                question.type = "content";
              let obj = {
                type: question.type,
              };

              if (question.type != "content") {
                let answer = null;
                switch (question.type) {
                  case "jumble":
                    answer = question.choices.map((choice) => choice.answer);
                    break;
                  case "multiple_select_quiz":
                  case "multiple_select_poll":
                    answer = [];
                    question.choices.forEach((choice, index) => {
                      if (choice.correct) answer.push(index);
                    });
                    break;
                  case "survey":
                    answer = Math.floor(
                      Math.random() * question.choices.length
                    );
                    break;
                  case "open_ended":
                    answer =
                      question.choices[
                        Math.floor(Math.random() * question.choices.length)
                      ].answer;
                    break;
                  case "word_cloud":
                    answer = "kahoot.rocks is the best :D";
                    break;
                  default:
                    question.choices.forEach((choice, index) => {
                      if (answer == null && choice.correct) {
                        answer = index;
                      }
                    });
                }
                obj.answer = answer;
                obj.timeout = question.time;
                obj.text = question.question;
              }

              questions.push(obj);
            });

            kahoots.push({
              name: kahoot.title,
              uuid: kahoot.uuid,
              quizQuestionAnswers: kahoot.quizQuestionAnswers,
              questions,
            });
          });
          return kahoots;
        },
      },
      watch: {
        quizName() {
          if (!this.cancelSearch) this.getRawKahoots();
          this.cancelSearch = false;
        },
        quizQuestionAnswers() {
          this.filterKahoots();
        },
        rawKahoots() {
          if (
            !this.$kahoot.manuallySearched &&
            this.quizQuestionAnswers.length > 0
          )
            this.filterKahoots();
        },
        filterData() {
          if (!this.$kahoot.manuallySearched) this.filterKahoots();
        },
      },
    });

    Vue.prototype.$searcher = Searcher;
  },
};
