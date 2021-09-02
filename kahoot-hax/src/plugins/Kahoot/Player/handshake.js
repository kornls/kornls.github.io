import GetInfo from "./getInfo";
import DecodeToken from "./decodeToken";
import { CometD } from "cometd";
import "cometd";

export default async function(pin) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    this.pin = pin;
    this.socket = new CometD();
    this.info = await GetInfo(this.pin).catch((e) => e);
    if (this.info instanceof Error) return reject(this.info);
    if (this.info.gameMode && this.info.gameMode == "team")
      this.teamMode = true;
    this.token = DecodeToken(this.info);
    this.socket.configure({
      url: `wss://kahoot.it/cometd/${this.pin}/${this.token}`,
    });
    this.socket.websocketEnabled = true;
    resolve(this.socket.handshake());
  });
}
