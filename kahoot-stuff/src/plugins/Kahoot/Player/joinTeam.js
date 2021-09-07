import Events from "./events";
import BruteForce from "./bruteForceTwoFactor";

export default function JoinTeam(members) {
  return new Promise((resolve, reject) => {
    this.on("player", (res) => {
      const { data } = res;
      if (
        data.type === "message" &&
        data.id === Events.joinTeamMembersResponse
      ) {
        if (data.error) {
          reject(new Error(data.description));
        } else {
          this.cid = data.cid;
          this.loggedIn = true;
          data.content = JSON.parse(data.content);
          this.teamNames = data.content.memberNames;
          this.quizQuestionAnswers =
            data.content.recoveryData.defaultQuizData.quizQuestionAnswers;
          if (this.info.twoFactorAuth && this.info.gameMode == "team") {
            this.loggedIn = false;
            this.on("player", (playerRes) => {
              const playerData = playerRes.data;
              const { id } = playerData;

              if (id === Events.resetTwoFactorAuth && !this.loggedIn) {
                BruteForce.Stop.call(this);
                BruteForce.Start.call(this);
              }

              if (id === Events.twoFactorAuthCorrect) {
                this.loggedIn = true;
                BruteForce.Stop.call(this);
                resolve();
              }

              if (id === Events.userNameAccepted) {
                BruteForce.Start.call(this);
              }
            });
          } else resolve();
        }
      }
    });

    this.Send("/service/controller", {
      content: JSON.stringify(members),
      id: Events.joinTeamMembers,
      type: "message",
    });
  });
}
