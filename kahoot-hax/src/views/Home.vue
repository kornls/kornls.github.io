<template>
  <v-app>
    <v-overlay :value="$globals.loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <div v-if="!$globals.loading">
      <v-app-bar app>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title v-if="$vuetify.breakpoint.smAndUp"
          >Kahoot Rocks</v-toolbar-title
        >
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" app temporary>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-center display-1"
              >Kahoot Rocks</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list flat>
          <v-list-item-group v-model="menuItem" color="primary">
            <v-list-item>
              <v-list-item-icon>
                <v-icon v-if="menuItem != 0 && menuItem != undefined"
                  >mdi-home</v-icon
                >
                <v-icon
                  v-if="menuItem == 0 || menuItem == undefined"
                  color="primary"
                  >mdi-home</v-icon
                >
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-if="menuItem != 0 && menuItem != undefined"
                  >Home</v-list-item-title
                >
                <v-list-item-title
                  v-if="menuItem == 0 || menuItem == undefined"
                  class="blue--text"
                  >Home</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-for="(item, i) in menuItems" :key="i">
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="DiscordClicked()">
              <v-list-item-icon>
                <v-icon>mdi-discord</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  :class="`${this.menuItem == 8 ? 'blue--text' : ''}`"
                  >Discord Server</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <div
          id="kahoot-rocks_300x250"
          style="transform: scale(0.9)"
          class="ma-0 pa-0"
        >
          <script type="application/javascript">
            aiptag.cmd.display.push(function() {
              aipDisplayTag.display("kahoot-rocks_300x250");
            });
          </script>
        </div>
      </v-navigation-drawer>

      <alert></alert>
      <teamMembers></teamMembers>
      <kahootName></kahootName>
      <kahootPuzzle></kahootPuzzle>
      <challengeNewName></challengeNewName>
      <challengePopoutImage></challengePopoutImage>
      <homePage v-if="menuItem == 0 || menuItem == undefined"></homePage>
      <challengePage v-if="menuItem == 1"></challengePage>
      <settingsPage v-if="menuItem == 2"></settingsPage>
      <infoPage v-if="menuItem == 3"></infoPage>
      <legalPage v-if="menuItem == 4"></legalPage>
    </div>
  </v-app>
</template>

<script>
export default {
  name: "Home",
  components: {
    homePage: () => import("../components/Tabs/Home"),
    challengePage: () => import("../components/Tabs/Challenge"),
    settingsPage: () => import("../components/Tabs/Settings"),
    infoPage: () => import("../components/Tabs/Info"),
    legalPage: () => import("../components/Tabs/Legal"),
    alert: () => import("../components/Alert"),
    teamMembers: () => import("../components/TeamMembers"),
    kahootName: () => import("../components/KahootName"),
    kahootPuzzle: () => import("../components/KahootPuzzle"),
    challengeNewName: () => import("../components/ChallengeNewName"),
    challengePopoutImage: () => import("../components/PopoutImage")
  },
  data: () => {
    return {
      menuItems: [
        {
          text: "Challenge",
          icon: "mdi-bullseye-arrow"
        },
        { text: "Settings", icon: "mdi-settings" },
        { text: "FAQ", icon: "mdi-forum" },
        { text: "Legal", icon: "mdi-file-document-outline" }
      ],
      dropdownItems: ["Logout"],
      drawer: null,
      errored: false
    };
  },
  computed: {
    userEmail() {
      return this.$globals.user.email;
    },
    menuItem: {
      get() {
        return this.$globals.menuItem;
      },
      set(value) {
        this.$globals.menuItem = value;
      }
    }
  },
  watch: {
    menuItem() {
      if (this.menuItem == 5) this.menuItem = 0;
      if (this.$globals.options.closeDrawerOnClick) this.drawer = false;
    }
  },
  methods: {
    DiscordClicked() {
      this.menuItem = 0;
      window.open("https://discord.gg/qyZ5cCn", "_blank");
    }
  },
  mounted() {
    this.$globals.loading = false;
  }
};
</script>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group-item {
  border-width: 2px;
  border-style: solid;
  border-radius: 10px;
}

#red-draggable,
#blue-draggable,
#yellow-draggable,
#green-draggable {
  cursor: grab;
}

#red-draggable {
  border-color: #e21b3c;
  color: #e21b3c;
}

#blue-draggable {
  border-color: #1368ce;
  color: #1368ce;
}

#yellow-draggable {
  border-color: #d89e00;
  color: #d89e00;
}

#green-draggable {
  border-color: #26890c;
  color: #26890c;
}
</style>
