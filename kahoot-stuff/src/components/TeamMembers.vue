<template>
  <v-dialog
    v-model="this.$globals.showTeamMembersUi"
    persistent
    max-width="400"
  >
    <v-card>
      <v-card-text>
        <v-row no-gutters class="py-6">
          <v-col class="mr-4">
            <h4 class="text-center">Team Members</h4>
          </v-col>
        </v-row>
        <div class="text-center mx-6">
          <div
            class="mx-auto"
            v-for="(item, index) in teamMembers"
            :key="index"
          >
            <v-text-field
              outlined
              dense
              @keyup.enter="$kahoot.mainPlayerTeamMembers(teamMembers)"
              :key="index"
              append-icon="mdi-close"
              @click:append="RemoveMember(index)"
              v-model="item.name"
              label="Member name"
            ></v-text-field>
          </div>
        </div>
        <div class="d-flex text-center mx-6">
          <v-btn class="mx-auto" block outlined @click="AddMember()"
            >Add member</v-btn
          >
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          style="style='-webkit-animation: color 20s infinite;
              animation: color 10s infinite;
              -webkit-animation-direction: alternate;
              animation-direction: alternate;'"
          text
          @click="$kahoot.mainPlayerTeamMembers(teamMembers)"
          >Join</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      teamMembers: []
    };
  },
  methods: {
    AddMember() {
      this.teamMembers.push({ name: "" });
    },
    RemoveMember(index) {
      if (this.teamMembers.length > 1) this.teamMembers.splice(index, 1);
    }
  },
  mounted() {
    if (this.$kahoot.players.length > 0)
      this.teamMembers = [{ name: this.$kahoot.players[0].username }];
  }
};
</script>

<style></style>
