import Events from "./events";
import BruteForce from "./bruteForceTwoFactor";
import { GetRandomName } from "../index";

export default function Join(username, pin) {
  this.username = username;
  const twoFactor = this.info.twoFactorAuth && this.info.gameMode != "team";
  return new Promise((resolve, reject) => {
    this.on("controller", (res) => {
      const { data } = res;
      if (data.type === "loginResponse") {
        if (data.error) {
          if (data.error == "USER_INPUT") {
            GetRandomName().then((name) => {
              Join.call(this, name);
            });
          } else reject(new Error(data.description));
        } else {
          this.cid = data.cid;
          if (!twoFactor) {
            this.loggedIn = true;
            resolve();
          }
        }
      }
    });

    if (twoFactor) {
      this.once("status", (statusRes) => {
        const statusData = statusRes.data;
        const { status } = statusData;
        if (status === "ACTIVE") {
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
        } else {
          reject(new Error(`Status not active: ${status}`));
        }
      });
    }

    setTimeout(() => {
      this.Send("/service/controller", {
        content: JSON.stringify({
          device: {
            userAgent: navigator.userAgent,
            screen: { width: window.innerWidth, height: window.innerHeight },
          },
        }),
        gameid: pin,
        name: this.username,
        type: "login",
      });
    }, 1001);
  });
}
