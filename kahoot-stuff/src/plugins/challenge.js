export default {
  install(Vue) {
    Vue.component();

    const Challenge = new Vue({
      data: {
        state: 1,
        username: "",
        details: null,
        kahoot: null,
        answers: null,
        rawAnswers: null,
        rawKahoot: null,
        playerDetails: null,
        streak: 1,
        points: 0,
        showNewNicknameDialog: false,
        leaderboardCountdown: 0,
        popoutImage: "",
      },
      methods: {
        async Start() {
          this.state = 4;
          this.kahoot.questions.forEach((q) => (q.locked = true));
          window.scrollTo({ top: 0, behavior: "smooth" });

          if (this.username == "") {
            this.username = await fetch("https://apis.kahoot.it/namerator")
              .then((res) => res.json())
              .then((body) => body.name);
            this.$globals.notify(`Playing as ${this.username}`);
          }

          await fetch(
            `https://abstract.land/kahoot/rest/challenges/${
              this.details.challengeId
            }/join/?nickname=${encodeURIComponent(this.username)}`,
            {
              method: "post",
              body: JSON.stringify({ nickname: this.username }),
            }
          )
            .then((res) => res.json())
            .then((body) => (this.playerDetails = body));
          if (
            this.playerDetails.error &&
            this.playerDetails.error == "NICKNAME_EXISTS"
          ) {
            this.$globals.notify("Nickname already in use", "ERROR");
            this.showNewNicknameDialog = true;
            return;
          }

          this.rawKahoot = this.details.kahoot;
          this.answers = this.$searcher
            .formatKahoots([this.kahoot])[0]
            .questions.map((q) => q.answer);
          this.rawAnswers = this.$searcher
            .formatKahoots([this.FormatKahoot(this.rawKahoot)])[0]
            .questions.map((q) => q.answer);
          for (let i = 0; i < this.kahoot.questions.length; i++) {
            await this.AnswerQuestion(i);
          }

          this.state = 5;
          for (
            this.leaderboardCountdown = 10;
            this.leaderboardCountdown >= 0;
            this.leaderboardCountdown--
          ) {
            await this.Wait(1000);
          }
          this.Reset();
        },
        AnswerQuestion(index) {
          // eslint-disable-next-line no-async-promise-executor
          return new Promise(async (resolve) => {
            this.kahoot.questions[index].progress = 0;
            await fetch(
              `https://abstract.land/kahoot/rest/challenges/${this.playerDetails.challenge.challengeId}/progress/?upToQuestion=${index}`
            );
            let answerDelay = Math.abs(
              Math.ceil(
                Number(this.$globals.options.minAnswerDelay) +
                  Math.random() *
                    (Number(this.$globals.options.maxAnswerDelay) -
                      Number(this.$globals.options.minAnswerDelay))
              )
            );
            const data = {
              quizId: this.playerDetails.challenge.quizId,
              quizType: this.rawKahoot.quizType,
              quizMaster: this.playerDetails.challenge.quizMaster,
              sessionId: this.playerDetails.challenge.pin,
              numQuestions: this.rawKahoot.questions.length,
              startTime: Date.now(),
              question: {
                index,
                answers: [
                  {
                    playerId: this.username,
                    playerCid: this.playerDetails.playerCid,
                    reactionTime: answerDelay,
                  },
                ],
              },
            };

            switch (this.kahoot.questions[index].type) {
              case "quiz":
                data.question.answers[0].choiceIndex = this.answers[index];
                data.question.answers[0].isCorrect =
                  JSON.stringify(this.answers[index]) ==
                  JSON.stringify(this.rawAnswers[index]);
                break;
              case "survey":
                data.question.answers[0].choiceIndex = this.answers[index];
                data.question.answers[0].isCorrect = true;
                break;
              case "multiple_select_quiz":
              case "multiple_select_poll":
                data.question.answers[0].choiceIndex = -5;
                data.question.answers[0].selectedChoices = this.answers[index];
                data.question.answers[0].isCorrect =
                  JSON.stringify(this.answers[index]) ==
                  JSON.stringify(this.rawAnswers[index]);
                break;
              case "jumble":
                data.question.answers[0].choiceIndex = -1;
                data.question.answers[0].selectedJumbleOrder = this.kahoot.questions[
                  index
                ].choices.map((c) => c.option);
                data.question.answers[0].isCorrect =
                  JSON.stringify(
                    this.kahoot.questions[index].choices.map((c) => c.option)
                  ) == JSON.stringify([0, 1, 2, 3]);
                break;
              case "open_ended":
                data.question.answers[0].choiceIndex = -4;
                data.question.answers[0].originalText = this.answers[
                  index
                ].replace(/[~`!@#$%^&*(){}[\];:"'<,.>?/\\|\-_+=]/gm, "");
                data.question.answers[0].isCorrect = this.rawKahoot.questions[
                  index
                ].choices
                  .map((c) => c.answer)
                  .includes(this.answers[index]);
                break;
            }

            const question = this.rawKahoot.questions[index];
            if (question.points) {
              let points =
                Math.round((1 - answerDelay / question.time / 2) * 1000) *
                question.pointsMultiplier *
                +question.points *
                this.streak;
              if (points > 1000 * question.pointsMultiplier)
                points = 1000 * question.pointsMultiplier;
              data.question.answers[0].points = data.question.answers[0]
                .isCorrect
                ? Math.ceil(points)
                : 0;
              data.question.answers[0].isCorrect
                ? (this.streak += 0.01)
                : (this.streak = 1);
              this.points += points;
              if (this.streak > 1.1) this.streak = 1.1;
            }

            setTimeout(() => {
              resolve(
                fetch(
                  `https://abstract.land/kahoot/rest/challenges/${this.details.challengeId}/answers`,
                  {
                    method: "post",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                  }
                ).then(() => (this.kahoot.questions[index].progress = 100))
              );
            }, answerDelay);
          });
        },
        async Wait(milliseconds) {
          return new Promise((resolve) => setTimeout(resolve, milliseconds));
        },
        ShowQuestions(details) {
          this.details = details;
          this.kahoot = this.FormatKahoot(this.details.kahoot);
          this.state = 3;
        },
        Reset() {
          this.state = 1;
          this.username = "";
          this.details = null;
          this.kahoot = null;
          this.rawKahoot = null;
          this.playerDetails = null;
          this.showNewNicknameDialog = false;
          this.answers = null;
          this.rawAnswers = null;
          this.leaderboardCountdown = 0;
          this.popoutImage = "";
          this.streak = 1;
          this.points = 0;
        },
        FormatKahoot(kahoot) {
          let questions = [];
          kahoot.questions.forEach((question) => {
            if (question.type == "feedback" || question.type == "brainstorming")
              question.type = "content";
            let obj = {
              type: question.type,
              locked: false,
              progress: null,
            };

            if (question.type != "content") {
              let answers = [];
              switch (question.type) {
                case "word_cloud":
                  answers = "kahoot.rocks is the best :D";
                  break;
                case "jumble":
                  for (let i = 0; i < question.choices.length; i++) {
                    question.choices[i].option = i;
                  }
                  answers = question.choices;
                  break;
                default:
                  answers = question.choices;
              }
              obj.choices = answers;
              obj.timeout = question.time;
              obj.text = question.question;
            } else {
              obj.description = question.description;
              obj.image = question.image;
              obj.text = question.title;
            }

            questions.push(obj);
          });

          return {
            name: kahoot.title,
            uuid: kahoot.uuid,
            quizQuestionAnswers: kahoot.quizQuestionAnswers,
            questions,
          };
        },
      },
    });

    Vue.prototype.$challenge = Challenge;
  },
};
