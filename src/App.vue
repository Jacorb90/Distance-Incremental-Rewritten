<template>
  <div class="left">
    <Basics />
  </div>
  <div class="right">Tabs go here</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import player, { gameLoop } from "./main";
import { loadSave, saveGame, versionControl } from "./saveload";
import basics from "./features/basics/basics";
import { signal } from "./util/feature";

export default defineComponent({
  name: "App",
  components: {
    Basics: basics.component,
  },
  mounted() {
    const metaSave = loadSave();
    player.value = metaSave.saves[metaSave.currentSave];
    versionControl(player.value);

    signal("load", 0);

    gameLoop();

    setInterval(() => {
      if (player.value?.opts.autoSave) saveGame(metaSave);
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
