import Player from "./player";

function GetRandomName() {
  let error = true;
  let name = "";
  do {
    error = false;
    name = fetch("https://apis.kahoot.it/namerator")
      .then((res) => res.json())
      .then((body) => body.name)
      .catch(() => (error = true));
  } while (error);
  return name;
}

export { Player, GetRandomName };
