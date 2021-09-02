export default function(pin) {
  return new Promise((resolve, reject) => {
    fetch(
      `https://abstract.land/kahoot/reserve/session/${pin}/?${Date.now()}`,
      {
        headers: {
          "user-agent": navigator.userAgent,
          referer: "https://kahoot.it/",
          "accept-language": "en-US,en;q=0.8",
          accept: "*/*",
        },
      }
    )
      .then(async (res) => {
        if (res.status == 404) resolve(new Error("404 Session not found"));
        if (res.headers.get("x-kahoot-session-token")) {
          let info = await res.json();
          info.header = res.headers.get("x-kahoot-session-token");
          resolve(info);
        }
      })
      .catch((err) => reject(err));
  });
}
