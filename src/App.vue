<template>
  <div class="left">
    <Basics />
    <div style="margin-top: 9em"></div>
  </div>
  <div class="right">
    <Tabs />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import player, { gameLoop, metaSave } from "./main";
import { loadSave, saveGame, versionControl } from "./saveload";
import basics from "./features/basics/basics";
import { signal } from "./util/feature";
import Tabs from "./flourish/tabs/tabs.vue";

// eslint-disable-next-line
export const save = ref(() => {});

export default defineComponent({
  name: "App",
  components: {
    Basics: basics.component,
    Tabs,
  },
  mounted() {
    metaSave.value = loadSave();
    player.value = metaSave.value.saves[metaSave.value.currentSave];
    versionControl(player.value);

    signal("load", 0);

    // eslint-disable-next-line
    save.value = () => saveGame(metaSave.value!);

    gameLoop();

    setInterval(() => {
      // eslint-disable-next-line
      if (player.value?.opts.autoSave) saveGame(metaSave.value!);
    }, 5000);
  },
});
</script>

<style>
* {
  color: white;
  margin: 0 auto;
  text-align: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  overflow: hidden;
  transition-duration: 0.2s;
}

body {
  background-color: rgb(28, 28, 28);
}

#app {
  display: flex;
}

.left {
  flex: 4;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 100vh;
}

.right {
  flex: 1;
  z-index: 5;
  border-left: thick solid hsl(0, 0%, 30%);
  min-height: 100vh;
}

.band {
  width: 100%;
  min-height: 75px;
}

.lb {
  background-color: hsl(0, 0%, 20%);
}
</style>
