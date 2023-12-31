<template>
  <br /><br />
  <div class="flexRow">
    <div class="flexCol">
      <h3>Saving<br /><br /></h3>
      <div
        class="flexRow"
        v-for="rowID in Math.ceil(OPTION_DATA.SAVING.length / 2)"
        :key="rowID"
      >
        <button
          @click="OPTION_DATA.SAVING[rowID * 2 - 2].action()"
          :style="OPTION_DATA.SAVING[rowID * 2 - 2].style ?? []"
          class="btn opt"
          :class="OPTION_DATA.SAVING[rowID * 2 - 2].classes ?? {}"
        >
          {{ parseFunc(OPTION_DATA.SAVING[rowID * 2 - 2].text) }}
        </button>
        <button
          v-if="OPTION_DATA.SAVING.length > rowID * 2 - 1"
          @click="OPTION_DATA.SAVING[rowID * 2 - 1].action()"
          :style="OPTION_DATA.SAVING[rowID * 2 - 1].style ?? []"
          class="btn opt"
          :class="OPTION_DATA.SAVING[rowID * 2 - 1].classes ?? {}"
        >
          {{ parseFunc(OPTION_DATA.SAVING[rowID * 2 - 1].text) }}
        </button>
      </div>
    </div>

    <div class="flexCol">
      <h3>Other<br /><br /></h3>
      <div
        class="flexRow"
        v-for="rowID in Math.ceil(OPTION_DATA.OTHER.length / 2)"
        :key="rowID"
      >
        <button
          @click="OPTION_DATA.OTHER[rowID * 2 - 2].action()"
          :style="OPTION_DATA.OTHER[rowID * 2 - 2].style ?? []"
          class="btn opt"
          :class="OPTION_DATA.OTHER[rowID * 2 - 2].classes ?? {}"
        >
          {{ parseFunc(OPTION_DATA.OTHER[rowID * 2 - 2].text) }}
        </button>
        <button
          v-if="OPTION_DATA.OTHER.length > rowID * 2 - 1"
          @click="OPTION_DATA.OTHER[rowID * 2 - 1].action()"
          :style="OPTION_DATA.OTHER[rowID * 2 - 1].style ?? []"
          class="btn opt"
          :class="OPTION_DATA.OTHER[rowID * 2 - 1].classes ?? {}"
        >
          {{ parseFunc(OPTION_DATA.OTHER[rowID * 2 - 1].text) }}
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="loadModalOpen"
    id="loadModalContainer"
    @click="loadModalOpen = false"
  ></div>
  <div v-if="loadModalOpen" id="loadModal" class="flexCol">
    <br />
    <div v-for="save in metaSave.saves" :key="save.saveID">
      <h4>{{ save.saveName }}</h4>
      <div v-if="save.modes.length > 0">Modes: {{ save.modes.join(", ") }}</div>
      Distance: {{ formatDistance(save.distance) }}<br />
      <button class="btn" @click="loadSpecificSave(save.saveID)">Load</button>
      <button class="btn" @click="renameSpecificSave(save.saveID)">
        Rename
      </button>
      <button class="btn neg" @click="deleteSpecificSave(save.saveID)">
        Delete</button
      ><br /><br />
    </div>
  </div>
</template>

<script setup lang="ts">
import { OPTION_DATA, loadModalOpen } from "./options";
import { loadSpecificSave, deleteSpecificSave } from "@/util/saveload";
import { parseFunc, formatDistance } from "@/util/format";
import { metaSave } from "@/main";
import { useQuasar } from "quasar";

const $q = useQuasar();

function renameSpecificSave(id: number) {
  $q.dialog({
    dark: true,
    message: "Rename your save to:",
    prompt: {
      model: metaSave.saves[id].saveName,
      type: "text",
    },
  }).onOk((name) => {
    metaSave.saves[id].saveName = name ?? "Save #" + id;
  });
}
</script>

<style>
.flexRow {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}

.flexRow.center {
  justify-content: center;
}
.JCstart {
  justify-content: flex-start;
}

.flexCol {
  display: flex;
  flex-flow: column wrap;
  justify-content: space-around;
}
</style>

<style scoped>
.opt {
  background-color: hsl(5, 5%, 25%);
  border: hsl(5, 5%, 15%) 2px solid;
  padding-left: 5px;
  padding-right: 5px;
  width: 100px;
  height: 100px;
}

.opt:hover {
  background-color: hsl(5, 5%, 40%);
}

#loadModalContainer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(100, 100, 100, 0.4);
}

#loadModal {
  position: absolute;
  top: calc(50vh - 250px);
  left: calc(50vw - 300px);
  width: 600px;
  height: 500px;
  background-color: rgb(40, 40, 40);
  border: rgb(60, 60, 80) 5px solid;
  z-index: 1001;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: bold;
}
</style>
