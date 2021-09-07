import BruteForce from "./bruteForceTwoFactor";

export default async function() {
  BruteForce.Stop.call(this);

  setTimeout(() => {
    this.emit("PLAYER_LEAVE");
    this.Send("/service/controller", {
      cid: this.cid,
      type: "left"
    });
    const disconnect = new Promise(resolve => this.socket.disconnect(resolve));
    return disconnect;
  }, Math.floor(Math.random() * 5000));
}
