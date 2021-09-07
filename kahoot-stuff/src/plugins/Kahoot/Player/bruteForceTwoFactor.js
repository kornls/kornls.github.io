import TwoFactorLogin from "./twoFactorLogin";

function bruteForceTwoFactor() {
  const combinations = [
    "0123",
    "0132",
    "0213",
    "0231",
    "0321",
    "0312",
    "1023",
    "1032",
    "1203",
    "1230",
    "1302",
    "1320",
    "2013",
    "2031",
    "2103",
    "2130",
    "2301",
    "2310",
    "3012",
    "3021",
    "3102",
    "3120",
    "3201",
    "3210",
  ];
  combinations.forEach((combi, index) => {
    const timeout = setTimeout(() => {
      if (!this.loggedIn) {
        TwoFactorLogin.call(this, combi);
      }

      this.timeouts.splice(this.timeouts.indexOf(timeout), 1);
    }, index * (1000 / combinations.length));

    this.timeouts.push(timeout);
  });
}

function stopBruteForce() {
  this.timeouts.forEach((timeout, index) => {
    clearTimeout(timeout);
    this.timeouts.splice(index, 1);
  });
}

const BruteForce2FA = {
  Start: bruteForceTwoFactor,
  Stop: stopBruteForce,
};

export default BruteForce2FA;
