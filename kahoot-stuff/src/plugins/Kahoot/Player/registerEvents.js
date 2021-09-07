/* eslint-disable no-case-declarations */
import Events from "./events";

export default function() {
  this.on("player", (message) => {
    const { data } = message;
    const { type } = data;

    switch (type) {
      case "message": {
        const { id, content } = data;
        const parsedContent = content ? JSON.parse(content) : "";

        this.emit("message", {
          id,
          content: parsedContent
        });
        break;
      }

      default: {
        break;
      }
    }
  });

  this.on("status", (message) => {
    const { status } = message.data;
    if (status == "MISSING") {
      this.emit("GAME_END_UNEXPECTED");
      this.Leave();
    }
  });

  this.on("message", (message) => {
    switch (message.id) {
      case Events.startQuiz: {
        this.emit("QUIZ_QUESTION_ANSWERS", message.content.quizQuestionAnswers);
        break;
      }
      case Events.getReady: {
        const { questionIndex } = message.content;
        this.emit("NEW_QUESTION", questionIndex);
        this.emit("GET_QUESTION_DATA", questionIndex);
        break;
      }
      case Events.startQuestion: {
        if (Math.floor(Math.random() * 100) + 1 > this.questionData.chance) {
          this.questionData.answer = null;
        }

        let content = {
          questionIndex: message.content.questionIndex,
          type: message.content.gameBlockType,
          meta: { lag: Math.round(Math.random() * 45 + 5) }
        };
        switch (message.content.gameBlockType) {
          case "jumble":
            this.emit("PUZZLE_QUESTION");
            return;
          case "open_ended":
            if (this.questionData.answer == null)
              this.questionData.answer = "kahoot.rocks :D";
            content.text = this.questionData.answer;
            break;
          case "multiple_select_quiz":
            if (this.questionData.answer == null) {
              let possibleAnswers = [];
              for (let i = 0; i < message.content.numberOfAnswersAllowed; i++) {
                possibleAnswers.push(i + 1);
              }
              let i = possibleAnswers.length,
                answers = [],
                j = 0;
              while (i--) {
                j = Math.floor(Math.random() * (i + 1));
                answers.push(possibleAnswers[j]);
                possibleAnswers.splice(j, 1);
              }
              content.choice = answers;
            } else content.choice = this.questionData.answer;
            break;
          default:
            if (this.questionData.answer == null) {
              this.questionData.answer = Math.floor(
                Math.random() *
                  message.content.quizQuestionAnswers[
                    message.content.questionIndex
                  ]
              );
            }
            content.choice = this.questionData.answer;
        }
        const answerDelay = Math.abs(
          Math.ceil(
            this.questionData.answerDelay.min +
              Math.random() *
                (this.questionData.answerDelay.max -
                  this.questionData.answerDelay.min)
          )
        );
        setTimeout(() => {
          this.Send("/service/controller", {
            content: JSON.stringify(content),
            id: Events.gameBlockAnswer,
            type: "message"
          });
        }, answerDelay);
        break;
      }
      case Events.revealAnswer: {
        this.rank = message.content.rank;
        this.points = message.content.totalScore;
        this.emit("QUESTION_RESULTS", {
          correctChoices: message.content.correctChoices,
          text: message.content.text
        });
        break;
      }
      case Events.gameOver: {
        this.emit("GAME_END");
        this.Leave();
        break;
      }
      case Events.playAgain: {
        this.Leave();
        break;
      }
      case Events.resetController: {
        this.joined = false;
        if (message.content.kickCode == 1) {
          this.emit("KICKED");
          this.Leave();
        }
        break;
      }
      default: {
        break;
      }
    }
  });

  this.on("GET_QUESTION_DATA_RESPONSE", (data) => {
    this.questionData = data;
  });
}
