<template>
  <v-app>
    <v-row class="mb-6" no-gutters>
      <v-col xl="8" lg="10" md="12" class="ma-auto">
        <h1
          class="display-3 font-weight-medium text-center"
          v-if="$vuetify.breakpoint.smAndUp"
          style="margin: 88px 0 1vh"
        >
          Kahoot Rocks FAQ
        </h1>
        <h1
          class="display-1 font-weight-medium text-center"
          v-if="!$vuetify.breakpoint.smAndUp"
          style="margin: 80px 0 1vh"
        >
          Kahoot Rocks FAQ
        </h1>
        <div class="ad mx-auto my-6 d-flex">
          <h4 class="ma-auto">Version: {{ $globals.version }}</h4>
        </div>
        <div class="ad mx-auto my-12 d-flex">
          <div id="kahoot-rocks_728x90">
            <script type="application/javascript">
              aiptag.cmd.display.push(function() {
                aipDisplayTag.display("kahoot-rocks_728x90");
              });
            </script>
          </div>

          <div id="kahoot-rocks_300x250">
            <script type="application/javascript">
              aiptag.cmd.display.push(function() {
                aipDisplayTag.display("kahoot-rocks_300x250");
              });
            </script>
          </div>
        </div>
        <v-card class="ma-4">
          <v-card-title>What is Kahoot Rocks?</v-card-title>
          <v-card-text>
            Kahoot Rocks is a website made for the sole purpose of getting first
            in every Kahoot you play. Whether it be to show off to your friends,
            mess with a teacher, or win a prize, Kahoot Rocks will work for you.
          </v-card-text>
        </v-card>
        <v-card class="ma-4">
          <v-card-title>Why is the bot not working?</v-card-title>
          <v-card-text>
            There are a few reasons Kahoot.rocks might not be working properly,
            with the main one being that the Kahoot is private although there
            are a few settings that can be activated to stop bots from working.
            These are
            <code>Randomize order of questions</code>,
            <code>Randomize order of answers</code>
            and
            <code>2 Step Join</code>. The bot could also not be working if you
            are using an old version (clear your cache & force refresh the
            page). In general, if you want help, or the bot isn't working,
            create a ticket in our
            <a href="https://discord.gg/qyZ5cCn">Discord Server</a>
            (channel is #support). Our admins will respond as soon as they can.
            A very useful piece of information to help us diagnose the issue, is
            either the name of the Kahoot, or the URL to it (the one that allows
            you to host a game)
          </v-card-text>
        </v-card>
        <v-card class="ma-4">
          <v-card-title>How does it work?</v-card-title>
          <v-card-text>
            Kahoot.rocks works by acting as a client, and using the information
            it is sent to search for Kahoot's. As the quiz goes on, the bot will
            narrow down the possible candidates until there is only one. Because
            of the way this works, most of the time before the first question
            has even started, the bot already knows the correct answers. If the
            bot for some reason does not know or cannot find the answers,
            (normally on a private Kahoot because the answers aren't publicly
            available), it will answer randomly.
          </v-card-text>
        </v-card>
        <v-card class="ma-4">
          <v-card-title>Why does it exist?</v-card-title>
          <v-card-text>
            Kahoot.rocks was initially created as a fun way for me to learn
            JavaScript and Node.js, while making a fun tool at the same time to
            mess around with at school, although it soon expanded into a full-on
            project. The code went through many revisions, to increase speed and
            accuracy, along with the UI changing multiple times. Now the project
            is maintained, and new features are added when suggested. Updates
            are in the
            <a href="https://discord.gg/qyZ5cCn">Discord Server</a>
          </v-card-text>
        </v-card>
        <v-card class="ma-4">
          <v-card-title>Who made it?</v-card-title>
          <v-card-text>
            Kahoot.rocks was made by and is maintained by me (Charley Wright), a
            web developer from Scotland. I enjoys making projects that other
            people can benefit from, and also a challenge, such as learning a
            new technology or programming language. I mainly focusses on web
            development, although desktop apps and game dev are also quite
            interesting and fun. My current focus is server-side architechture
            and programming, and low-level networking.
          </v-card-text>
        </v-card>
        <v-card class="ma-4">
          <v-card-title>Why should it be used?</v-card-title>
          <v-card-text>
            Kahoot.rocks normally would be used when you either do not know the
            answers to the questions, or if you simply cannot be bothered
            answering although they can also be used if there is a prize for
            getting first or something similar. (Using a bot is unethical, and
            could result in you getting in trouble. That is entirely your fault,
            and we take no responsibility with how you use the bot). You can
            also use Kahoot.rocks for whatever reason you like, it's not set in
            stone or anything, and there aren't any rules.
          </v-card-text>
        </v-card>
        <v-card class="ma-4">
          <v-card-title>
            Some other stuff + Privacy policy & terms and conditions
          </v-card-title>
          <v-card-text>
            Because Kahoot.rocks is entirely free to use, it could potentially
            get shutdown at any time from any number of reasons. If you want,
            you can help out by
            <a href="https://paypal.me/charleyw0">donating</a> to help pay for
            the server costs. Kahoot.rocks is also a project, not a full
            enterprise level app, so there is no update schedule, fixes happen
            when they happen, and so do updates.
            <br />
            <br />Privacy policy is located at <a @click="Goto(7)">here</a>.
            Terms and conditions are located at <a @click="Goto(6)">here</a>.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
module.exports = {
  name: "Account",
  methods: {
    Goto(tab) {
      this.$globals.menuItem = tab;
    }
  }
};
</script>

<style scoped>
code {
  color: #fff;
  background-color: #121212;
}

@media only screen and (max-width: 850px) {
  .content {
    margin-top: 4px;
    margin: 10px;
  }

  #inputs {
    width: unset;
  }
}

@media only screen and (max-width: 420px) {
  .buttons {
    flex-direction: column;
  }
}

#kahoot-rocks_728x90,
#kahoot-rocks_300x250 {
  margin: auto;
}
@media only screen and (max-width: 850px) {
  #kahoot-rocks_300x250 {
    display: unset;
  }
  #kahoot-rocks_728x90 {
    display: none;
  }
}
@media only screen and (min-width: 850px) {
  #kahoot-rocks_300x250 {
    display: none;
  }
  #kahoot-rocks_728x90 {
    display: unset;
  }
}
</style>
