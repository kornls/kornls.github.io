export default function () {
  this.socket.subscribe("/service/controller", (m) =>
    this.emit("controller", m)
  );
  this.socket.subscribe("/service/player", (m) => this.emit("player", m));
  this.socket.subscribe("/service/status", (m) => this.emit("status", m));
}
