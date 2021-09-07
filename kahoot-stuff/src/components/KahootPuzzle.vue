<template>
  <v-dialog v-model="$kahoot.sortable.open" persistent max-width="400">
    <v-card>
      <v-card-text>
        <v-row no-gutters class="pt-6">
          <v-col class="mx-2">
            <h4 class="text-center">Answer order</h4>
            <draggable
              class="mx-4 list-group text-center"
              ghost-class="ghost"
              v-model="$kahoot.sortable.order"
              @start="dragging = true"
              @end="dragging = false"
            >
              <div
                v-for="item in $kahoot.sortable.order"
                :key="item.color"
                class="list-group-item my-2 py-2 px-2 text-center"
                :id="item.id"
              >
                {{ item.color }}
              </div>
            </draggable>
          </v-col>
          <v-col class="mx-2">
            <h4 class="text-center">Correct order</h4>
            <div class="list-group mx-4">
              <div
                v-for="item in $kahoot.sortable.correct"
                :key="item"
                class="list-group-item my-2 py-2 px-2 text-center"
              >
                {{ item }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          style="style='-webkit-animation: color 20s infinite;
              animation: color 10s infinite;
              -webkit-animation-direction: alternate;
              animation-direction: alternate;'"
          text
          @click="$kahoot.sortableAnswer()"
          >Answer</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "VuePuzzle",
  components: {
    draggable: () => import("vuedraggable")
  },
  data() {
    return {
      dragging: false
    };
  }
};
</script>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #808080;
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
  min-width: 128px;
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
