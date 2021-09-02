<template>
  <v-app>
    <v-content class="d-flex flex-row align-center">
      <v-card
        class="ma-auto pb-10"
        style="max-width: 1000px; max-height: 1000px"
      >
        <v-card-title>Settings</v-card-title>
        <v-row no-gutters class="text-center px-12">
          <v-col class="mx-6 d-flex flex-column">
            <v-row no-gutters class="text-center">
              <v-switch
                v-model="$globals.options.randomBotNames"
                class="ma-auto"
                :label="
                  `Random bot names: ${boolToString(
                    $globals.options.randomBotNames
                  )}`
                "
              ></v-switch>
            </v-row>
          </v-col>
          <v-col class="mx-6 d-flex flex-column">
            <v-row no-gutters class="text-center">
              <v-switch
                v-model="$globals.options.closeDrawerOnClick"
                class="ma-auto"
                :label="
                  `Close drawer on click: ${boolToString(
                    $globals.options.closeDrawerOnClick
                  )}`
                "
              ></v-switch>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters class="text-center px-12">
          <v-col class="mx-6 d-flex flex-column">
            <v-row no-gutters class="text-center">
              <v-switch
                v-model="$globals.options.dark"
                class="ma-auto"
                :label="`Dark mode: ${boolToString($globals.options.dark)}`"
              ></v-switch>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters class="text-center px-12">
          <v-col class="mx-6 my-2 d-flex flex-column">
            <v-row no-gutters class="text-center">
              <v-text-field
                v-model="$globals.options.kahootSearchAmount"
                :rules="numberRules"
                class="ml-2"
                label="Kahoot search limit"
                hide-details="auto"
              ></v-text-field>
            </v-row>
          </v-col>
          <v-col class="mx-6 my-2 d-flex flex-column">
            <v-row no-gutters class="text-center">
              <v-text-field
                v-model="$globals.options.answerCorrect"
                :rules="numberRules"
                class="ml-2"
                label="Answer correct"
                hide-details="auto"
                append-icon="mdi-percent-outline"
              ></v-text-field>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters class="text-center px-12">
          <v-col class="mx-6 my-2 d-flex flex-column">
            <v-row no-gutters class="text-center">
              <v-text-field
                v-model="$globals.options.minAnswerDelay"
                :rules="minAnswerDelayRules"
                @blur="validateDelay(1)"
                class="ml-2"
                label="Min answer delay (ms)"
                hide-details="auto"
              ></v-text-field>
            </v-row>
          </v-col>
          <v-col class="mx-6 my-2 d-flex flex-column">
            <v-row no-gutters class="text-center">
              <v-text-field
                v-model="$globals.options.maxAnswerDelay"
                :rules="maxAnswerDelayRules"
                @blur="validateDelay(2)"
                class="ml-2"
                label="Max answer delay (ms)"
                hide-details="auto"
              ></v-text-field>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-content>
  </v-app>
</template>

<script>
module.exports = {
  name: "Settings",
  data: () => {
    return {
      numberRules: [
        value => {
          let regex = /^[0-9]*$/gm;
          return (
            regex.test(value) ||
            (value == "" || value == null ? true : "Has to be a number")
          );
        }
      ],
      minAnswerDelayRules: [true],
      maxAnswerDelayRules: [true]
    };
  },
  methods: {
    boolToString(bool) {
      return bool === true ? "Enabled" : "Disabled";
    },
    validateDelay(type) {
      let regex = /^[0-9]*$/gm;
      this.minAnswerDelayRules = [true];
      this.maxAnswerDelayRules = [true];

      switch (type) {
        case 1:
          if (!regex.test(this.$globals.options.minAnswerDelay))
            return (this.minAnswerDelayRules = ["Has to be a number"]);

          if (
            Number(this.$globals.options.minAnswerDelay) >
            Number(this.$globals.options.maxAnswerDelay)
          ) {
            return (this.minAnswerDelayRules = [
              "Cannot be larger than max delay"
            ]);
          }
          break;
        case 2:
          if (!regex.test(this.$globals.options.maxAnswerDelay))
            return (this.maxAnswerDelayRules = ["Has to be a number"]);

          if (
            Number(this.$globals.options.maxAnswerDelay) <
            Number(this.$globals.options.minAnswerDelay)
          ) {
            return (this.maxAnswerDelayRules = [
              "Cannot be smaller than min delay"
            ]);
          }
          break;
      }
    }
  },
  computed: {
    darkMode() {
      return this.$globals.options.dark;
    }
  },
  watch: {
    darkMode() {
      this.$vuetify.theme.dark = this.darkMode;
    }
  }
};
</script>
