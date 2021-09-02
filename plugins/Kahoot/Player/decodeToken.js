export default function (info) {
  return concatTokens(
    Buffer.from(info.header, "base64").toString("ascii"),
    solveChallenge(info.challenge)
  );
}

const _eval = `let _ = { 
  replace: function() { 
    var args = arguments; 
    var str = arguments[0]; 
    return str.replace(args[1], args[2]); 
  } 
};  
var log = function(){}; 
return `;

function solveChallenge(challenge) {
  let solved = "";
  // eslint-disable-next-line no-control-regex
  challenge = challenge.replace(/(\u0009|\u2003)/gm, "");
  challenge = challenge.replace(/this /gm, "this");
  challenge = challenge.replace(/ *\. */gm, ".");
  challenge = challenge.replace(/ *\( */gm, "(");
  challenge = challenge.replace(/ *\) */gm, ")");
  challenge = challenge.replace("console.", "");
  challenge = challenge.replace("this.angular.isObject(offset)", "true");
  challenge = challenge.replace("this.angular.isString(offset)", "true");
  challenge = challenge.replace("this.angular.isDate(offset)", "true");
  challenge = challenge.replace("this.angular.isArray(offset)", "true");
  (() => {
    let solver = Function(`${_eval}${challenge}`);
    solved = solver().toString();
  })();
  return solved;
}

function concatTokens(headerToken, challengeToken) {
  let token = "";
  for (let i = 0; i < headerToken.length; i++) {
    let char = headerToken.charCodeAt(i);
    let mod = challengeToken.charCodeAt(i % challengeToken.length);
    let decodedChar = char ^ mod;
    token += String.fromCharCode(decodedChar);
  }
  return token;
}
