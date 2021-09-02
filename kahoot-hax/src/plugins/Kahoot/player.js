import RegisterEvents from "./Player/registerEvents";
import Handshake from "./Player/handshake";
import Subscribe from "./Player/subscribe";
import JoinTeam from "./Player/joinTeam";
import Events from "./Player/events";
import Leave from "./Player/leave";
import Join from "./Player/join";
import Emitter from "tiny-emitter";
const uuid = require("uuid").v4;

export default class Player extends Emitter {
  constructor() {
    super();
    this.error = false;
    this.rank = 0;
    this.points = 0;
    this.username = "";
    this.uuid = uuid();
    this.teamMode = false;
    this.teamNames = [];
    this.joined = false;
    this.timeouts = [];
    this.questionData = {
      answer: null,
      chance: 100,
      answerDelay: 100
    };
  }

  async Join(pin, username) {
    await Handshake.call(this, pin)
      .then(() => {
        Subscribe.call(this);
        Join.call(this, username)
          .then(() => {
            if (this.teamMode) {
              this.once("TEAM_UI_RESPONSE", players => {
                JoinTeam.call(this, players).then(() => {
                  this.emit("JOINED_SESSION");
                  this.joined = true;
                });
              });
              this.emit("SHOW_TEAM_UI");
            } else {
              this.emit("JOINED_SESSION");
              this.joined = true;
            }
          })
          .catch(e => {
            console.error("player.js 50: " + e);
            this.emit("SESSION_INVALID");
            this.error = true;
          });
      })
      .catch(e => {
        console.error("player.js 56: " + e);
        this.emit("SESSION_INVALID");
        this.error = true;
      });
    RegisterEvents.call(this);
  }

  async AnswerPuzzle(choice, questionIndex) {
    this.Send("/service/controller", {
      content: JSON.stringify({
        type: "jumble",
        choice,
        questionIndex: questionIndex,
        meta: { lag: Math.round(Math.random() * 45 + 5) }
      }),
      id: Events.gameBlockAnswer,
      type: "message"
    });
  }

  async Leave() {
    await Leave.call(this);
  }

  async Send(channel, data = {}) {
    const final = data;
    return new Promise(resolve => {
      if (!this.socket.isDisconnected()) {
        final.host = "kahoot.it";
        final.gameid = this.pin;
        this.socket.publish(channel, final, resolve);
      } else {
        resolve();
      }
    });
  }
}
