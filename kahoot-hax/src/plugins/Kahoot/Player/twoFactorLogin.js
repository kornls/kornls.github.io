import Events from "./events";

export default function (code) {
  return this.Send("/service/controller", {
    id: Events.submitTwoFactorAuth,
    type: "message",
    content: JSON.stringify({
      sequence: code,
    }),
  });
}
